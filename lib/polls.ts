// Poll-related types and utilities

export interface PollOption {
  id: string
  text: string
  votes: number
  percentage: number
}

export interface Poll {
  id: string
  title: string
  description?: string
  options: PollOption[]
  totalVotes: number
  createdAt: string
  endDate?: string
  isActive: boolean
  allowMultiple: boolean
  showResults: boolean
  requireAuth: boolean
  creator: string
  creatorId: string
}

export interface CreatePollData {
  title: string
  description?: string
  options: string[]
  allowMultiple: boolean
  showResults: boolean
  requireAuth: boolean
  endDate?: string
}

export interface VoteData {
  pollId: string
  optionIds: string[]
  userId?: string
}

export interface PollFilters {
  status?: 'active' | 'closed' | 'all'
  sortBy?: 'newest' | 'oldest' | 'most_votes'
  search?: string
}

// Placeholder poll functions
export async function getPolls(_filters?: PollFilters): Promise<Poll[]> {
  // TODO: Implement actual API call to fetch polls
  throw new Error('Poll fetching not implemented yet')
}

export async function getPollById(_id: string): Promise<Poll | null> {
  // TODO: Implement actual API call to fetch poll by ID
  throw new Error('Poll fetching not implemented yet')
}

export async function createPoll(_data: CreatePollData): Promise<Poll> {
  // TODO: Implement actual API call to create poll
  throw new Error('Poll creation not implemented yet')
}

export async function votePoll(_voteData: VoteData): Promise<void> {
  // TODO: Implement actual API call to vote on poll
  throw new Error('Poll voting not implemented yet')
}

export async function deletePoll(_id: string): Promise<void> {
  // TODO: Implement actual API call to delete poll
  throw new Error('Poll deletion not implemented yet')
}

export function calculatePercentages(options: PollOption[]): PollOption[] {
  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0)
  
  if (totalVotes === 0) {
    return options.map(option => ({ ...option, percentage: 0 }))
  }
  
  return options.map(option => ({
    ...option,
    percentage: Math.round((option.votes / totalVotes) * 100 * 10) / 10
  }))
}

export function validatePollData(data: CreatePollData): string[] {
  const errors: string[] = []
  
  if (!data.title.trim()) {
    errors.push('Poll title is required')
  }
  
  if (data.title.length > 200) {
    errors.push('Poll title must be less than 200 characters')
  }
  
  if (data.description && data.description.length > 1000) {
    errors.push('Poll description must be less than 1000 characters')
  }
  
  if (data.options.length < 2) {
    errors.push('Poll must have at least 2 options')
  }
  
  if (data.options.length > 10) {
    errors.push('Poll cannot have more than 10 options')
  }
  
  const validOptions = data.options.filter(option => option.trim().length > 0)
  if (validOptions.length < 2) {
    errors.push('Poll must have at least 2 non-empty options')
  }
  
  data.options.forEach((option, index) => {
    if (option.length > 100) {
      errors.push(`Option ${index + 1} must be less than 100 characters`)
    }
  })
  
  if (data.endDate) {
    const endDate = new Date(data.endDate)
    const now = new Date()
    if (endDate <= now) {
      errors.push('End date must be in the future')
    }
  }
  
  return errors
}
