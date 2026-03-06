# Receipt Checker Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a comprehensive receipt checker app with OCR, AI categorization, Quebec tax support, and bilingual interface

**Architecture:** Next.js 14 app with Supabase backend, Ollama for local AI, Veryfi/Google Vision for OCR

**Tech Stack:** Next.js 14, React, Tailwind CSS, Supabase, Ollama, Veryfi API, TypeScript

---

## Prerequisites

Before starting, ensure you have:
- Node.js 18+ama installed installed
- Oll and running locally (`ollama serve`)
- Supabase project created
- Veryfi API key (or Google Cloud Vision credentials)

---

## Task 1: Fix package.json and Clean Up Codebase

**Files:**
- Modify: `package.json:1-39`
- Modify: `next.config.js`
- Modify: `tailwind.config.js`

### Step 1: Fix package.json name and dependencies

```json
{
  "name": "receipts-checker",
  "version": "1.0.0",
  "description": "AI-powered receipt checker with Quebec tax support",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "test": "vitest run"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "14.2.32",
    "lucide-react": "^0.263.1",
    "@supabase/supabase-js": "^2.39.0",
    "papaparse": "^5.4.1",
    "pdfkit": "^0.14.0",
    "crypto-js": "^4.2.0",
    "ollama": "^0.1.0"
  },
  "devDependencies": {
    "@types-node": "^20.0.0",
    "@types-react": "^18.2.0",
    "@types-react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "vitest": "^4.0.13",
    "@testing-library/react": "^16.0.1",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.32",
    "jsdom": "^25.0.1"
  }
}
```

### Step 2: Run npm install

```bash
cd Receipts-checker-
npm install
```

### Step 3: Commit

```bash
git add package.json
git commit -m "fix: rename project to receipts-checker and update dependencies"
```

---

## Task 2: Set Up Supabase Client and Types

**Files:**
- Create: `lib/supabase.ts`
- Create: `types/index.ts`

### Step 1: Create Supabase client

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Step 2: Create TypeScript types

```typescript
// types/index.ts
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

export type Language = 'en' | 'fr'
```

### Step 3: Commit

```bash
git add lib/supabase.ts types/index.ts
git commit -m "feat: add Supabase client and TypeScript types"
```

---

## Task 3: Create Bilingual i18n System

**Files:**
- Create: `lib/i18n.ts`
- Create: `components/LanguageToggle.tsx`
- Modify: `app/layout.tsx`

### Step 1: Create i18n system

```typescript
// lib/i18n.ts
export const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    receipts: 'Receipts',
    upload: 'Upload',
    reports: 'Reports',
    settings: 'Settings',

    // Actions
    uploadReceipt: 'Upload Receipt',
    search: 'Search...',
    filter: 'Filter',
    export: 'Export',
    delete: 'Delete',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',

    // Receipt fields
    vendor: 'Vendor',
    date: 'Date',
    total: 'Total',
    tax: 'Tax',
    category: 'Category',
    lineItems: 'Line Items',

    // Categories
    food: 'Food & Dining',
    transport: 'Transportation',
    office: 'Office Supplies',
    utilities: 'Utilities',
    entertainment: 'Entertainment',
    healthcare: 'Healthcare',
    donations: 'Donations',

    // Messages
    noReceipts: 'No receipts yet',
    uploadFirst: 'Upload your first receipt to get started',
    duplicateFound: 'Duplicate receipt detected',
    processing: 'Processing...',

    // AI Chat
    askAI: 'Ask AI',
    aiThinking: 'Thinking...',

    // Quebec
    quebecTaxCredit: 'Quebec Tax Credit Eligible',
  },
  fr: {
    // Navigation
    dashboard: 'Tableau de bord',
    receipts: 'Reçus',
    upload: 'Téléverser',
    reports: 'Rapports',
    settings: 'Paramètres',

    // Actions
    uploadReceipt: 'Téléverser un reçu',
    search: 'Rechercher...',
    filter: 'Filtrer',
    export: 'Exporter',
    delete: 'Supprimer',
    edit: 'Modifier',
    save: 'Enregistrer',
    cancel: 'Annuler',

    // Receipt fields
    vendor: 'Fournisseur',
    date: 'Date',
    total: 'Total',
    tax: 'Taxe',
    category: 'Catégorie',
    lineItems: 'Articles',

    // Categories
    food: 'Alimentation',
    transport: 'Transport',
    office: 'Fournitures de bureau',
    utilities: 'Services publics',
    entertainment: 'Divertissement',
    healthcare: 'Santé',
    donations: 'Dons',

    // Messages
    noReceipts: 'Aucun reçu',
    uploadFirst: 'Téléversez votre premier reçu pour commencer',
    duplicateFound: 'Reçu en double détecté',
    processing: 'Traitement...',

    // AI Chat
    askAI: 'Demander à l\'IA',
    aiThinking: 'Réflexion...',

    // Quebec
    quebecTaxCredit: 'Admissible au crédit d\'impôt du Québec',
  }
} as const

export type TranslationKey = keyof typeof translations.en

export function t(key: TranslationKey, lang: 'en' | 'fr'): string {
  return translations[lang][key] || translations.en[key] || key
}
```

