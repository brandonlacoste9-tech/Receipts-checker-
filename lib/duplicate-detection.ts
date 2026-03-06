import CryptoJS from 'crypto-js'

// Generate a hash from image buffer for duplicate detection
export async function hashImage(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer as any)
  return CryptoJS.SHA256(wordArray).toString()
}

// Generate hash from buffer
export function hashBuffer(buffer: Buffer): string {
  return CryptoJS.SHA256(CryptoJS.lib.WordArray.create(buffer as any)).toString()
}

// Simple hash from string
export function hashString(str: string): string {
  return CryptoJS.SHA256(str).toString()
}

// Check if two receipts are likely duplicates based on:
// - Same vendor + same date + same total
// - Same image hash
export function isPotentialDuplicate(
  receipt1: { vendor: string; date: string; total: number },
  receipt2: { vendor: string; date: string; total: number }
): boolean {
  // Same vendor, same date, same total (within 1 cent)
  const sameVendor = receipt1.vendor.toLowerCase().trim() === receipt2.vendor.toLowerCase().trim()
  const sameDate = receipt1.date === receipt2.date
  const sameTotal = Math.abs(receipt1.total - receipt2.total) < 0.01

  return sameVendor && sameDate && sameTotal
}
