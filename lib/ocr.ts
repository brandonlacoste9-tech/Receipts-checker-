// OCR Service - Receipt extraction
// Supports Veryfi, Google Vision, or simple extraction

import { OCRResult } from '@/types/receipt'

// Veryfi API (recommended for receipts)
const VERYFI_API_URL = 'https://api.veryfi.com/api/v8/'

async function extractWithVeryfi(imageBuffer: Buffer, filename: string): Promise<OCRResult> {
  const clientId = process.env.VERYFI_CLIENT_ID
  const clientSecret = process.env.VERYFI_CLIENT_SECRET
  const apiKey = process.env.VERYFI_API_KEY

  if (!clientId || !clientSecret || !apiKey) {
    throw new Error('Veryfi credentials not configured')
  }

  const base64 = imageBuffer.toString('base64')

  const response = await fetch(`${VERYFI_API_URL}documents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'CLIENT-ID': clientId,
      'AUTHORIZATION': `apikey ${apiKey}`,
    },
    body: JSON.stringify({
      file_data: base64,
      file_name: filename,
      categories: ['General'],
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Veryfi API error: ${error}`)
  }

  const data = await response.json()

  // Extract line items
  const lineItems = (data.line_items || []).map((item: any) => ({
    description: item.description || item.text || '',
    quantity: parseFloat(item.quantity) || 1,
    unitPrice: parseFloat(item.unit_price) || parseFloat(item.price) || 0,
    total: parseFloat(item.total) || 0,
  }))

  return {
    vendor: data.vendor?.name || data.vendor_name || 'Unknown',
    date: data.date || new Date().toISOString().split('T')[0],
    total: parseFloat(data.total) || 0,
    tax: parseFloat(data.tax) || 0,
    currency: data.currency || 'CAD',
    lineItems,
  }
}

// Google Cloud Vision API
async function extractWithGoogleVision(imageBuffer: Buffer): Promise<OCRResult> {
  const apiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY

  if (!apiKey) {
    throw new Error('Google Cloud Vision API key not configured')
  }

  const base64 = imageBuffer.toString('base64')

  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [
          {
            image: { content: base64 },
            features: [{ type: 'TEXT_DETECTION' }],
            imageContext: { languageHints: ['en', 'fr'] },
          },
        ],
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Google Vision API error: ${error}`)
  }

  const data = await response.json()
  const text = data.responses?.[0]?.textAnnotations?.[0]?.description || ''

  // Parse the extracted text to find receipt data
  return parseReceiptText(text)
}

// Simple text parsing fallback
function parseReceiptText(text: string): OCRResult {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l)

  let vendor = 'Unknown'
  let date = new Date().toISOString().split('T')[0]
  let total = 0
  let tax = 0

  // Try to find total (usually the largest number with $ or the last total line)
  const totalRegex = /(?:total|sum|amount|montant)[:\s]*\$?([\d,]+\.?\d*)/i
  const taxRegex = /(?:tax|tps|tvq|hst|gst)[:\s]*\$?([\d,]+\.?\d*)/i
  const dateRegex = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/
  const priceRegex = /\$?([\d,]+\.\d{2})/

  for (const line of lines) {
    // Look for date
    const dateMatch = line.match(dateRegex)
    if (dateMatch) {
      try {
        const parsed = new Date(dateMatch[1])
        if (!isNaN(parsed.getTime())) {
          date = parsed.toISOString().split('T')[0]
        }
      } catch {}
    }

    // Look for tax
    const taxMatch = line.match(taxRegex)
    if (taxMatch) {
      tax = parseFloat(taxMatch[1].replace(',', '')) || 0
    }

    // Look for total
    const totalMatch = line.match(totalRegex)
    if (totalMatch) {
      total = parseFloat(totalMatch[1].replace(',', '')) || 0
    }
  }

  // If no total found, look for the largest price
  if (!total) {
    const prices = lines
      .map(l => {
        const match = l.match(priceRegex)
        return match ? parseFloat(match[1].replace(',', '')) : 0
      })
      .filter(p => p > 0)
    if (prices.length) {
      total = Math.max(...prices)
    }
  }

  // Vendor is usually first non-empty line
  if (lines.length > 0) {
    vendor = lines[0].substring(0, 50)
  }

  return {
    vendor,
    date,
    total,
    tax,
    currency: 'CAD',
    lineItems: [],
  }
}

// Main extraction function
export async function extractReceipt(imageBuffer: Buffer, filename: string): Promise<OCRResult> {
  // Try Veryfi first (best for receipts)
  if (process.env.VERYFI_CLIENT_ID && process.env.VERYFI_API_KEY) {
    try {
      return await extractWithVeryfi(imageBuffer, filename)
    } catch (error) {
      console.warn('[OCR] Veryfi failed, trying fallback:', error)
    }
  }

  // Try Google Vision
  if (process.env.GOOGLE_CLOUD_VISION_API_KEY) {
    try {
      return await extractWithGoogleVision(imageBuffer)
    } catch (error) {
      console.warn('[OCR] Google Vision failed, using fallback:', error)
    }
  }

  // Fallback to simple parsing
  console.warn('[OCR] Using simple text parsing')
  return parseReceiptText(imageBuffer.toString('utf-8'))
}
