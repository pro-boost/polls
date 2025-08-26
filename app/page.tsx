import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { BarChart3, Users, Zap, Shield, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title">
            Create & Share
            <span className="hero-title-accent">Polls Instantly</span>
          </h1>
          <p className="hero-subtitle">
            Gather opinions, make decisions, and engage your community with beautiful, 
            easy-to-create polls that work on any device.
          </p>
          <div className="hero-actions">
            <Link href="/polls/create">
              <Button size="lg" className="hero-btn-primary">
                Create Your First Poll
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/polls">
              <Button variant="outline" size="lg" className="hero-btn-secondary">
                Browse Polls
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="features-header">
            <h2 className="features-title">
              Why Choose Our Polling Platform?
            </h2>
            <p className="features-subtitle">
              Built for simplicity, designed for engagement, and optimized for results.
            </p>
          </div>

          <div className="features-grid">
            <Card className="feature-card">
              <CardHeader>
                <div className="feature-icon feature-icon-blue">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Create polls in seconds with our intuitive interface. No complex setup required.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader>
                <div className="feature-icon feature-icon-green">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Community Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Engage your audience and build community through interactive polling experiences.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader>
                <div className="feature-icon feature-icon-purple">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Real-time Results</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Watch results update live as votes come in. Beautiful charts and analytics included.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader>
                <div className="feature-icon feature-icon-orange">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Secure & Private</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your data is protected with enterprise-grade security. Anonymous voting options available.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">
            Ready to Get Started?
          </h2>
          <p className="cta-subtitle">
            Join thousands of users who are already creating engaging polls and gathering valuable insights.
          </p>
          <div className="cta-actions">
            <Link href="/auth/register">
              <Button size="lg" className="cta-btn-primary">
                Sign Up Free
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="cta-btn-secondary">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