### Step 2: Create LanguageToggle component

```typescript
// components/LanguageToggle.tsx
'use client'

import { useState, useEffect } from 'react'
import { Globe } from 'lucide-react'

interface LanguageToggleProps {
  onChange: (lang: 'en' | 'fr') => void
}

export function LanguageToggle({ onChange }: LanguageToggleProps) {
  const [lang, setLang] = useState<'en' | 'fr'>('en')

  useEffect(() => {
    const saved = localStorage.getItem('receipts-lang') as 'en' | 'fr' | null
    if (saved) {
      setLang(saved)
      onChange(saved)
    } else {
      const browserLang = navigator.language.startsWith('fr') ? 'fr' : 'en'
      setLang(browserLang)
      onChange(browserLang)
    }
  }, [])

  const toggle = () => {
    const newLang = lang === 'en' ? 'fr' : 'en'
    setLang(newLang)
    localStorage.setItem('receipts-lang', newLang)
    onChange(newLang)
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-medium uppercase">{lang}</span>
    </button>
  )
}
```

### Step 3: Update layout

```typescript
// app/layout.tsx - add LanguageProvider
'use client'
import { createContext, useContext, useState } from 'react'
import './globals.css'
import { LanguageToggle } from '@/components/LanguageToggle'
import { t } from '@/lib/i18n'

const LanguageContext = createContext<{
  lang: 'en' | 'fr'
  t: (key: any) => string
}>({ lang: 'en', t: (key) => key })

export function useLanguage() {
  return useContext(LanguageContext)
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<'en' | 'fr'>('en')

  return (
    <html lang={lang}>
      <body>
        <LanguageContext.Provider value={{ lang, t: (key: any) => t(key, lang) }}>
          {children}
        </LanguageContext.Provider>
      </body>
    </html>
  )
}
```

### Step 4: Commit

```bash
git add lib/i18n.ts components/LanguageToggle.tsx app/layout.tsx
git commit -m "feat: add bilingual i18n system with language toggle"
```

---

## Task 4: Build Receipt Upload Component with Camera Support

**Files:**
- Create: `components/ReceiptUploader.tsx`
- Create: `app/api/upload/route.ts`

### Step 1: Create ReceiptUploader component

```typescript
// components/ReceiptUploader.tsx
'use client'

import { useState, useRef } from 'react'
import { Upload, Camera, X, Loader2 } from 'lucide-react'

interface ReceiptUploaderProps {
  onUpload: (file: File) => Promise<void>
  uploading?: boolean
}

export function ReceiptUploader({ onUpload, uploading = false }: ReceiptUploaderProps) {
  const [dragOver, setDragOver] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    setPreview(URL.createObjectURL(file))
    onUpload(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-2xl p-8 text-center transition
          ${dragOver ? 'border-purple-500 bg-purple-500/10' : 'border-slate-600'}
        `}
      >
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Receipt preview" className="max-h-64 mx-auto rounded-lg" />
            <button
              onClick={() => setPreview(null)}
              className="absolute top-2 right-2 p-1 bg-red-500 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <p className="text-lg font-medium mb-2">Drop receipt here</p>
            <p className="text-slate-400 mb-4">or choose an option below</p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
              >
                <Upload className="w-4 h-4" />
                Upload File
              </button>
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600"
              >
                <Camera className="w-4 h-4" />
                Take Photo
              </button>
            </div>
          </>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>

      {uploading && (
        <div className="flex items-center justify-center gap-2 mt-4 text-purple-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          Processing receipt...
        </div>
      )}
    </div>
  )
}
```

### Step 2: Create upload API route

```typescript
// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Generate unique filename
    const ext = file.name.split('.').pop()
    const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`

    // Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer()
    const { data, error } = await supabase.storage
      .from('receipts')
      .upload(filename, arrayBuffer, {
        contentType: file.type,
      })

    if (error) throw error

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('receipts')
      .getPublicUrl(filename)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
```

