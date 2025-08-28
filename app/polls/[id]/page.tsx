import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Users, Clock, Share2 } from "lucide-react"
import { notFound } from "next/navigation"

// Mock data for demonstration
const mockPoll = {
  id: "1",
  title: "Favorite Programming Language",
  description: "What's your preferred programming language for web development? This poll will help us understand the community preferences.",
  options: [
    { id: "1", text: "JavaScript", votes: 45, percentage: 35.7 },
    { id: "2", text: "Python", votes: 38, percentage: 30.2 },
    { id: "3", text: "TypeScript", votes: 25, percentage: 19.8 },
    { id: "4", text: "Go", votes: 12, percentage: 9.5 },
    { id: "5", text: "Rust", votes: 6, percentage: 4.8 }
  ],
  totalVotes: 126,
  createdAt: "2024-01-15",
  endDate: "2024-02-15",
  isActive: true,
  allowMultiple: false,
  showResults: true,
  hasVoted: false,
  creator: "John Doe"
}

interface PollPageProps {
  params: {
    id: string
  }
}

export default function PollPage({ params }: PollPageProps) {
  // In a real app, you would fetch the poll data based on params.id
  const _pollId = params.id
  const poll = mockPoll // Using mock data for now, but _pollId would be used for fetching
  
  if (!poll) {
    notFound()
  }

  return (
    <div className="poll-detail-page">
      <div className="poll-detail-header">
        <Link href="/polls" className="poll-detail-back-link">
          <ArrowLeft className="h-4 w-4" />
          Back to Polls
        </Link>
      </div>

      <div className="poll-detail-grid">
        {/* Main Poll Content */}
        <div className="poll-detail-main">
          <Card>
            <CardHeader>
              <div className="poll-detail-card-header">
                <div className="poll-detail-info">
                  <CardTitle className="poll-detail-title">{poll.title}</CardTitle>
                  <CardDescription className="poll-detail-description">
                    {poll.description}
                  </CardDescription>
                </div>
                <div className="poll-detail-status">
                  <span className={`poll-status ${
                    poll.isActive 
                      ? 'poll-status-active' 
                      : 'poll-status-closed'
                  }`}>
                    {poll.isActive ? 'Active' : 'Closed'}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="poll-options">
                {poll.options.map((option) => (
                  <div key={option.id} className="poll-option">
                    <div className="poll-option-header">
                      <label className="poll-option-label">
                        <input
                          type={poll.allowMultiple ? "checkbox" : "radio"}
                          name="poll-option"
                          value={option.id}
                          className="poll-option-input"
                          disabled={!poll.isActive || poll.hasVoted}
                        />
                        <span className="poll-option-text">{option.text}</span>
                      </label>
                      {poll.showResults && (
                        <span className="poll-option-votes">
                          {option.votes} votes ({option.percentage}%)
                        </span>
                      )}
                    </div>
                    {poll.showResults && (
                      <div className="poll-progress-bar">
                        <div
                          className="poll-progress-fill"
                          style={{ width: `${option.percentage}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {poll.isActive && !poll.hasVoted && (
                <div className="poll-submit-section">
                  <Button className="poll-submit-btn">
                    Submit Vote
                  </Button>
                </div>
              )}

              {poll.hasVoted && (
                <div className="poll-voted-section">
                  <div className="poll-voted-message">
                    <p className="poll-voted-text">
                      ✓ Thank you for voting! Your response has been recorded.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="poll-detail-sidebar">
          {/* Poll Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="poll-stats-title">Poll Statistics</CardTitle>
            </CardHeader>
            <CardContent className="poll-stats-content">
              <div className="poll-stat-item">
                <Users className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="poll-stat-value">{poll.totalVotes}</p>
                  <p className="poll-stat-label">Total Votes</p>
                </div>
              </div>
              <div className="poll-stat-item">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="poll-stat-value">{poll.createdAt}</p>
                  <p className="poll-stat-label">Created</p>
                </div>
              </div>
              {poll.endDate && (
                <div className="poll-stat-item">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="poll-stat-value">{poll.endDate}</p>
                    <p className="poll-stat-label">Ends</p>
                  </div>
                </div>
              )}
              <div className="poll-creator">
                <p className="poll-creator-label">Created by</p>
                <p className="poll-creator-name">{poll.creator}</p>
              </div>
            </CardContent>
          </Card>

          {/* Share Poll */}
          <Card>
            <CardHeader>
              <CardTitle className="poll-share-title">Share Poll</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="poll-share-btn">
                <Share2 className="h-4 w-4 mr-2" />
                Share Poll
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
