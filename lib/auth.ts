// Authentication utilities and types

export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  confirmPassword: string
}

// Placeholder authentication functions
export async function login(_credentials: LoginCredentials): Promise<User> {
  // TODO: Implement actual authentication logic
  throw new Error('Authentication not implemented yet')
}

export async function register(_credentials: RegisterCredentials): Promise<User> {
  // TODO: Implement actual registration logic
  throw new Error('Registration not implemented yet')
}

export async function logout(): Promise<void> {
  // TODO: Implement logout logic
  throw new Error('Logout not implemented yet')
}

export async function getCurrentUser(): Promise<User | null> {
  // TODO: Implement get current user logic
  return null
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}