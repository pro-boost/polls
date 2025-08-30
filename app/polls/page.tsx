import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Users, Clock } from "lucide-react"
import { getPolls } from "@/lib/api"

export default async function PollsPage() {
  const pollsResult = await getPolls()
  const polls = pollsResult.success ? (pollsResult.data || []) : []
  return (
    <div className="polls-page">
      <div className="polls-header">
        <div>
          <h1 className="polls-title">Polls</h1>
          <p className="polls-subtitle">Discover and participate in community polls</p>
        </div>
        <Link href="/polls/create">
          <Button className="polls-create-btn">
            <Plus className="h-4 w-4" />
            Create Poll
          </Button>
        </Link>
      </div>

      <div className="polls-grid">
        {polls.map((poll) => (
          <Card key={poll.id} className="poll-card">
            <CardHeader>
              <div className="poll-card-header">
                <CardTitle className="poll-card-title">{poll.title}</CardTitle>
                <span className={`poll-status ${
                  poll.is_active 
                    ? 'poll-status-active' 
                    : 'poll-status-closed'
                }`}>
                  {poll.is_active ? 'Active' : 'Closed'}
                </span>
              </div>
              <CardDescription>{poll.description || 'No description provided'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="poll-meta">
                <div className="poll-meta-item">
                  <Users className="h-4 w-4" />
                  {poll.vote_count || 0} votes
                </div>
                <div className="poll-meta-item">
                  <Clock className="h-4 w-4" />
                  {poll.created_at ? new Date(poll.created_at).toLocaleDateString() : 'Unknown date'}
                </div>
              </div>
              <Link href={`/polls/${poll.id}`}>
                <Button variant="outline" className="poll-action-btn">
                  {poll.is_active ? 'Vote Now' : 'View Results'}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {polls.length === 0 && (
        <div className="polls-empty">
          <h3 className="polls-empty-title">No polls yet</h3>
          <p className="polls-empty-subtitle">Be the first to create a poll!</p>
          <Link href="/polls/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Poll
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
