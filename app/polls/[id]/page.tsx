"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Users, Clock, Share2 } from "lucide-react";
import { notFound } from "next/navigation";
import { getPollWithOptions } from "@/lib/api";
import { VotingForm } from "@/components/polls/voting-form";

interface PollPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface PollData {
  poll: {
    id: string;
    title: string;
    description?: string;
    is_active: boolean;
    created_at: string;
    expires_at?: string;
    allow_multiple_votes: boolean;
  };
  options: Array<{
    id: string;
    option_text: string;
    option_order: number;
  }>;
  total_votes: number;
}

export default function PollPage({ params }: PollPageProps) {
  const [poll, setPoll] = useState<PollData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);

  /**
   * Fetch poll data on component mount
   */
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const resolvedParams = await params;
        const pollResult = await getPollWithOptions(resolvedParams.id);

        if (!pollResult.success || !pollResult.data) {
          notFound();
          return;
        }

        setPoll(pollResult.data);
      } catch (error) {
        console.error("Error fetching poll:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [params]);

  /**
   * Handle successful vote submission
   */
  const handleVoteSubmitted = () => {
    setHasVoted(true);
  };

  if (loading) {
    return (
      <div className="poll-detail-page">
        <div className="poll-detail-header">
          <Link href="/polls" className="poll-detail-back-link">
            <ArrowLeft className="h-4 w-4" />
            Back to Polls
          </Link>
        </div>
        <div className="loading-message">
          <p>Loading poll...</p>
        </div>
      </div>
    );
  }

  if (!poll) {
    notFound();
    return null;
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
        <div className="poll-detail-main space-y-6">
          <Card className="p-2">
            <CardHeader className="space-y-4">
              <div className="poll-detail-card-header space-y-3">
                <div className="poll-detail-info space-y-2">
                  <CardTitle className="poll-detail-title text-2xl">
                    {poll.poll.title}
                  </CardTitle>
                  <CardDescription className="poll-detail-description text-base">
                    {poll.poll.description || "No description provided"}
                  </CardDescription>
                </div>
                <div className="poll-detail-status pt-2">
                  <span
                    className={`poll-status px-3 py-1 rounded-full ${
                      poll.poll.is_active
                        ? "poll-status-active bg-green-100 text-green-800"
                        : "poll-status-closed bg-red-100 text-red-800"
                    }`}
                  >
                    {poll.poll.is_active ? "Active" : "Closed"}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              {!hasVoted ? (
                <VotingForm
                  pollId={poll.poll.id}
                  options={poll.options}
                  allowMultiple={poll.poll.allow_multiple_votes || false}
                  isActive={poll.poll.is_active}
                  onVoteSubmitted={handleVoteSubmitted}
                />
              ) : (
                <div className="poll-voted-section py-8">
                  <div className="poll-voted-message space-y-6">
                    <p className="poll-voted-text text-lg font-medium text-green-700">
                      ✓ Thank you for voting! Your response has been recorded.
                    </p>
                    <div className="poll-results-preview mt-8">
                      <p className="text-sm text-gray-600">
                        Results will be available after the poll closes.
                      </p>
                    </div>
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
              <CardTitle className="poll-stats-title">
                Poll Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="poll-stats-content">
              <div className="poll-stat-item">
                <Users className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="poll-stat-value">{poll.total_votes || 0}</p>
                  <p className="poll-stat-label">Total Votes</p>
                </div>
              </div>
              <div className="poll-stat-item">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="poll-stat-value">
                    {poll.poll.created_at
                      ? new Date(poll.poll.created_at).toLocaleDateString()
                      : "Unknown"}
                  </p>
                  <p className="poll-stat-label">Created</p>
                </div>
              </div>
              {poll.poll.expires_at && (
                <div className="poll-stat-item">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="poll-stat-value">
                      {new Date(poll.poll.expires_at).toLocaleDateString()}
                    </p>
                    <p className="poll-stat-label">Ends</p>
                  </div>
                </div>
              )}
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
  );
}
