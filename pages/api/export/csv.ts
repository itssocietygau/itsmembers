import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabaseClient'
import { format } from 'date-fns'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Get optional faculty filter from query
    const faculty = req.query.faculty as string | undefined

    let query = supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false })

    if (faculty) {
      query = query.eq('faculty', faculty)
    }

    const { data: registrations, error } = await query

    if (error) throw error

    // Convert to CSV
    const headers = [
      'Registration ID',
      'Name',
      'Faculty',
      'Batch',
      'Gender',
      'Date of Birth',
      'Phone',
      'Email',
      'Registration Date'
    ].join(',')

    const rows = registrations.map(reg => [
      reg.registration_id,
      `"${reg.name.replace(/"/g, '""')}"`,
      reg.faculty,
      reg.batch,
      reg.gender,
      format(new Date(reg.dob), 'yyyy-MM-dd'),
      reg.phone,
      reg.email,
      format(new Date(reg.created_at), 'yyyy-MM-dd HH:mm:ss')
    ].join(','))

    const csv = [headers, ...rows].join('\n')

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename=registrations.csv')
    res.status(200).send(csv)
  } catch (error) {
    console.error('Export error:', error)
    res.status(500).json({ error: 'Failed to generate CSV' })
  }
}