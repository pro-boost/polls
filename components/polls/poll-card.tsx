import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Clock, Calendar } from "lucide-react"
import { Poll } from "@/lib/polls"

interface PollCardProps {
  poll: Poll
  showActions?: boolean
}

export function PollCard({ poll, showActions = true }: PollCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isExpired = poll.endDate && new Date(poll.endDate) < new Date()
  const status = isExpired ? 'Expired' : poll.isActive ? 'Active' : 'Closed'
  const statusColor = isExpired 
    ? 'bg-red-100 text-red-800' 
    : poll.isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800'

  return (
    <Card className="poll-card">
      <CardHeader>
        <div className="poll-card-header">
          <div className="poll-card-content">
            <CardTitle className="poll-card-title">{poll.title}</CardTitle>
            {poll.description && (
              <CardDescription className="poll-card-description">
                {poll.description}
              </CardDescription>
            )}
          </div>
          <span className={`poll-card-status ${statusColor}`}>
            {status}
          </span>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Poll Stats */}
        <div className="poll-card-stats">
          <div className="poll-card-stats-left">
            <div className="poll-card-stat">
              <Users className="h-4 w-4" />
              <span>{poll.totalVotes} votes</span>
            </div>
            <div className="poll-card-stat">
              <Clock className="h-4 w-4" />
              <span>{formatDate(poll.createdAt)}</span>
            </div>
          </div>
          {poll.endDate && (
            <div className="poll-card-stat">
              <Calendar className="h-4 w-4" />
              <span>Ends {formatDate(poll.endDate)}</span>
            </div>
          )}
        </div>

        {/* Poll Options Preview */}
        <div className="poll-card-options">
          {poll.options.slice(0, 3).map((option) => (
            <div key={option.id} className="poll-card-option">
              <span className="poll-card-option-text">{option.text}</span>
              <span className="poll-card-option-votes">{option.votes}</span>
            </div>
          ))}
          {poll.options.length > 3 && (
            <p className="poll-card-more-options">
              +{poll.options.length - 3} more options
            </p>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="poll-card-actions">
            <Link href={`/polls/${poll.id}`} className="poll-card-action-link">
              <Button variant="outline" className="poll-card-action-btn">
                {poll.isActive && !isExpired ? 'Vote Now' : 'View Results'}
              </Button>
            </Link>
          </div>
        )}

        {/* Creator Info */}
        <div className="poll-card-creator">
          Created by {poll.creator}
        </div>
      </CardContent>
    </Card>
  )
}