import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { usersCurrentUser } from '@/clientService'
import { getAuthHeaders } from '@/lib/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const headers = getAuthHeaders()
      if (!('Authorization' in headers)) {
        setIsAuthenticated(false)
        return
      }

      const { error } = await usersCurrentUser({ headers })
      setIsAuthenticated(!error)
    }

    checkAuth()
  }, [])

  if (isAuthenticated === null) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

