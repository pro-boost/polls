import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft, Plus, X } from "lucide-react"

export default function CreatePollPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/polls" className="flex items-center gap-2 text-blue-600 hover:underline mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Polls
        </Link>
        <h1 className="text-3xl font-bold">Create New Poll</h1>
        <p className="text-gray-600 mt-2">Create a poll to gather opinions from the community</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Poll Details</CardTitle>
          <CardDescription>
            Fill in the information below to create your poll
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Poll Title *</Label>
            <Input
              id="title"
              placeholder="Enter a clear and concise title for your poll"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Provide additional context or details about your poll (optional)"
            />
          </div>

          <div className="space-y-4">
            <Label>Poll Options *</Label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input placeholder="Option 1" required />
                <Button variant="outline" size="icon" disabled>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Option 2" required />
                <Button variant="outline" size="icon" disabled>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Option 3" />
                <Button variant="outline" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Another Option
            </Button>
          </div>

          <div className="space-y-4">
            <Label>Poll Settings</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="allowMultiple"
                  className="rounded border-gray-300"
                />
                <Label htmlFor="allowMultiple" className="text-sm font-normal">
                  Allow multiple selections
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showResults"
                  className="rounded border-gray-300"
                  defaultChecked
                />
                <Label htmlFor="showResults" className="text-sm font-normal">
                  Show results after voting
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="requireAuth"
                  className="rounded border-gray-300"
                  defaultChecked
                />
                <Label htmlFor="requireAuth" className="text-sm font-normal">
                  Require authentication to vote
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date (Optional)</Label>
            <Input
              id="endDate"
              type="datetime-local"
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Leave empty for polls that never expire
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button className="flex-1">
              Create Poll
            </Button>
            <Button variant="outline" asChild>
              <Link href="/polls">Cancel</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}