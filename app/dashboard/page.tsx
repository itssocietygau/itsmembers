import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '@supabase/auth-helpers-react'
import axios from 'axios'
import Layout from '@/components/Layout'
import DashboardCard from '@/components/DashboardCard'
import ProgressBar from '@/components/ProgressBar'

interface FacultyDistribution {
  faculty: string
  count: number
}

interface GenderDistribution {
  male: number
  female: number
}

interface RecentRegistration {
  registrationId: string
  name: string
  faculty: string
  gender: string
  createdAt: string
}

interface DashboardStats {
  totalRegistrations: number
  facultyDistribution: FacultyDistribution[]
  genderDistribution: GenderDistribution
  recentRegistrations: RecentRegistration[]
}

export default function DashboardPage() {
  const router = useRouter()
  const user = useUser()
  const [stats, setStats] = useState<DashboardStats>({
    totalRegistrations: 0,
    facultyDistribution: [],
    genderDistribution: { male: 0, female: 0 },
    recentRegistrations: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/stats')
        setStats(response.data)
      } catch (err) {
        console.error('Error fetching stats:', err)
        setError('Failed to load statistics')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">
              Registration Dashboard
            </span>
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            Real-time statistics and metrics
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Registrations Card */}
            <DashboardCard title="Total Registrations">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.totalRegistrations}
                </div>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Students registered
                </p>
              </div>
            </DashboardCard>

            {/* Male Students Card */}
            <DashboardCard title="Male Students">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.genderDistribution.male}
                </div>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {stats.totalRegistrations > 0 ? 
                    `${Math.round((stats.genderDistribution.male / stats.totalRegistrations) * 100)}% of total` : 
                    'No data'}
                </p>
                <ProgressBar 
                  value={stats.genderDistribution.male} 
                  max={stats.totalRegistrations} 
                  color="bg-blue-500"
                  className="mt-4"
                />
              </div>
            </DashboardCard>

            {/* Female Students Card */}
            <DashboardCard title="Female Students">
              <div className="text-center">
                <div className="text-5xl font-bold text-pink-600 dark:text-pink-400">
                  {stats.genderDistribution.female}
                </div>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {stats.totalRegistrations > 0 ? 
                    `${Math.round((stats.genderDistribution.female / stats.totalRegistrations) * 100)}% of total` : 
                    'No data'}
                </p>
                <ProgressBar 
                  value={stats.genderDistribution.female} 
                  max={stats.totalRegistrations} 
                  color="bg-pink-500"
                  className="mt-4"
                />
              </div>
            </DashboardCard>

            {/* Faculties Card */}
            <DashboardCard title="Faculties">
              <div className="text-center">
                <div className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">
                  {stats.facultyDistribution.length}
                </div>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Faculties represented
                </p>
              </div>
            </DashboardCard>
          </div>
        )}

        {/* Faculty Distribution */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <DashboardCard title="Faculty Distribution">
              <div className="space-y-4">
                {stats.facultyDistribution
                  .sort((a, b) => b.count - a.count)
                  .map((faculty, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {faculty.faculty}
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {faculty.count}
                        </span>
                      </div>
                      <ProgressBar 
                        value={faculty.count} 
                        max={stats.totalRegistrations} 
                        color="bg-gradient-to-r from-blue-500 to-cyan-400"
                      />
                    </div>
                  ))}
              </div>
            </DashboardCard>

            {/* Gender Ratio Pie Chart */}
            <DashboardCard title="Gender Ratio">
              <div className="flex justify-center items-center h-full">
                <div className="relative w-64 h-64">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Male segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="10"
                      strokeDasharray={`${(stats.genderDistribution.male / stats.totalRegistrations) * 283} 283`}
                      transform="rotate(-90 50 50)"
                    />
                    {/* Female segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#ec4899"
                      strokeWidth="10"
                      strokeDasharray={`${(stats.genderDistribution.female / stats.totalRegistrations) * 283} 283`}
                      strokeDashoffset={`-${(stats.genderDistribution.male / stats.totalRegistrations) * 283}`}
                      transform="rotate(-90 50 50)"
                    />
                    {/* Center text */}
                    <text
                      x="50"
                      y="50"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xl font-bold fill-gray-800 dark:fill-gray-200"
                    >
                      {stats.totalRegistrations}
                    </text>
                    <text
                      x="50"
                      y="60"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-sm fill-gray-600 dark:fill-gray-400"
                    >
                      Total
                    </text>
                  </svg>
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-6">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">Male</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-pink-500 mr-2"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">Female</span>
                    </div>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </div>
        )}

        {/* Recent Registrations */}
        {!loading && !error && (
          <DashboardCard title="Recent Registrations" className="mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Faculty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Registered
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {stats.recentRegistrations.map((student) => (
                    <tr key={student.registrationId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                        #{student.registrationId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {student.faculty}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {student.gender}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {new Date(student.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        )}
      </div>
    </Layout>
  )
}