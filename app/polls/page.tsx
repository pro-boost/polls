import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Users, Clock } from "lucide-react"

// Mock data for demonstration
const mockPolls = [
  {
    id: "1",
    title: "Favorite Programming Language",
    description: "What's your preferred programming language for web development?",
    totalVotes: 156,
    createdAt: "2024-01-15",
    isActive: true
  },
  {
    id: "2",
    title: "Best Time for Team Meetings",
    description: "When should we schedule our weekly team meetings?",
    totalVotes: 23,
    createdAt: "2024-01-14",
    isActive: true
  },
  {
    id: "3",
    title: "Office Lunch Options",
    description: "Which restaurant should we order from for the team lunch?",
    totalVotes: 45,
    createdAt: "2024-01-13",
    isActive: false
  }
]

export default function PollsPage() {
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
        {mockPolls.map((poll) => (
          <Card key={poll.id} className="poll-card">
            <CardHeader>
              <div className="poll-card-header">
                <CardTitle className="poll-card-title">{poll.title}</CardTitle>
                <span className={`poll-status ${
                  poll.isActive 
                    ? 'poll-status-active' 
                    : 'poll-status-closed'
                }`}>
                  {poll.isActive ? 'Active' : 'Closed'}
                </span>
              </div>
              <CardDescription>{poll.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="poll-meta">
                <div className="poll-meta-item">
                  <Users className="h-4 w-4" />
                  {poll.totalVotes} votes
                </div>
                <div className="poll-meta-item">
                  <Clock className="h-4 w-4" />
                  {poll.createdAt}
                </div>
              </div>
              <Link href={`/polls/${poll.id}`}>
                <Button variant="outline" className="poll-action-btn">
                  {poll.isActive ? 'Vote Now' : 'View Results'}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockPolls.length === 0 && (
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
