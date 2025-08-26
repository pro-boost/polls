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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Polls</h1>
          <p className="text-gray-600 mt-2">Discover and participate in community polls</p>
        </div>
        <Link href="/polls/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Poll
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockPolls.map((poll) => (
          <Card key={poll.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{poll.title}</CardTitle>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  poll.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {poll.isActive ? 'Active' : 'Closed'}
                </span>
              </div>
              <CardDescription>{poll.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {poll.totalVotes} votes
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {poll.createdAt}
                </div>
              </div>
              <Link href={`/polls/${poll.id}`}>
                <Button variant="outline" className="w-full">
                  {poll.isActive ? 'Vote Now' : 'View Results'}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockPolls.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No polls yet</h3>
          <p className="text-gray-500 mb-4">Be the first to create a poll!</p>
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