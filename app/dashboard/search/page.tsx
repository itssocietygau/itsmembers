'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'

interface StudentData {
  registrationId: string
  name: string
  faculty: string
  batch: string
  gender: string
  dob: string
  phone: string
  email: string
  timestamp: string
}

export default function SearchPage() {
  const [searchId, setSearchId] = useState('')
  const [student, setStudent] = useState<StudentData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<StudentData>>({})

  const handleSearch = async () => {
    if (!searchId.trim()) {
      toast.error('Please enter a registration ID')
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_URL}?id=${searchId}`)
      const data = await response.json()

      if (data && !data.error) {
        setStudent(data)
        setEditData(data)
        toast.success('Student record found')
      } else {
        setStudent(null)
        toast.error('No student found with that ID')
      }
    } catch (error) {
      toast.error('Error searching for student')
      console.error(error)
    }
  }

  const handleEdit = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_URL!, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editData,
          registrationId: searchId,
        }),
      })

      if (response.ok) {
        const updatedData = await response.json()
        setStudent(updatedData)
        setEditData(updatedData)
        setIsEditing(false)
        toast.success('Student record updated successfully!')
      } else {
        throw new Error('Failed to update data')
      }
    } catch (error) {
      toast.error('Error updating student data')
      console.error(error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
        Search & Edit Student Records
      </h1>

      <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-8">
        <div className="flex space-x-4">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value.toUpperCase())}
            placeholder="Enter 6-digit registration ID"
            className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 rounded-lg font-medium text-white transition-all duration-200 ease-in-out transform hover:scale-[1.01]"
          >
            Search
          </button>
        </div>
      </div>

      {student && (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-cyan-400">
              Student Record: {student.registrationId}
            </h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white"
              >
                Edit
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setEditData(student)
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white"
                >
                  Save
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
              {isEditing ? (
                <input
                  name="name"
                  value={editData.name || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              ) : (
                <p className="px-4 py-2 bg-gray-700 rounded-lg text-white">{student.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Faculty</label>
              {isEditing ? (
                <select
                  name="faculty"
                  value={editData.faculty || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="Faculty of Agriculture">Faculty of Agriculture</option>
                  <option value="Fisheries">Fisheries</option>
                  <option value="Veterinary Medicine">Veterinary Medicine</option>
                  <option value="Agricultural Economics">Agricultural Economics</option>
                  <option value="Forestry and Environment">Forestry and Environment</option>
                  <option value="Engineering and Bioresource">Engineering and Bioresource</option>
                  <option value="Graduate Studies">Graduate Studies</option>
                </select>
              ) : (
                <p className="px-4 py-2 bg-gray-700 rounded-lg text-white">{student.faculty}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Batch</label>
              {isEditing ? (
                <input
                  name="batch"
                  value={editData.batch || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              ) : (
                <p className="px-4 py-2 bg-gray-700 rounded-lg text-white">{student.batch}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Gender</label>
              {isEditing ? (
                <select
                  name="gender"
                  value={editData.gender || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              ) : (
                <p className="px-4 py-2 bg-gray-700 rounded-lg text-white capitalize">
                  {student.gender}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  name="dob"
                  value={editData.dob ? editData.dob.split('T')[0] : ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              ) : (
                <p className="px-4 py-2 bg-gray-700 rounded-lg text-white">
                  {new Date(student.dob).toLocaleDateString()}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
              {isEditing ? (
                <input
                  name="phone"
                  value={editData.phone || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              ) : (
                <p className="px-4 py-2 bg-gray-700 rounded-lg text-white">{student.phone}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
              {isEditing ? (
                <input
                  name="email"
                  type="email"
                  value={editData.email || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              ) : (
                <p className="px-4 py-2 bg-gray-700 rounded-lg text-white">{student.email}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Registration Date
              </label>
              <p className="px-4 py-2 bg-gray-700 rounded-lg text-white">
                {new Date(student.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}