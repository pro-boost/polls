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
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg line-clamp-2">{poll.title}</CardTitle>
            {poll.description && (
              <CardDescription className="mt-2 line-clamp-2">
                {poll.description}
              </CardDescription>
            )}
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusColor}`}>
            {status}
          </span>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Poll Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{poll.totalVotes} votes</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatDate(poll.createdAt)}</span>
            </div>
          </div>
          {poll.endDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Ends {formatDate(poll.endDate)}</span>
            </div>
          )}
        </div>

        {/* Poll Options Preview */}
        <div className="space-y-2 mb-4">
          {poll.options.slice(0, 3).map((option) => (
            <div key={option.id} className="flex justify-between items-center text-sm">
              <span className="text-gray-700 truncate">{option.text}</span>
              <span className="text-gray-500 ml-2">{option.votes}</span>
            </div>
          ))}
          {poll.options.length > 3 && (
            <p className="text-xs text-gray-500">
              +{poll.options.length - 3} more options
            </p>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2">
            <Link href={`/polls/${poll.id}`} className="flex-1">
              <Button variant="outline" className="w-full">
                {poll.isActive && !isExpired ? 'Vote Now' : 'View Results'}
              </Button>
            </Link>
          </div>
        )}

        {/* Creator Info */}
        <div className="mt-4 pt-3 border-t text-xs text-gray-500">
          Created by {poll.creator}
        </div>
      </CardContent>
    </Card>
  )
}