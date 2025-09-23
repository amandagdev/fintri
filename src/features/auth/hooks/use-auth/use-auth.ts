'use client'

import { useEffect, useState } from 'react'

interface User {
  id: number
  username: string
  email: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  isLoading: boolean
}

export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  })

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userCookie = document.cookie.split('; ').find((row) => row.startsWith('user='))

        if (userCookie) {
          const userData = userCookie.split('=')[1]
          const user = JSON.parse(decodeURIComponent(userData))
          setAuthState({
            isAuthenticated: true,
            user,
            isLoading: false,
          })
        } else {
          setAuthState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
          })
        }
      } catch (error) {
        console.error('Error checking auth:', error)
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        })
      }
    }

    checkAuth()
  }, [])

  return authState
}
