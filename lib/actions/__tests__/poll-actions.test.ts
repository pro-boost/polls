import { createPollAction, submitVoteAction } from '../poll-actions'
import { createServerSupabaseClient, getCurrentUser } from '../../supabase-server'
import { revalidatePath } from 'next/cache'

// Mock dependencies
jest.mock('../../supabase-server')
jest.mock('next/cache')

const mockCreateServerSupabaseClient = createServerSupabaseClient as jest.MockedFunction<typeof createServerSupabaseClient>
const mockGetCurrentUser = getCurrentUser as jest.MockedFunction<typeof getCurrentUser>
const mockRevalidatePath = revalidatePath as jest.MockedFunction<typeof revalidatePath>

// Mock functions
const mockInsert = jest.fn()
const mockSelect = jest.fn()
const mockEq = jest.fn()
const mockSingle = jest.fn()
const mockDelete = jest.fn()

// Define a typed Supabase-like response to avoid using `any`
type SupabaseResponse<T> = { data: T | null; error: { message: string } | null }

// Create a mock that can be both awaited and chained
const createAwaitableChainMock = <T>(resolvedValue: SupabaseResponse<T>) => {
  const chainMock = {
    select: jest.fn().mockReturnValue({
      single: mockSingle
    }),
    then: (resolve: (value: SupabaseResponse<T>) => unknown) => resolve(resolvedValue),
    catch: (_reject: (reason: unknown) => unknown) => Promise.resolve(resolvedValue)
  }
  return chainMock
}

// Create comprehensive mock that handles all query patterns
const createSupabaseTableMock = () => ({
  // For insert operations - can be chained with .select().single() or used directly
  insert: mockInsert,
  // For select operations - chained with .eq().single() or .eq().eq().single()
  select: jest.fn().mockReturnValue({
    eq: jest.fn().mockReturnValue({
      single: mockSingle,
      eq: jest.fn().mockReturnValue({
        single: mockSingle
      })
    })
  }),
  // For delete operations - chained with .eq()
  delete: () => {
    mockDelete() // Track the call
    return {
      eq: mockEq
    }
  }
})

// Mock Supabase client with proper chaining
const mockSupabaseClient = {
  from: jest.fn(() => createSupabaseTableMock())
}

// Derive the concrete Supabase client type that createServerSupabaseClient resolves to
// This avoids importing Supabase types and keeps typing accurate to the app code
type SupabaseClientType = Awaited<ReturnType<typeof createServerSupabaseClient>>

// Mock user with proper Supabase User type structure
const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  aud: 'authenticated',
  role: 'authenticated',
  email_confirmed_at: '2023-01-01T00:00:00.000Z',
  phone: '',
  confirmed_at: '2023-01-01T00:00:00.000Z',
  last_sign_in_at: '2023-01-01T00:00:00.000Z',
  app_metadata: {},
  user_metadata: {},
  identities: [],
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z'
}