### Step 3: Commit

```bash
git add components/ReceiptUploader.tsx app/api/upload/route.ts
git commit -m "feat: add receipt upload with camera and drag-drop support"
```

---

## Task 5: Build OCR Extraction with Veryfi Integration

**Files:**
- Create: `lib/ocr.ts`
- Create: `app/api/ocr/route.ts`

### Step 1: Create OCR library

```typescript
// lib/ocr.ts
interface VeryfiResponse {
  vendor: {
    name: string
    address?: string
  }
  date: string
  total: number
  tax: number
  line_items: Array<{
    description: string
    quantity: number
    unit_price: number
    total: number
  }>
}

export async function extractReceiptData(imageUrl: string): Promise<{
  vendor: string
  date: string
  total: number
  tax: number
  lineItems: Array<{
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
}> {
  const VERYFI_CLIENT_ID = process.env.VERYFI_CLIENT_ID!
  const VERYFI_API_KEY = process.env.VERYFI_API_KEY!
  const VERYFI_URL = 'https://api.veryfi.com/api/v8/'

  const response = await fetch(`${VERYFI_URL}partner/documents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'CLIENT-ID': VERYFI_CLIENT_ID,
      'AUTHORIZATION': `apikey ${VERYFI_API_KEY}`,
    },
    body: JSON.stringify({
      file_url: imageUrl,
      categories: ['Receipt'],
    }),
  })

  if (!response.ok) {
    throw new Error(`OCR failed: ${response.statusText}`)
  }

  const data: VeryfiResponse = await response.json()

  return {
    vendor: data.vendor?.name || 'Unknown Vendor',
    date: data.date || new Date().toISOString().split('T')[0],
    total: data.total || 0,
    tax: data.tax || 0,
    lineItems: data.line_items?.map(item => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      total: item.total,
    })) || [],
  }
}

// Fallback: Simple extraction using regex for basic receipts
export function extractBasicReceiptData(text: string): {
  vendor: string
  date: string
  total: number
  tax: number
} {
  const lines = text.split('\n')

  // Extract total (look for "Total", "Amount", etc.)
  const totalMatch = text.match(/(?:Total|Amount|Sous-total|subtotal)[:\s]*\$?\s*([\d,]+\.?\d*)/i)
  const total = totalMatch ? parseFloat(totalMatch[1].replace(',', '')) : 0

  // Extract tax
  const taxMatch = text.match(/(?:Tax|TPS|TVQ|HST|GST)[:\s]*\$?\s*([\d,]+\.?\d*)/i)
  const tax = taxMatch ? parseFloat(taxMatch[1].replace(',', '')) : 0

  // Extract date
  const dateMatch = text.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/)
  const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0]

  // Vendor is likely first non-empty line
  const vendor = lines.find(line => line.trim().length > 2) || 'Unknown'

  return { vendor, date, total, tax }
}
```

### Step 2: Create OCR API route

```typescript
// app/api/ocr/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { extractReceiptData, extractBasicReceiptData } from '@/lib/ocr'

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json()

    if (!imageUrl) {
      return NextResponse.json({ error: 'No image URL provided' }, { status: 400 })
    }

    // Try Veryfi first
    try {
      const data = await extractReceiptData(imageUrl)
      return NextResponse.json({ success: true, data, source: 'veryfi' })
    } catch (veryfiError) {
      console.error('Veryfi failed, using fallback:', veryfiError)
      // Fallback: return URL for manual entry
      return NextResponse.json({
        success: false,
        fallback: true,
        message: 'OCR unavailable, please enter details manually'
      })
    }
  } catch (error) {
    console.error('OCR error:', error)
    return NextResponse.json({ error: 'OCR processing failed' }, { status: 500 })
  }
}
```

### Step 3: Commit

```bash
git add lib/ocr.ts app/api/ocr/route.ts
git commit -m "feat: add OCR extraction with Veryfi integration"
```

---

## Task 6: Implement Duplicate Detection

**Files:**
- Create: `lib/duplicate.ts`

### Step 1: Create duplicate detection library

```typescript
// lib/duplicate.ts
import CryptoJS from 'crypto-js'

export function generateImageHash(imageData: string): string {
  // Hash the image data for duplicate detection
  return CryptoJS.SHA256(imageData).toString().substring(0, 16)
}

