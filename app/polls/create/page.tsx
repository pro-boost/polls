"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft, Plus, X } from "lucide-react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { createPollAction } from "@/lib/actions/poll-actions"

function CreatePollPageContent() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [options, setOptions] = useState(["Option 1", "Option 2", ""])
  const [allowMultiple, setAllowMultiple] = useState(false)
  const [showResults, setShowResults] = useState(true)
  const [requireAuth, setRequireAuth] = useState(true)
  const [endDate, setEndDate] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const addOption = () => {
    setOptions([...options, ""])
  }

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!title.trim()) {
      setError("Please enter a poll title")
      return
    }

    const validOptions = options.filter(option => option.trim() !== "")
    if (validOptions.length < 2) {
      setError("Please provide at least 2 options")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Create FormData for Server Action
      const formData = new FormData()
      formData.append('title', title.trim())
      formData.append('description', description.trim())
      formData.append('allowMultiple', allowMultiple.toString())
      formData.append('requireAuth', requireAuth.toString())
      formData.append('endDate', endDate || '')
      
      // Add options to FormData
      validOptions.forEach((option, index) => {
        formData.append(`option-${index}`, option.trim())
      })

      // Call Server Action
      const result = await createPollAction(formData)
      
      if (result && !result.success) {
        setError(result.error || 'Failed to create poll')
      } else if (result && result.success) {
        // Show success message
        setSuccessMessage(result.message || 'Poll created successfully!')
        setError(null)
        
        // Redirect to polls page after a short delay to show the success message
        setTimeout(() => {
          router.push('/polls')
        }, 2000)
      }
      
    } catch (error) {
      console.error("Error creating poll:", error)
      setError("Failed to create poll. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className="create-poll-page">
      <div className="create-poll-header">
        <Link href="/polls" className="create-poll-back-link">
          <ArrowLeft className="h-4 w-4" />
          Back to Polls
        </Link>
        <h1 className="create-poll-title">Create New Poll</h1>
        <p className="create-poll-subtitle">Create a poll to gather opinions from the community</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Poll Details</CardTitle>
          <CardDescription>
            Fill in the information below to create your poll
          </CardDescription>
        </CardHeader>
        <CardContent className="create-poll-content">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-600 text-sm">{successMessage}</p>
            </div>
          )}
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="form-field">
              <Label htmlFor="title">Poll Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a clear and concise title for your poll"
                required
              />
            </div>

            <div className="form-field">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="textarea"
                placeholder="Provide additional context or details about your poll (optional)"
              />
            </div>

            <div className="poll-options-section">
              <Label>Poll Options *</Label>
              <div className="poll-options-list">
                {options.map((option, index) => (
                  <div key={index} className="poll-option-row">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      required={index < 2}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeOption(index)}
                      disabled={options.length <= 2}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                className="add-option-btn"
                onClick={addOption}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Option
              </Button>
            </div>

            <div className="poll-settings-section">
              <Label>Poll Settings</Label>
              <div className="poll-settings-list">
                <div className="poll-setting-item">
                  <input
                    type="checkbox"
                    id="allowMultiple"
                    className="checkbox"
                    checked={allowMultiple}
                    onChange={(e) => setAllowMultiple(e.target.checked)}
                  />
                  <Label htmlFor="allowMultiple" className="checkbox-label">
                    Allow multiple selections
                  </Label>
                </div>
                <div className="poll-setting-item">
                  <input
                    type="checkbox"
                    id="showResults"
                    className="checkbox"
                    checked={showResults}
                    onChange={(e) => setShowResults(e.target.checked)}
                  />
                  <Label htmlFor="showResults" className="checkbox-label">
                    Show results after voting
                  </Label>
                </div>
                <div className="poll-setting-item">
                  <input
                    type="checkbox"
                    id="requireAuth"
                    className="checkbox"
                    checked={requireAuth}
                    onChange={(e) => setRequireAuth(e.target.checked)}
                  />
                  <Label htmlFor="requireAuth" className="checkbox-label">
                    Require authentication to vote
                  </Label>
                </div>
              </div>
            </div>

            <div className="form-field">
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="date-input"
              />
              <p className="field-hint">
                Leave empty for polls that never expire
              </p>
            </div>

            <div className="form-actions">
              <Button 
                type="submit" 
                className="create-btn"
                disabled={isSubmitting || !!successMessage}
              >
                {isSubmitting ? "Creating..." : successMessage ? "Redirecting..." : "Create Poll"}
              </Button>
              <Button variant="outline" asChild>
                <Link href="/polls">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function CreatePollPage() {
  return (
    <ProtectedRoute>
      <CreatePollPageContent />
    </ProtectedRoute>
  )
}