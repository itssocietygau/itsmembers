import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabaseClient'
import { format } from 'date-fns'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

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

    // Create PDF
    const doc = new jsPDF()
    
    // Title
    doc.setFontSize(18)
    doc.text('Student Registrations', 14, 20)
    doc.setFontSize(12)
    doc.text(`Generated on ${format(new Date(), 'yyyy-MM-dd HH:mm')}`, 14, 28)
    
    if (faculty) {
      doc.text(`Faculty: ${faculty}`, 14, 36)
    }

    // Table data
    const tableData = registrations.map(reg => [
      reg.registration_id,
      reg.name,
      reg.faculty,
      reg.batch,
      reg.gender,
      format(new Date(reg.dob), 'yyyy-MM-dd'),
      reg.phone,
      reg.email,
      format(new Date(reg.created_at), 'yyyy-MM-dd HH:mm')
    ])

    autoTable(doc, {
      head: [[
        'ID', 'Name', 'Faculty', 'Batch', 'Gender', 'DOB', 'Phone', 'Email', 'Registered'
      ]],
      body: tableData,
      startY: faculty ? 44 : 36,
      margin: { left: 14 },
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] } // blue-500
    })

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=registrations.pdf')
    res.status(200).send(pdfBuffer)
  } catch (error) {
    console.error('PDF export error:', error)
    res.status(500).json({ error: 'Failed to generate PDF' })
  }
}