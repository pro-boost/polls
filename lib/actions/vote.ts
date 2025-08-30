'use server'

import { createServerSupabaseClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

/**
 * Submit a vote for a poll option
 * @param pollId - The ID of the poll
 * @param optionIds - Array of option IDs being voted for
 * @returns Success/error response
 */
export async function submitVote(pollId: string, optionIds: string[]) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get current user (optional - for anonymous voting)
    const { data: { user } } = await supabase.auth.getUser()
    
    // Insert votes for each selected option
    const votes = optionIds.map(optionId => ({
      poll_id: pollId,
      option_id: optionId,
      user_id: user?.id || null, // Allow anonymous voting
      created_at: new Date().toISOString()
    }))
    
    const { error } = await supabase
      .from('votes')
      .insert(votes)
    
    if (error) {
      console.error('Error submitting vote:', error)
      return {
        success: false,
        error: 'Failed to submit vote. Please try again.'
      }
    }
    
    // Revalidate the poll page to show updated results
    revalidatePath(`/polls/${pollId}`)
    
    return {
      success: true,
      message: 'Vote submitted successfully!'
    }
  } catch (error) {
    console.error('Error in submitVote:', error)
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.'
    }
  }
}