describe('Poll Actions', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks()
    mockInsert.mockReset()
    mockSelect.mockReset()
    mockEq.mockReset()
    mockSingle.mockReset()
    mockDelete.mockReset()
    
    // Configure mockInsert to handle both chained and direct calls
    mockInsert.mockImplementation(() => createAwaitableChainMock<{ id: string }>({ data: null, error: null }))
    
    // Configure mockEq to return a resolved promise for delete operations
    mockEq.mockResolvedValue({ error: null })
    
    // Reset mock functions
    mockSupabaseClient.from.mockReturnValue(createSupabaseTableMock())
    
    mockCreateServerSupabaseClient.mockResolvedValue(mockSupabaseClient as unknown as SupabaseClientType)
  })

  describe('createPollAction', () => {
    const mockPoll = {
      id: 'poll-123',
      title: 'Test Poll',
      description: 'Test Description',
      created_by: 'user-123'
    }

    /**
     * Helper function to create FormData for testing
     */
    const createFormData = (data: Record<string, string | boolean>) => {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value))
      })
      return formData
    }

    it('should create a poll successfully with valid data', async () => {
      // Arrange
      mockGetCurrentUser.mockResolvedValue(mockUser)
      // Mock poll creation (uses .insert().select().single())
      mockSingle.mockResolvedValueOnce({ data: mockPoll, error: null })
      // Mock options creation (direct insert) - need to call it twice, once for poll, once for options
      mockInsert
        .mockReturnValueOnce(createAwaitableChainMock({ data: mockPoll, error: null })) // Poll creation
        .mockImplementationOnce(() => Promise.resolve({ data: null, error: null })) // Options creation

      const formData = createFormData({
        title: 'Test Poll',
        description: 'Test Description',
        allowMultiple: 'true',
        requireAuth: 'true',
        endDate: '2024-12-31T23:59:59.000Z',
        'option-0': 'Option 1',
        'option-1': 'Option 2'
      })

      // Act
      const result = await createPollAction(formData)

      // Assert
      expect(result.success).toBe(true)
      expect(result.poll).toEqual(mockPoll)
      expect(result.message).toBe('Poll created successfully!')
      expect(mockRevalidatePath).toHaveBeenCalledWith('/polls')
    })

    it('should return error when user is not authenticated', async () => {
      // Arrange
      mockGetCurrentUser.mockResolvedValue(null)
      const formData = createFormData({ title: 'Test Poll' })

      // Act
      const result = await createPollAction(formData)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Authentication required to create polls')
    })

    it('should return error when title is missing', async () => {
      // Arrange
      mockGetCurrentUser.mockResolvedValue(mockUser)
      const formData = createFormData({
        title: '',
        'option-0': 'Option 1',
        'option-1': 'Option 2'
      })

      // Act
      const result = await createPollAction(formData)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Poll title is required')
    })

    it('should return error when less than 2 options provided', async () => {
      // Arrange
      mockGetCurrentUser.mockResolvedValue(mockUser)
      const formData = createFormData({
        title: 'Test Poll',
        'option-0': 'Option 1'
      })

      // Act
      const result = await createPollAction(formData)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('At least 2 options are required')
    })

    it('should handle poll creation database error', async () => {
      // Arrange
      mockGetCurrentUser.mockResolvedValue(mockUser)
      const pollError = { message: 'Database error' }
      mockSingle.mockResolvedValue({ data: null, error: pollError })

      const formData = createFormData({
        title: 'Test Poll',
        'option-0': 'Option 1',
        'option-1': 'Option 2'
      })

      // Act
      const result = await createPollAction(formData)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to create poll: Database error')
    })

    it('should handle poll options creation error and cleanup poll', async () => {
      // Arrange
      mockGetCurrentUser.mockResolvedValue(mockUser)
      const _optionsError = { message: 'Options error' }
      
      // Mock successful poll creation
      mockSingle.mockResolvedValueOnce({ data: mockPoll, error: null })
      
      // Mock poll and options creation
      mockInsert
        .mockReturnValueOnce(createAwaitableChainMock({ data: mockPoll, error: null })) // Poll creation
        .mockImplementationOnce(() => Promise.resolve({ data: null, error: _optionsError })) // Failed options creation
      
      // Mock cleanup delete
      mockDelete.mockResolvedValue({ error: null })

      const formData = createFormData({
        title: 'Test Poll',
        'option-0': 'Option 1',
        'option-1': 'Option 2'
      })

      // Act
      const result = await createPollAction(formData)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to create poll options: Options error')
      expect(mockDelete).toHaveBeenCalled()
    })

    it('should filter out empty options', async () => {
      // Arrange
      mockGetCurrentUser.mockResolvedValue(mockUser)
      // Mock poll creation (uses .insert().select().single())
      mockSingle.mockResolvedValueOnce({ data: mockPoll, error: null })
      // Mock poll and options creation
      mockInsert
        .mockReturnValueOnce(createAwaitableChainMock({ data: mockPoll, error: null })) // Poll creation
        .mockImplementationOnce(() => Promise.resolve({ data: null, error: null })) // Options creation

      const formData = createFormData({
        title: 'Test Poll',
        'option-0': 'Option 1',
        'option-1': '', // Empty option
        'option-2': 'Option 2',
        'option-3': '   ' // Whitespace only
      })

      // Act
      const result = await createPollAction(formData)

      // Assert
      expect(result.success).toBe(true)
      // Should only have 2 valid options after filtering
    })
  })

  describe('submitVoteAction', () => {
    // Using the global mockUser defined at the top of the file
    const mockPoll = {
      id: 'poll-123',
      is_active: true,
      expires_at: null,
      allow_multiple_votes: false
    }

    /**
     * Helper function to create FormData for voting
     */
    const createVoteFormData = (pollId: string, optionId: string) => {
      const formData = new FormData()
      formData.append('pollId', pollId)
      formData.append('optionId', optionId)
      return formData
    }

    it('should submit vote successfully', async () => {
      // Arrange
      mockGetCurrentUser.mockResolvedValue(mockUser)
      mockSingle.mockResolvedValueOnce({ data: mockPoll, error: null })
      mockSingle.mockResolvedValueOnce({ data: null, error: null })
      mockInsert.mockResolvedValue({ error: null })

      const formData = createVoteFormData('poll-123', 'option-456')

      // Act
      const result = await submitVoteAction(formData)

      // Assert
      expect(result.success).toBe(true)
      expect(result.message).toBe('Vote submitted successfully')
      expect(mockRevalidatePath).toHaveBeenCalledWith('/polls/poll-123')
    })

    it('should return error when user is not authenticated', async () => {
      // Arrange
      mockGetCurrentUser.mockResolvedValue(null)
      const formData = createVoteFormData('poll-123', 'option-456')

      // Act
      const result = await submitVoteAction(formData)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Authentication required to vote')
    })

    it('should return error when pollId or optionId is missing', async () => {
      // Arrange
      mockGetCurrentUser.mockResolvedValue(mockUser)
      const formData = new FormData()
      formData.append('pollId', 'poll-123')
      // Missing optionId

      // Act
      const result = await submitVoteAction(formData)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Poll ID and option ID are required')
    })

    it('should return error when poll is not found', async () => {
      // Arrange
      mockGetCurrentUser.mockResolvedValue(mockUser)
      mockSingle.mockResolvedValue({ data: null, error: { message: 'Not found' } })

      const formData = createVoteFormData('poll-123', 'option-456')

      // Act
      const result = await submitVoteAction(formData)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Poll not found')
    })

    it('should return error when poll is not active', async () => {
      // Arrange
      mockGetCurrentUser.mockResolvedValue(mockUser)
      const inactivePoll = { ...mockPoll, is_active: false }
      mockSingle.mockResolvedValue({ data: inactivePoll, error: null })

      const formData = createVoteFormData('poll-123', 'option-456')

      // Act
      const result = await submitVoteAction(formData)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('This poll is no longer active')
    })

    it('should return error when poll has expired', async () => {
      // Arrange
      mockGetCurrentUser.mockResolvedValue(mockUser)
      const expiredPoll = { ...mockPoll, expires_at: '2020-01-01T00:00:00.000Z' }
      mockSingle.mockResolvedValue({ data: expiredPoll, error: null })

      const formData = createVoteFormData('poll-123', 'option-456')

      // Act
      const result = await submitVoteAction(formData)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('This poll has expired')
    })

    it('should return error when user has already voted and multiple votes not allowed', async () => {
      // Arrange
      mockGetCurrentUser.mockResolvedValue(mockUser)
      mockSingle.mockResolvedValueOnce({ data: mockPoll, error: null })
      mockSingle.mockResolvedValueOnce({ data: { id: 'vote-123' }, error: null })

      const formData = createVoteFormData('poll-123', 'option-456')

      // Act
      const result = await submitVoteAction(formData)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('You have already voted on this poll')
    })

    it('should allow multiple votes when poll allows it', async () => {
      // Arrange
      mockGetCurrentUser.mockResolvedValue(mockUser)
      const multiVotePoll = { ...mockPoll, allow_multiple_votes: true }
      mockSingle.mockResolvedValueOnce({ data: multiVotePoll, error: null })
      mockInsert.mockResolvedValue({ error: null })

      const formData = createVoteFormData('poll-123', 'option-456')

      // Act
      const result = await submitVoteAction(formData)

      // Assert
      expect(result.success).toBe(true)
      expect(result.message).toBe('Vote submitted successfully')
    })

    it('should handle vote submission database error', async () => {
      // Arrange
      mockGetCurrentUser.mockResolvedValue(mockUser)
      mockSingle.mockResolvedValueOnce({ data: mockPoll, error: null })
      mockSingle.mockResolvedValueOnce({ data: null, error: null })
      const voteError = { message: 'Vote insertion failed' }
      mockInsert.mockResolvedValue({ error: voteError })

      const formData = createVoteFormData('poll-123', 'option-456')

      // Act
      const result = await submitVoteAction(formData)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to submit vote: Vote insertion failed')
    })
  })
})