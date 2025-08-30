'use server'

import { createServerSupabaseClient } from '@/lib/supabase-server'

/**
 * Get all active polls from the database with vote counts
 * @returns Array of polls with vote counts or error
 */
export async function getPolls() {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get polls with vote counts using a join query
    const { data, error } = await supabase
      .from('polls')
      .select(`
        *,
        votes:votes(count)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching polls:', error)
      return { success: false, error: error.message }
    }

    // Transform the data to include vote counts
    const pollsWithVotes = data?.map(poll => ({
      ...poll,
      vote_count: poll.votes?.[0]?.count || 0
    })) || []

    return { success: true, data: pollsWithVotes }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'Failed to fetch polls' }
  }
}

/**
 * Get a specific poll with its options and vote counts
 * @param pollId - The poll ID to fetch
 * @returns Poll with options and vote counts or error
 */
export async function getPollWithOptions(pollId: string) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get poll with options using the RPC function
    const { data, error } = await supabase
      .rpc('get_poll_with_options', { poll_uuid: pollId })

    if (error) {
      console.error('Error fetching poll with options:', error)
      return { success: false, error: error.message }
    }

    if (!data) {
      return { success: false, error: 'Poll not found' }
    }

    // Get total vote count for this poll
    const { count: totalVotes, error: voteCountError } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('poll_id', pollId)

    if (voteCountError) {
      console.error('Error fetching vote count:', voteCountError)
    }

    const pollData = data as { 
      poll: {
        id: string;
        title: string;
        description?: string;
        is_active: boolean;
        created_at: string;
        expires_at?: string;
        allow_multiple_votes: boolean;
      }; 
      options: Array<{
        id: string;
        option_text: string;
        option_order: number;
      }>;
    }

    return { 
      success: true, 
      data: {
        ...pollData,
        total_votes: totalVotes || 0
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'Failed to fetch poll' }
  }
}

/**
 * Create a new poll with options
 * @param pollData - The poll data to create
 * @returns Created poll or error
 */
export async function createPoll(pollData: { title: string; description?: string | null; expires_at?: string | null; allow_multiple_votes?: boolean; is_anonymous?: boolean; options: string[] }) {
  try {
    const supabase = await createServerSupabaseClient()
    // Start a transaction by creating the poll first
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({
        title: pollData.title,
        description: pollData.description,
        expires_at: pollData.expires_at,
        allow_multiple_votes: pollData.allow_multiple_votes || false,
        is_anonymous: pollData.is_anonymous || false,
      })
      .select()
      .single()

    if (pollError) {
      console.error('Error creating poll:', pollError)
      return { success: false, error: pollError.message }
    }

    // Create poll options
    const optionsToInsert = pollData.options.map((option, index) => ({
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
      return { success: false, error: optionsError.message }
    }

    return { success: true, data: poll }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'Failed to create poll' }
  }
}

/**
 * Submit a vote for a poll option
 * @param voteData - The vote data to submit
 * @returns Created vote or error
 */
// submitVote function moved to lib/actions/vote.ts

/**
 * Get poll results with vote counts and percentages
 * @param pollId - The poll ID to get results for
 * @returns Poll results or error
 */
export async function getPollResults(pollId: string) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('poll_results')
      .select('*')
      .eq('poll_id', pollId)
      .order('option_order')

    if (error) {
      console.error('Error fetching poll results:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'Failed to fetch poll results' }
  }
}

/**
 * Check if the current user has voted on a poll
 * @param pollId - The poll ID to check
 * @returns Boolean indicating if user has voted or error
 */
export async function checkUserHasVoted(pollId: string) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .rpc('user_has_voted', { poll_uuid: pollId })

    if (error) {
      console.error('Error checking user vote status:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'Failed to check vote status' }
  }
}

/**
 * Get polls created by the current user
 * @returns Array of user's polls or error
 */
export async function getUserPolls() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('polls')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user polls:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'Failed to fetch user polls' }
  }
}

/**
 * Update a poll's status (activate/deactivate)
 * @param pollId - The poll ID to update
 * @param isActive - The new active status
 * @returns Updated poll or error
 */
export async function updatePollStatus(pollId: string, isActive: boolean) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('polls')
      .update({ is_active: isActive })
      .eq('id', pollId)
      .select()
      .single()

    if (error) {
      console.error('Error updating poll status:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'Failed to update poll status' }
  }
}