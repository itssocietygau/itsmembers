'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const navItems = [
  { name: 'Register', path: '/dashboard' },
  { name: 'Search', path: '/dashboard/search' },
]

export default function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Logged out successfully')
      router.push('/login')
    }
  }

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                ITS Member Registration
              </span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === item.path
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}