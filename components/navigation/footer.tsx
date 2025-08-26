import Link from "next/link"
import { Github, Twitter, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-brand-header">
              <div className="footer-logo">
                <span className="footer-logo-text">P</span>
              </div>
              <span className="footer-brand-name">Polls</span>
            </div>
            <p className="footer-description">
              Create and participate in polls to gather opinions and make decisions together.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="footer-section-title">Product</h3>
            <ul className="footer-links">
              <li>
                <Link href="/polls" className="footer-link">
                  Browse Polls
                </Link>
              </li>
              <li>
                <Link href="/polls/create" className="footer-link">
                  Create Poll
                </Link>
              </li>
              <li>
                <Link href="/features" className="footer-link">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="footer-link">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="footer-section-title">Support</h3>
            <ul className="footer-links">
              <li>
                <Link href="/help" className="footer-link">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="footer-link">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/docs" className="footer-link">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/status" className="footer-link">
                  Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="footer-section-title">Legal</h3>
            <ul className="footer-links">
              <li>
                <Link href="/privacy" className="footer-link">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="footer-link">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="footer-link">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="footer-divider" />

        {/* Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2024 Polls. All rights reserved.
          </p>
           
          <div className="footer-social">
            <a 
              href="https://github.com" 
              className="footer-social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href="https://twitter.com" 
              className="footer-social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a 
              href="mailto:contact@polls.com" 
              className="footer-social-link"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}