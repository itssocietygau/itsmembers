import { redirect } from 'next/navigation'

export default function HomePage() {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-4">University Registration System</h1>
        <div className="flex gap-4">
          <a href="/login" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Operator Login
          </a>
          <a href="/dashboard" className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
            Dashboard
          </a>
        </div>
      </main>
    )
  }