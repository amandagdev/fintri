'use client'

import { useState } from 'react'

import Link from 'next/link'

import { ChevronDown, LogOut, User } from 'lucide-react'

import { useAuth } from '@/features/auth/hooks/use-auth'
import { logoutClient } from '@/features/auth/utils/logout-client'

export default function UserMenu() {
  const { user, isAuthenticated } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!isAuthenticated || !user) {
    return null
  }

  const handleLogout = () => {
    logoutClient()
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        <User size={18} />
        <span className="hidden sm:block text-sm font-medium">{user.username}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <User size={16} />
            Minha Conta
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors w-full text-left"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      )}

      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsOpen(false)
            }
          }}
          aria-label="Fechar menu"
        />
      )}
    </div>
  )
}
