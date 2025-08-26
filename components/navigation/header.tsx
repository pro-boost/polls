"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User, LogOut, Settings, Plus } from "lucide-react"

// Mock authentication state - in a real app, this would come from context/state management
const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  isAuthenticated: true // Change to true to see authenticated state
}

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-xl">Polls</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/polls" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Browse Polls
            </Link>
            <Link 
              href="/polls/create" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Create Poll
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {mockUser.isAuthenticated ? (
              <>
                {/* Mobile Create Button */}
                <Link href="/polls/create" className="md:hidden">
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </Link>
                
                {/* Desktop Create Button */}
                <Link href="/polls/create" className="hidden md:block">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Poll
                  </Button>
                </Link>

                {/* User Menu */}
                <div className="relative group">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden md:block">{mockUser.name}</span>
                  </Button>
                  
                  {/* Dropdown Menu - In a real app, you'd use a proper dropdown component */}
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <Link 
                        href="/profile" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      <Link 
                        href="/settings" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                      <hr className="my-1" />
                      <button 
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          // TODO: Implement logout
                          console.log('Logout clicked')
                        }}
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
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}