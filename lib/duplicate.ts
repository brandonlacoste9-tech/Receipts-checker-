import crypto from 'crypto'
import { supabase } from './supabase'

/**
 * Generate SHA-256 hash of image buffer for duplicate detection
 */
export async function hashImage(buffer: Buffer): Promise<string> {
  return crypto.createHash('sha256').update(buffer).digest('hex')
}

/**
 * Check if a receipt with the same image hash already exists
 */
export async function checkDuplicate(hash: string): Promise<{ isDuplicate: boolean; existingReceipt?: any }> {
  if (!hash) return { isDuplicate: false }

  try {
    const { data, error } = await supabase
      .from('receipts')
      .select('*')
      .eq('image_hash', hash)
      .limit(1)
      .single()

    if (error || !data) {
      return { isDuplicate: false }
    }

    return { isDuplicate: true, existingReceipt: data }
  } catch (err) {
    console.error('Error checking duplicate:', err)
    return { isDuplicate: false }
  }
}

/**
 * Calculate hash from File
 */
export async function hashFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  return hashImage(buffer)
}

/**
 * Calculate hash from base64 string
 */
export async function hashBase64(base64String: string): Promise<string> {
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '')
  const buffer = Buffer.from(base64Data, 'base64')
  return hashImage(buffer)
}
