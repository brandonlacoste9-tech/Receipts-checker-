export interface Receipt {
  id: string
  userId: string
  imageUrl: string
  vendor: string
  date: string
  total: number
  tax: number
  currency: 'CAD' | 'USD'
  category: string
  lineItems: LineItem[]
  imageHash: string
  isDuplicate: boolean
  linkedReceiptId?: string
  quebecEligible: boolean
  quebecCategory?: string
  createdAt: string
  updatedAt: string
}

export interface LineItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Category {
  id: string
  nameEn: string
  nameFr: string
  quebecTaxCredit?: string
  icon: string
}

export interface OCRResult {
  vendor: string
  date: string
  total: number
  tax: number
  currency: string
  lineItems: LineItem[]
}
