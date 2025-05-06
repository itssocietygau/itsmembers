import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabaseClient'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Fetch all registrations
    const { data: registrations, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error

    // Calculate statistics
    const totalRegistrations = registrations.length
    const genderDistribution = {
      male: registrations.filter(r => r.gender === 'male').length,
      female: registrations.filter(r => r.gender === 'female').length
    }

    // Group by faculty
    const facultyMap = new Map()
    registrations.forEach(reg => {
      const count = facultyMap.get(reg.faculty) || 0
      facultyMap.set(reg.faculty, count + 1)
    })
    
    const facultyDistribution = Array.from(facultyMap.entries()).map(([faculty, count]) => ({
      faculty,
      count
    }))

    res.status(200).json({
      totalRegistrations,
      facultyDistribution,
      genderDistribution,
      recentRegistrations: registrations.map(r => ({
        registrationId: r.registration_id,
        name: r.name,
        faculty: r.faculty,
        gender: r.gender,
        createdAt: r.created_at
      }))
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    res.status(500).json({ error: 'Failed to fetch statistics' })
  }
}