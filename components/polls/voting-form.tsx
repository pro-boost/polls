'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { submitVote } from '@/lib/actions/vote'

// Types
interface PollOption {
  id: string
  option_text: string
  option_order: number
}

interface VotingFormProps {
  pollId: string
  options: PollOption[]
  allowMultiple: boolean
  isActive: boolean
  onVoteSubmitted: () => void
}

// Constants
const ERROR_MESSAGES = {
  NO_SELECTION: 'Please select at least one option',
  SUBMISSION_FAILED: 'Failed to submit vote',
  UNEXPECTED_ERROR: 'An unexpected error occurred'
} as const

/**
 * Interactive voting form component for poll participation
 * Handles vote submission and displays success/error states
 */
export function VotingForm({ pollId, options, allowMultiple, isActive, onVoteSubmitted }: VotingFormProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Handle option selection for single or multiple choice polls
   * Memoized to prevent unnecessary re-renders
   */
  const handleOptionChange = useCallback((optionId: string) => {
    if (allowMultiple) {
      setSelectedOptions(prev => 
        prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      )
    } else {
      setSelectedOptions([optionId])
    }
  }, [allowMultiple])

  /**
   * Handle form submission with validation and error handling
   * Memoized to prevent unnecessary re-renders
   */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedOptions.length === 0) {
      setError(ERROR_MESSAGES.NO_SELECTION)
      return
    }
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      const result = await submitVote(pollId, selectedOptions)
      
      if (result.success) {
        onVoteSubmitted()
      } else {
        setError(result.error || ERROR_MESSAGES.SUBMISSION_FAILED)
      }
    } catch (error) {
      console.error('Error submitting vote:', error)
      setError(ERROR_MESSAGES.UNEXPECTED_ERROR)
    } finally {
      setIsSubmitting(false)
    }
  }, [selectedOptions, pollId, onVoteSubmitted])

  // Early return for inactive polls
  if (!isActive) {
    return (
      <div className="poll-inactive-message">
        <p>This poll is no longer active.</p>
      </div>
    )
  }

  // Derived state
  const hasSelection = selectedOptions.length > 0
  const inputType = allowMultiple ? 'checkbox' : 'radio'
  const submitButtonText = isSubmitting ? 'Submitting...' : 'Submit Vote'

  return (
    <form onSubmit={handleSubmit} className="voting-form">
      <OptionsList 
        options={options}
        selectedOptions={selectedOptions}
        inputType={inputType}
        isSubmitting={isSubmitting}
        onOptionChange={handleOptionChange}
      />

      <ErrorMessage error={error} />

      <SubmitSection 
        isSubmitting={isSubmitting}
        hasSelection={hasSelection}
        buttonText={submitButtonText}
      />
    </form>
  )
}

/**
 * Renders the list of poll options with input controls
 */
function OptionsList({ 
  options, 
  selectedOptions, 
  inputType, 
  isSubmitting, 
  onOptionChange 
}: {
  options: PollOption[]
  selectedOptions: string[]
  inputType: 'checkbox' | 'radio'
  isSubmitting: boolean
  onOptionChange: (optionId: string) => void
}) {
  return (
    <div className="poll-options">
      {options.map((option) => (
        <div key={option.id} className="poll-option">
          <div className="poll-option-header">
            <label className="poll-option-label">
              <input
                type={inputType}
                name="poll-option"
                value={option.id}
                className="poll-option-input"
                checked={selectedOptions.includes(option.id)}
                onChange={() => onOptionChange(option.id)}
                disabled={isSubmitting}
              />
              <span className="poll-option-text">{option.option_text}</span>
            </label>
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Renders error message if present
 */
function ErrorMessage({ error }: { error: string | null }) {
  if (!error) return null

  return (
    <div className="voting-error">
      <p className="text-red-600 text-sm">{error}</p>
    </div>
  )
}

/**
 * Renders the submit button section
 */
function SubmitSection({ 
  isSubmitting, 
  hasSelection, 
  buttonText 
}: {
  isSubmitting: boolean
  hasSelection: boolean
  buttonText: string
}) {
  return (
    <div className="poll-submit-section">
      <Button 
        type="submit" 
        className="poll-submit-btn"
        disabled={isSubmitting || !hasSelection}
      >
        {buttonText}
      </Button>
    </div>
  )
}