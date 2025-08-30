'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient, getCurrentUser } from '@/lib/supabase-server'
import { Database } from '@/types/database'

type PollInsert = Database['public']['Tables']['polls']['Insert']
type PollOptionInsert = Database['public']['Tables']['poll_options']['Insert']
type VoteInsert = Database['public']['Tables']['votes']['Insert']

/**
 * Server Action to create a new poll with options
 * @param formData - Form data containing poll information
 */
export async function createPollAction(formData: FormData) {
  try {
    // Get authenticated user
    const user = await getCurrentUser()
    
    if (!user) {
      throw new Error('Authentication required to create polls')
    }

    // Get Supabase client
    const supabase = await createServerSupabaseClient()
    
    // Extract form data
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const allowMultipleVotes = formData.get('allowMultiple') === 'true'
    const isAnonymous = formData.get('requireAuth') !== 'true' // Inverted logic
    const expiresAt = formData.get('endDate') as string
    
    // Get options from form data
    const options: string[] = []
    let optionIndex = 0
    while (formData.get(`option-${optionIndex}`) !== null) {
      const option = formData.get(`option-${optionIndex}`) as string
      if (option.trim()) {
        options.push(option.trim())
      }
      optionIndex++
    }

    // Validation
    if (!title?.trim()) {
      throw new Error('Poll title is required')
    }

    if (options.length < 2) {
      throw new Error('At least 2 options are required')
    }

    // Create poll data object
    const pollData: PollInsert = {
      title: title.trim(),
      description: description?.trim() || null,
      allow_multiple_votes: allowMultipleVotes,
      is_anonymous: isAnonymous,
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
      created_by: user.id,
    }

    // Create the poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert(pollData)
      .select()
      .single()

    if (pollError) {
      console.error('Error creating poll:', pollError)
      throw new Error(`Failed to create poll: ${pollError.message}`)
    }

    // Create poll options
    const optionsToInsert: PollOptionInsert[] = options.map((option, index) => ({
      poll_id: poll.id,
      option_text: option,
      option_order: index,
    }))

    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(optionsToInsert)

    if (optionsError) {
      console.error('Error creating poll options:', optionsError)
      // Clean up the poll if options failed
      await supabase.from('polls').delete().eq('id', poll.id)
      throw new Error(`Failed to create poll options: ${optionsError.message}`)
    }

    // Revalidate the polls page to show the new poll
    revalidatePath('/polls')
    
    // Return success with poll data for client-side handling
    return {
      success: true,
      poll: poll,
      message: 'Poll created successfully!'
    }
    
  } catch (error) {
    console.error('Error in createPollAction:', error)
    
    // Return error state instead of throwing to handle gracefully
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create poll'
    }
  }
}

/**
 * Server Action to submit a vote
 * @param formData - Form data containing vote information
 */
export async function submitVoteAction(formData: FormData) {
  try {
    // Get authenticated user
    const user = await getCurrentUser()
    
    if (!user) {
      throw new Error('Authentication required to vote')
    }

    // Get Supabase client
    const supabase = await createServerSupabaseClient()
    
    const pollId = formData.get('pollId') as string
    const optionId = formData.get('optionId') as string

    if (!pollId || !optionId) {
      throw new Error('Poll ID and option ID are required')
    }

    // Check if poll exists and is active
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('id, is_active, expires_at, allow_multiple_votes')
      .eq('id', pollId)
      .single()

    if (pollError || !poll) {
      throw new Error('Poll not found')
    }

    if (!poll.is_active) {
      throw new Error('This poll is no longer active')
    }

    if (poll.expires_at && new Date(poll.expires_at) < new Date()) {
      throw new Error('This poll has expired')
    }

    // Check if user has already voted (if multiple votes not allowed)
    if (!poll.allow_multiple_votes) {
      const { data: existingVote } = await supabase
        .from('votes')
        .select('id')
        .eq('poll_id', pollId)
        .eq('user_id', user.id)
        .single()

      if (existingVote) {
        throw new Error('You have already voted on this poll')
      }
    }

    // Create vote data
    const voteData: VoteInsert = {
      poll_id: pollId,
      option_id: optionId,
      user_id: user.id,
    }

    // Submit the vote
    const { error: voteError } = await supabase
      .from('votes')
      .insert(voteData)

    if (voteError) {
      console.error('Error submitting vote:', voteError)
      throw new Error(`Failed to submit vote: ${voteError.message}`)
    }

    // Revalidate the poll page to show updated results
    revalidatePath(`/polls/${pollId}`)
    
    return {
      success: true,
      message: 'Vote submitted successfully'
    }
    
  } catch (error) {
    console.error('Error in submitVoteAction:', error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create poll'
    }
  }
}