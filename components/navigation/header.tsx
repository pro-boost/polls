"use client";

import Link from "next/link";
import { useCallback, useMemo, memo } from "react";
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings, Plus } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

/*
 * Header component renders the application top navigation bar.
 * - Keeps UI identical while improving readability and performance.
 * - Uses useCallback to avoid re-creating handlers on each render.
 * - Uses useMemo to derive and memoize the displayed user name.
 * - Splits UI into small memoized subcomponents to minimize re-renders.
 */
export function Header() {
  const { user, signOut } = useAuth();

  // Memoize sign-out handler to prevent re-creation across renders
  const handleSignOut = useCallback((): void => {
    // Intentionally discard the returned promise to satisfy onClick typing
    void signOut();
  }, [signOut]);

  // Memoize derived user name for display
  const userName = useMemo(() => {
    if (!user) return "";
    const fullName = user.user_metadata?.full_name as string | undefined;
    const email = user.email as string | undefined;
    return fullName ?? email ?? "";
  }, [user]);

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
              <AuthActions userName={userName} onSignOut={handleSignOut} />
            ) : (
              <GuestActions />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

/*
 * AuthActions renders actions when a user is authenticated.
 * Extracted for clarity and memoized to reduce unnecessary re-renders.
 */
const AuthActions = memo(function AuthActions({
  userName,
  onSignOut,
}: {
  userName: string;
  onSignOut: () => void;
}) {
  return (
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
      <UserMenu userName={userName} onSignOut={onSignOut} />
    </>
  );
});

/*
 * GuestActions renders actions for unauthenticated users.
 * Extracted and memoized to avoid re-renders when auth state elsewhere changes.
 */
const GuestActions = memo(function GuestActions() {
  return (
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
  );
});

/*
 * UserMenu renders the user button and dropdown.
 * UI and class names are preserved; only structure and memoization are improved.
 */
const UserMenu = memo(function UserMenu({
  userName,
  onSignOut,
}: {
  userName: string;
  onSignOut: () => void;
}) {
  return (
    <div className="header-user-menu">
      <Button variant="ghost" size="sm" className="header-user-button">
        <User className="h-4 w-4" />
        <span className="header-user-name">{userName}</span>
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
          <button className="header-dropdown-item" onClick={onSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
});