export function generateReceiptHash(data: {
  vendor: string
  date: string
  total: number
  tax: number
}): string {
  const string = `${data.vendor.toLowerCase()}-${data.date}-${data.total}-${data.tax}`
  return CryptoJS.SHA256(string).toString().substring(0, 16)
}

export interface DuplicateCheck {
  isDuplicate: boolean
  existingReceiptId?: string
  similarity?: number
}

export async function checkDuplicate(
  receiptHash: string,
  userId: string
): Promise<DuplicateCheck> {
  // This would query Supabase
  // For now, return the logic
  const { supabase } = await import('@/lib/supabase')

  const { data, error } = await supabase
    .from('receipts')
    .select('id, image_hash')
    .eq('user_id', userId)
    .limit(10)

  if (error || !data) return { isDuplicate: false }

  for (const receipt of data) {
    if (receipt.image_hash === receiptHash) {
      return { isDuplicate: true, existingReceiptId: receipt.id, similarity: 100 }
    }
  }

  return { isDuplicate: false }
}
```

### Step 2: Commit

```bash
git add lib/duplicate.ts
git commit -m "feat: add duplicate detection with hash-based matching"
```

---

## Task 7: Build Receipts List Page

**Files:**
- Create: `app/receipts/page.tsx`
- Create: `components/ReceiptCard.tsx`

### Step 1: Create ReceiptCard component

```typescript
// components/ReceiptCard.tsx
import { Receipt } from '@/types'
import { Calendar, DollarSign, MapPin } from 'lucide-react'

interface ReceiptCardProps {
  receipt: Receipt
  onClick: () => void
}

