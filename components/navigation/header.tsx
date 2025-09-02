"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings, Plus } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export function Header() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          {/* Logo */}
          <Link href="/" className="header-logo">
            <div className="header-logo-icon">
              <span className="header-logo-text">P</span>
            </div>
            <span className="header-brand">Polls</span>
          </Link>

          {/* Navigation */}

          {/* User Actions */}
          <div className="header-actions">
            {user ? (
              <>
                {/* Mobile Create Button */}
                <Link href="/polls/create" className="header-mobile-create">
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </Link>

                {/* Desktop Create Button */}
                <Link href="/polls/create" className="header-desktop-create">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Poll
                  </Button>
                </Link>

                {/* User Menu */}
                <div className="header-user-menu">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="header-user-button"
                  >
                    <User className="h-4 w-4" />
                    <span className="header-user-name">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                  </Button>

                  {/* Dropdown Menu - In a real app, you'd use a proper dropdown component */}
                  <div className="header-dropdown">
                    <div className="header-dropdown-content">
                      <Link href="/profile" className="header-dropdown-item">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      <Link href="/settings" className="header-dropdown-item">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                      <hr className="header-dropdown-divider" />
                      <button
                        className="header-dropdown-item"
                        onClick={handleSignOut}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}