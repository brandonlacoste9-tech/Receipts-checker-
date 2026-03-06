import { NextRequest, NextResponse } from 'next/server'
import { OCRResult } from '@/types/receipt'

// Veryfi API integration for receipt OCR
const VERYFI_API_URL = 'https://api.veryfi.com/api/v8/'

async function extractWithVeryfi(imageBuffer: Buffer, filename: string): Promise<OCRResult> {
  const clientId = process.env.VERYFI_CLIENT_ID
  const clientSecret = process.env.VERYFI_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('Veryfi credentials not configured')
  }

  const base64 = imageBuffer.toString('base64')

  const response = await fetch(`${VERYFI_API_URL}receipts/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'CLIENT_ID': clientId,
      'AUTHORIZATION': `apikey ${clientId}:${clientSecret}`,
    },
    body: JSON.stringify({
      file_data: base64,
      file_name: filename,
      categories: ['Food & Dining', 'Transportation', 'Office Supplies', 'Entertainment', 'Utilities', 'Healthcare', 'Donations', 'Shopping', 'Travel', 'Education', 'Home & Garden', 'Other'],
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Veryfi API error: ${error}`)
  }

  const data = await response.json()

  return {
    vendor: data.vendor?.name || 'Unknown',
    date: data.date || new Date().toISOString().split('T')[0],
    total: parseFloat(data.total) || 0,
    tax: parseFloat(data.tax) || 0,
    currency: data.currency_code || 'CAD',
    lineItems: (data.line_items || []).map((item: any) => ({
      description: item.description || item.text || '',
      quantity: parseFloat(item.quantity) || 1,
      unitPrice: parseFloat(item.price) || 0,
      total: parseFloat(item.total) || 0,
    })),
  }
}

// Simple regex-based OCR fallback (for when Veryfi is not configured)
function extractWithRegex(imageText: string): OCRResult {
  const lines = imageText.split('\n').filter(l => l.trim())

  // Try to find total (usually the largest number with $ or the last number)
  const totalMatch = imageText.match(/\$?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/)
  const total = totalMatch ? parseFloat(totalMatch[1].replace(/,/g, '')) : 0

  // Try to find tax
  const taxMatch = imageText.match(/(?:tax|gst|hst|tps|tvq)[\s:]*\$?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i)
  const tax = taxMatch ? parseFloat(taxMatch[1].replace(/,/g, '')) : 0

  // Try to find date
  const dateMatch = imageText.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/)
  const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0]

  // Try to find vendor (usually first non-empty line)
  const vendor = lines[0]?.substring(0, 50) || 'Unknown'

  return {
    vendor,
    date,
    total,
    tax,
    currency: 'CAD',
    lineItems: [],
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const image = formData.get('image') as File

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await image.arrayBuffer())

    // Try Veryfi first, fall back to simple extraction
    try {
      const result = await extractWithVeryfi(buffer, image.name)
      return NextResponse.json({ success: true, data: result })
    } catch (veryfiError) {
      console.warn('Veryfi failed, using fallback:', veryfiError)
      // Return a placeholder that requires manual entry
      return NextResponse.json({
        success: true,
        data: {
          vendor: '',
          date: new Date().toISOString().split('T')[0],
          total: 0,
          tax: 0,
          currency: 'CAD',
          lineItems: [],
        } as OCRResult,
        warning: 'OCR service not available. Please enter details manually.',
      })
    }
  } catch (error) {
    console.error('OCR error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process receipt' },
      { status: 500 }
    )
  }
}
