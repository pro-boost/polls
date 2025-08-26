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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/polls" className="flex items-center gap-2 text-blue-600 hover:underline mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Polls
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Poll Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{poll.title}</CardTitle>
                  <CardDescription className="text-base">
                    {poll.description}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    poll.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {poll.isActive ? 'Active' : 'Closed'}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {poll.options.map((option) => (
                  <div key={option.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="flex items-center space-x-3 cursor-pointer flex-1">
                        <input
                          type={poll.allowMultiple ? "checkbox" : "radio"}
                          name="poll-option"
                          value={option.id}
                          className="w-4 h-4"
                          disabled={!poll.isActive || poll.hasVoted}
                        />
                        <span className="text-sm font-medium">{option.text}</span>
                      </label>
                      {poll.showResults && (
                        <span className="text-sm text-gray-500">
                          {option.votes} votes ({option.percentage}%)
                        </span>
                      )}
                    </div>
                    {poll.showResults && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${option.percentage}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {poll.isActive && !poll.hasVoted && (
                <div className="mt-6 pt-4 border-t">
                  <Button className="w-full">
                    Submit Vote
                  </Button>
                </div>
              )}

              {poll.hasVoted && (
                <div className="mt-6 pt-4 border-t">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 text-sm font-medium">
                      ✓ Thank you for voting! Your response has been recorded.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Poll Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Poll Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">{poll.totalVotes}</p>
                  <p className="text-sm text-gray-500">Total Votes</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">{poll.createdAt}</p>
                  <p className="text-sm text-gray-500">Created</p>
                </div>
              </div>
              {poll.endDate && (
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">{poll.endDate}</p>
                    <p className="text-sm text-gray-500">Ends</p>
                  </div>
                </div>
              )}
              <div className="pt-2">
                <p className="text-sm text-gray-500">Created by</p>
                <p className="font-medium">{poll.creator}</p>
              </div>
            </CardContent>
          </Card>

          {/* Share Poll */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Share Poll</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
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