export function ReceiptCard({ receipt, onClick }: ReceiptCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-slate-800 rounded-xl p-4 hover:bg-slate-700 cursor-pointer transition"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{receipt.vendor}</h3>
        <span className="text-green-400 font-bold">${receipt.total.toFixed(2)}</span>
      </div>

      <div className="flex gap-4 text-sm text-slate-400">
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {new Date(receipt.date).toLocaleDateString()}
        </span>
        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded">
          {receipt.category}
        </span>
      </div>

      {receipt.quebecEligible && (
        <span className="inline-block mt-2 text-xs text-amber-400">
          🇨🇦 Quebec Tax Credit Eligible
        </span>
      )}
    </div>
  )
}
```

### Step 2: Create receipts list page

```typescript
// app/receipts/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Receipt } from '@/types'
import { ReceiptCard } from '@/components/ReceiptCard'
import { ReceiptUploader } from '@/components/ReceiptUploader'
import { Search } from 'lucide-react'

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showUploader, setShowUploader] = useState(false)

  useEffect(() => {
    loadReceipts()
  }, [])

  const loadReceipts = async () => {
    const { data, error } = await supabase
      .from('receipts')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setReceipts(data)
    setLoading(false)
  }

  const filteredReceipts = receipts.filter(r =>
    r.vendor.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Receipts</h1>
          <button
            onClick={() => setShowUploader(!showUploader)}
            className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
          >
            + Add Receipt
          </button>
        </div>

        {showUploader && (
          <div className="mb-6">
            <ReceiptUploader onUpload={async (file) => {
              // Handle upload
              setShowUploader(false)
              loadReceipts()
            }} />
          </div>
        )}

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search receipts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {loading ? (
          <p className="text-center text-slate-400">Loading...</p>
        ) : filteredReceipts.length === 0 ? (
          <p className="text-center text-slate-400">No receipts found</p>
        ) : (
          <div className="space-y-3">
            {filteredReceipts.map(receipt => (
              <ReceiptCard
                key={receipt.id}
                receipt={receipt}
                onClick={() => {/* Navigate to detail */}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

### Step 3: Commit

```bash
git add components/ReceiptCard.tsx app/receipts/page.tsx
git commit -m "feat: add receipts list page with search and upload"
```

---

## Task 8: Integrate Ollama for AI Features

**Files:**
- Create: `lib/ollama.ts`
- Create: `app/api/ai/route.ts`
- Modify: `components/AIAgent.tsx`

### Step 1: Create Ollama library

```typescript
// lib/ollama.ts
interface OllamaResponse {
  model: string
  response: string
  done: boolean
}

export async function askOllama(prompt: string, systemPrompt?: string): Promise<string> {
  const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434'

  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.2' or 'mistral',
      prompt: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt,
      stream: false,
    }),
  })

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.statusText}`)
  }

  const data: OllamaResponse = await response.json()
  return data.response
}

export async function categorizeReceipt(
  vendor: string,
  description: string,
  lang: 'en' | 'fr'
): Promise<{ category: string; confidence: number }> {
  const prompt = lang === 'fr'
    ? `Tu es un assistant qui categorize les reçus. Analyse ce reçu:
Fournisseur: ${vendor}
Description: ${description}

Categories disponibles: Alimentation, Transport, Fournitures de bureau, Services publics, Divertissement, Santé, Dons, Autre

Réponds seulement avec la catégorie et un niveau de confiance (0-100). Format: catégorie,confiance`
    : `You are a receipt categorization assistant. Analyze this receipt:
Vendor: ${vendor}
Description: ${description}

Categories available: Food & Dining, Transportation, Office Supplies, Utilities, Entertainment, Healthcare, Donations, Other

Reply only with category and confidence level (0-100). Format: category,confidence`

  const response = await askOllama(prompt)
  const [category, confidence] = response.split(',').map(s => s.trim())

  return {
    category: category || 'Other',
    confidence: parseInt(confidence) || 50
  }
}

export async function generateSpendingInsights(
  receipts: any[],
  lang: 'en' | 'fr'
): Promise<string> {
  const total = receipts.reduce((sum, r) => sum + r.total, 0)
  const byCategory = receipts.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + r.total
    return acc
  }, {} as Record<string, number>)

  const prompt = lang === 'fr'
    ? `Analyse ces dépenses:
Total: ${total.toFixed(2)} $
Par catégorie: ${JSON.stringify(byCategory)}

Donne 3 insights intéressants en français.`
    : `Analyze these expenses:
Total: $${total.toFixed(2)}
By category: ${JSON.stringify(byCategory)}

Give 3 interesting insights in English.`

  return askOllama(prompt)
}
```

### Step 2: Create AI API route

```typescript
// app/api/ai/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { askOllama, categorizeReceipt, generateSpendingInsights } from '@/lib/ollama'

export async function POST(req: NextRequest) {
  try {
    const { action, data } = await req.json()

    switch (action) {
      case 'categorize': {
        const result = await categorizeReceipt(data.vendor, data.description, data.lang)
        return NextResponse.json(result)
      }

      case 'insights': {
        const insights = await generateSpendingInsights(data.receipts, data.lang)
        return NextResponse.json({ insights })
      }

      case 'chat': {
        const response = await askOllama(data.message, data.context)
        return NextResponse.json({ response })
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (error) {
    console.error('AI error:', error)
    return NextResponse.json({ error: 'AI processing failed' }, { status: 500 })
  }
}
```

### Step 3: Commit

```bash
git add lib/ollama.ts app/api/ai/route.ts
git commit -m "feat: integrate Ollama for AI categorization and insights"
```

---

## Task 9: Add Quebec Tax Rules

**Files:**
- Create: `lib/quebec-tax.ts`
- Modify: `types/index.ts`

### Step 1: Create Quebec tax rules

```typescript
// lib/quebec-tax.ts
interface QuebecTaxRule {
  id: string
  nameEn: string
  nameFr: string
  category: string
  creditRate?: number
  maxCredit?: number
  descriptionEn: string
  descriptionFr: string
}

export const quebecTaxRules: QuebecTaxRule[] = [
  {
    id: 'child-care',
    nameEn: 'Child Care Expenses',
    nameFr: 'Frais de garde d\'enfants',
    category: 'Healthcare',
    creditRate: 0.75,
    maxCredit: 10000,
    descriptionEn: 'Daycare, preschool, camps',
    descriptionFr: 'Garderie, préscolaire, camps',
  },
  {
    id: 'medical',
    nameEn: 'Medical Expenses',
    nameFr: 'Frais médicaux',
    category: 'Healthcare',
    creditRate: 0.20,
    maxCredit: 3000,
    descriptionEn: 'Doctor, dentist, vision',
    descriptionEn: 'Médecin, dentiste, vision',
  },
  {
    id: 'donations',
    nameEn: 'Charitable Donations',
    nameFr: 'Dons de bienfaisance',
    category: 'Donations',
    creditRate: 0.33,
    maxCredit: 1500,
    descriptionEn: 'Registered charities',
    descriptionFr: 'Organismes de bienfaisance enregistrés',
  },
  {
    id: 'rd',
    nameEn: 'R&D Tax Credit',
    nameFr: 'Crédit d\'impôt R&D',
    category: 'Business',
    descriptionEn: 'Scientific research and experimental development',
    descriptionFr: 'Recherche scientifique et développement expérimental',
  },
  {
    id: 'cultural',
    nameEn: 'Cultural Donations',
    nameFr: 'Dons culturels',
    category: 'Donations',
    creditRate: 0.30,
    descriptionEn: 'Museums, theaters, libraries',
    descriptionFr: 'Musées, théâtres, bibliothèques',
  },
  {
    id: 'political',
    nameEn: 'Political Contributions',
    nameFr: 'Contributions politiques',
    category: 'Donations',
    creditRate: 0.75,
    maxCredit: 2000,
    descriptionEn: 'Federal and provincial parties',
    descriptionFr: 'Partis fédéraux et provinciaux',
  },
]

export function checkQuebecEligibility(
  category: string,
  vendor: string,
  description: string
): { eligible: boolean; rules: QuebecTaxRule[] } {
  const vendorLower = (vendor + ' ' + description).toLowerCase()

  const matchedRules = quebecTaxRules.filter(rule => {
    // Match by category
    if (rule.category.toLowerCase() === category.toLowerCase()) return true
    // Match by keywords
    const keywords = {
      child-care: ['daycare', 'garderie', 'camp', ' préscolaire'],
      medical: ['doctor', 'médecin', 'dentist', 'dentiste', 'hospital', 'pharmacy'],
      donations: ['donation', 'don', 'charity', 'bienfaisance'],
      cultural: ['museum', 'musée', 'theater', 'théâtre', 'library', 'bibliothèque'],
      political: ['party', 'parti', 'political', 'politique'],
    }
    return keywords[rule.id as keyof typeof keywords]?.some(k =>
      vendorLower.includes(k)
    ) || false
  })

  return {
    eligible: matchedRules.length > 0,
    rules: matchedRules
  }
}

export function calculateQuebecCredit(
  ruleId: string,
  amount: number
): number {
  const rule = quebecTaxRules.find(r => r.id === ruleId)
  if (!rule || !rule.creditRate) return 0

  const credit = amount * rule.creditRate
  return rule.maxCredit ? Math.min(credit, rule.maxCredit) : credit
}
```

### Step 2: Commit

```bash
git add lib/quebec-tax.ts
git commit -m "feat: add Quebec tax rules and eligibility checker"
```

---

## Task 10: Build Export Functionality

**Files:**
- Create: `lib/export.ts`
- Create: `app/api/export/route.ts`

### Step 1: Create export library

```typescript
// lib/export.ts
import Papa from 'papaparse'
import PDFDocument from 'pdfkit'

interface ExportData {
  receipts: Array<{
    vendor: string
    date: string
    total: number
    tax: number
    category: string
    quebecEligible: boolean
  }>
}

export function exportToCSV(data: ExportData): string {
  const rows = data.receipts.map(r => ({
    Vendor: r.vendor,
    Date: r.date,
    Total: r.total.toFixed(2),
    Tax: r.tax.toFixed(2),
    Category: r.category,
    'Quebec Eligible': r.quebecEligible ? 'Yes' : 'No',
  }))

  return Papa.unparse(rows)
}

export function createPDF(data: ExportData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument()
    const chunks: Buffer[] = []

    doc.on('data', chunk => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    // Title
    doc.fontSize(20).text('Receipts Report', { align: 'center' })
    doc.moveDown()

    // Summary
    const total = data.receipts.reduce((sum, r) => sum + r.total, 0)
    const totalTax = data.receipts.reduce((sum, r) => sum + r.tax, 0)
    const quebecCount = data.receipts.filter(r => r.quebecEligible).length

    doc.fontSize(12)
    doc.text(`Total Receipts: ${data.receipts.length}`)
    doc.text(`Total Amount: $${total.toFixed(2)}`)
    doc.text(`Total Tax: $${totalTax.toFixed(2)}`)
    doc.text(`Quebec Eligible: ${quebecCount}`)
    doc.moveDown()

    // Table header
    doc.fontSize(10)
    const tableTop = doc.y
    doc.text('Vendor', 50, tableTop)
    doc.text('Date', 200, tableTop)
    doc.text('Category', 280, tableTop)
    doc.text('Total', 380, tableTop)
    doc.text('QC', 450, tableTop)

    doc.moveTo(50, tableTop + 15).lineTo(500, tableTop + 15).stroke()

    // Table rows
    let y = tableTop + 25
    data.receipts.forEach((receipt, i) => {
      if (y > 700) {
        doc.addPage()
        y = 50
      }
      doc.text(receipt.vendor.substring(0, 25), 50, y)
      doc.text(receipt.date, 200, y)
      doc.text(receipt.category.substring(0, 15), 280, y)
      doc.text(`$${receipt.total.toFixed(2)}`, 380, y)
      doc.text(receipt.quebecEligible ? '✓' : '', 450, y)
      y += 20
    })

    doc.end()
  })
}

export function exportToQuickBooks(data: ExportData): string {
  // QuickBooks CSV format
  const rows = data.receipts.map(r => ({
    Date: r.date,
    Account: getCategoryAccount(r.category),
    Description: r.vendor,
    Amount: r.total,
    TaxAmount: r.tax,
    Vendor: r.vendor,
  }))
  return Papa.unparse(rows)
}

function getCategoryAccount(category: string): string {
  const accounts: Record<string, string> = {
    'Food & Dining': 'Meals & Entertainment',
    'Transportation': 'Automobile',
    'Office Supplies': 'Office Supplies',
    'Utilities': 'Utilities',
    'Entertainment': 'Entertainment',
    'Healthcare': 'Medical & Dental',
    'Donations': 'Charitable Contributions',
  }
  return accounts[category] || 'Miscellaneous Expenses'
}
```

### Step 2: Create export API route

```typescript
// app/api/export/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { exportToCSV, createPDF, exportToQuickBooks } from '@/lib/export'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { format, startDate, endDate } = await req.json()

    // Fetch receipts
    let query = supabase.from('receipts').select('*')
    if (startDate) query = query.gte('date', startDate)
    if (endDate) query = query.lte('date', endDate)

    const { data: receipts } = await query

    if (!receipts || receipts.length === 0) {
      return NextResponse.json({ error: 'No receipts found' }, { status: 404 })
    }

    const exportData = { receipts }

    switch (format) {
      case 'csv': {
        const csv = exportToCSV(exportData)
        return new NextResponse(csv, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="receipts.csv"',
          },
        })
      }

      case 'pdf': {
        const pdf = await createPDF(exportData)
        return new NextResponse(pdf, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="receipts.pdf"',
          },
        })
      }

      case 'quickbooks': {
        const csv = exportToQuickBooks(exportData)
        return new NextResponse(csv, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="quickbooks-import.csv"',
          },
        })
      }

      default:
        return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
    }
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
```

### Step 3: Commit

```bash
git add lib/export.ts app/api/export/route.ts
git commit -m "feat: add CSV, PDF, and QuickBooks export functionality"
```

---

## Task 11: Create Dashboard with AI Insights

**Files:**
- Create: `app/page.tsx`

### Step 1: Create main dashboard

```typescript
// app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Receipt } from '@/types'
import { ReceiptUploader } from '@/components/ReceiptUploader'
import { LanguageToggle } from '@/components/LanguageToggle'
import { AIAgent } from '@/components/AIAgent'
import { DollarSign, TrendingUp, Receipt as ReceiptIcon } from 'lucide-react'

