'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { submitVote } from '@/lib/actions/vote'

interface VotingFormProps {
  pollId: string
  options: Array<{
    id: string
    option_text: string
    option_order: number
  }>
  allowMultiple: boolean
  isActive: boolean
  onVoteSubmitted: () => void
}

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
   */
  const handleOptionChange = (optionId: string) => {
    if (allowMultiple) {
      setSelectedOptions(prev => 
        prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      )
    } else {
      setSelectedOptions([optionId])
    }
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedOptions.length === 0) {
      setError('Please select at least one option')
      return
    }
    
    setIsSubmitting(true)
    setError('')
    
    try {
      const result = await submitVote(pollId, selectedOptions)
      
      if (result.success) {
        onVoteSubmitted()
      } else {
        setError(result.error || 'Failed to submit vote')
      }
    } catch (error) {
      console.error('Error submitting vote:', error)
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isActive) {
    return (
      <div className="poll-inactive-message">
        <p>This poll is no longer active.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="voting-form">
      <div className="poll-options">
        {options.map((option) => (
          <div key={option.id} className="poll-option">
            <div className="poll-option-header">
              <label className="poll-option-label">
                <input
                  type={allowMultiple ? "checkbox" : "radio"}
                  name="poll-option"
                  value={option.id}
                  className="poll-option-input"
                  checked={selectedOptions.includes(option.id)}
                  onChange={() => handleOptionChange(option.id)}
                  disabled={isSubmitting}
                />
                <span className="poll-option-text">{option.option_text}</span>
              </label>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="voting-error">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="poll-submit-section">
        <Button 
          type="submit" 
          className="poll-submit-btn"
          disabled={isSubmitting || selectedOptions.length === 0}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Vote'}
        </Button>
      </div>
    </form>
  )
}