export default function Dashboard() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)
  const [showUploader, setShowUploader] = useState(false)
  const [lang, setLang] = useState<'en' | 'fr'>('en')

  useEffect(() => {
    loadReceipts()
  }, [])

  const loadReceipts = async () => {
    const { data } = await supabase
      .from('receipts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (data) setReceipts(data)
    setLoading(false)
  }

  const total = receipts.reduce((sum, r) => sum + r.total, 0)
  const taxTotal = receipts.reduce((sum, r) => sum + r.tax, 0)
  const quebecEligible = receipts.filter(r => r.quebecEligible).length

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Receipt Checker</h1>
          <LanguageToggle onChange={setLang} />
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-6 h-6 text-green-400" />
              <span className="text-slate-400">Total Spent</span>
            </div>
            <p className="text-3xl font-bold">${total.toFixed(2)}</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <ReceiptIcon className="w-6 h-6 text-purple-400" />
              <span className="text-slate-400">Receipts</span>
            </div>
            <p className="text-3xl font-bold">{receipts.length}</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-amber-400" />
              <span className="text-slate-400">QC Eligible</span>
            </div>
            <p className="text-3xl font-bold">{quebecEligible}</p>
          </div>
        </div>

        {/* Upload */}
        <div className="bg-slate-800 rounded-xl p-6 mb-8">
          <button
            onClick={() => setShowUploader(!showUploader)}
            className="w-full py-4 border-2 border-dashed border-slate-600 rounded-xl hover:border-purple-500 transition"
          >
            + {lang === 'fr' ? 'Téléverser un reçu' : 'Upload Receipt'}
          </button>
          {showUploader && (
            <div className="mt-4">
              <ReceiptUploader
                onUpload={async (file) => {
                  // Handle upload + OCR + save
                  setShowUploader(false)
                  loadReceipts()
                }}
              />
            </div>
          )}
        </div>

        {/* Recent Receipts */}
        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">
            {lang === 'fr' ? 'Reçus récents' : 'Recent Receipts'}
          </h2>
          {loading ? (
            <p className="text-slate-400">Loading...</p>
          ) : receipts.length === 0 ? (
            <p className="text-slate-400">
              {lang === 'fr' ? 'Aucun reçu' : 'No receipts yet'}
            </p>
          ) : (
            <div className="space-y-2">
              {receipts.slice(0, 5).map(receipt => (
                <div key={receipt.id} className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                  <div>
                    <p className="font-medium">{receipt.vendor}</p>
                    <p className="text-sm text-slate-400">{receipt.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${receipt.total.toFixed(2)}</p>
                    <p className="text-xs text-slate-400">{receipt.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* AI Chat */}
      <AIAgent dashboardData={{ total, taxTotal, quebecEligible }} />
    </div>
  )
}
```

### Step 2: Commit

```bash
git add app/page.tsx
git commit -m "feat: create main dashboard with stats and AI insights"
```

---

## Task 12: Set Up Supabase Database Schema

**Files:**
- Create: `supabase/schema.sql`

### Step 1: Create database schema

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  preferred_language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Receipts table
CREATE TABLE receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_hash TEXT,
  vendor TEXT NOT NULL,
  date DATE NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  currency TEXT DEFAULT 'CAD',
  category TEXT,
  line_items JSONB DEFAULT '[]',
  is_duplicate BOOLEAN DEFAULT FALSE,
  linked_receipt_id UUID,
  quebec_eligible BOOLEAN DEFAULT FALSE,
  quebec_category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en TEXT NOT NULL,
  name_fr TEXT NOT NULL,
  quebec_tax_credit TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name_en, name_fr, icon) VALUES
  ('Food & Dining', 'Alimentation', 'utensils'),
  ('Transportation', 'Transport', 'car'),
  ('Office Supplies', 'Fournitures de bureau', 'paperclip'),
  ('Utilities', 'Services publics', 'zap'),
  ('Entertainment', 'Divertissement', 'gamepad'),
  ('Healthcare', 'Santé', 'heart'),
  ('Donations', 'Dons', 'heart-handshake'),
  ('Other', 'Autre', 'more-horizontal');

-- Create indexes
CREATE INDEX receipts_user_id ON receipts(user_id);
CREATE INDEX receipts_date ON receipts(date);
CREATE INDEX receipts_category ON receipts(category);
CREATE INDEX receipts_image_hash ON receipts(image_hash);

-- Row Level Security
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own receipts
CREATE POLICY "Users can view own receipts" ON receipts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own receipts" ON receipts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own receipts" ON receipts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own receipts" ON receipts
  FOR DELETE USING (auth.uid() = user_id);

-- Storage bucket for receipts
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', true);

CREATE POLICY "Users can upload receipts" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view receipts" ON storage.objects
  FOR SELECT USING (bucket_id = 'receipts');
```

### Step 2: Commit

```bash
git add supabase/schema.sql
git commit -m "feat: add Supabase database schema with RLS policies"
```

---

## Summary of Tasks

| Task | Description | Estimated Time |
|------|-------------|----------------|
| 1 | Fix package.json & clean up | 5 min |
| 2 | Set up Supabase client & types | 10 min |
| 3 | Create bilingual i18n system | 15 min |
| 4 | Build receipt upload component | 20 min |
| 5 | Build OCR extraction | 20 min |
| 6 | Implement duplicate detection | 15 min |
| 7 | Build receipts list page | 20 min |
| 8 | Integrate Ollama AI | 25 min |
| 9 | Add Quebec tax rules | 15 min |
| 10 | Build export functionality | 20 min |
| 11 | Create dashboard | 15 min |
| 12 | Set up database schema | 10 min |

---

## Plan Complete

**Plan saved to:** `docs/plans/2026-03-06-receipt-checker-design.md`

---

## Two Execution Options:

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**
