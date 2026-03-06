# Receipt Checker Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a comprehensive receipt checker app that competes with Shoeboxed, Expensify, and Wave - featuring OCR extraction, AI categorization, duplicate detection, Quebec tax support, bilingual UI, and export capabilities.

**Architecture:** Next.js 14 frontend with Supabase backend, Veryfi/Google Vision for OCR, Ollama for local AI processing. Modular component architecture with API routes for business logic.

**Tech Stack:** Next.js 14, React 18, Tailwind CSS, Supabase, Veryfi API (or Google Cloud Vision), Ollama, PDFKit, papaparse

---

## Task 1: Fix package.json and Clean Up Codebase

**Files:**
- Modify: `package.json:1-39`
- Delete: `.cursor/extensions/colony-os/` (outdated project files)
- Delete: `.cursor/extensions/zyeute-colony-bridge/` (outdated project files)
- Delete: `.cursor/extensions/supabase/` (outdated project files)
- Delete: `Xtrade/` (outdated folder)
- Modify: `app/page-with-logo.tsx` → redirect to main page

**Step 1: Update package.json**

```json
{
  "name": "receipts-checker",
  "version": "1.0.0",
  "description": "AI-powered receipt scanner for Quebec and North America - Bilingual French/English",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "test": "vitest run"
  }
}
```

**Step 2: Clean up project root**

Remove outdated folders that don't belong to this project.

**Step 3: Commit**

---

## Task 2: Set Up Project Structure

**Files:**
- Create: `types/receipt.ts`
- Create: `types/category.ts`
- Create: `lib/supabase.ts`
- Create: `lib/ollama.ts`
- Create: `components/ui/` (Button, Input, Card, etc.)

**Step 1: Create type definitions**

```typescript
// types/receipt.ts
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
```

**Step 2: Create Supabase client**

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)
```

**Step 3: Create Ollama client**

```typescript
// lib/ollama.ts
const OLLAMA_URL = process.env.NEXT_PUBLIC_OLLAMA_URL || 'http://localhost:11434'

export async function generateCompletion(prompt: string): Promise<string> {
  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.2',
      prompt,
      stream: false
    })
  })
  const data = await response.json()
  return data.response
}
```

**Step 4: Commit**

---

## Task 3: Build Receipt Upload Component with Camera

**Files:**
- Create: `components/ReceiptUpload.tsx`
- Create: `components/ui/FileUploader.tsx`

**Step 1: Create FileUploader component**

```tsx
'use client'
import { useCallback, useState } from 'react'
import { Upload, Camera, X, Image as ImageIcon } from 'lucide-react'

interface FileUploaderProps {
  onFileSelect: (file: File) => void
  accept?: string
  maxSize?: number
}

export function FileUploader({ onFileSelect, accept = 'image/*', maxSize = 10 * 1024 * 1024 }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file && file.size <= maxSize) {
      setPreview(URL.createObjectURL(file))
      onFileSelect(file)
    }
  }, [maxSize, onFileSelect])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.size <= maxSize) {
      setPreview(URL.createObjectURL(file))
      onFileSelect(file)
    }
  }, [maxSize, onFileSelect])

  return (
    <div className="border-2 border-dashed rounded-xl p-8 text-center">
      {/* Drop zone UI */}
    </div>
  )
}
```

**Step 2: Create ReceiptUpload with camera support**

```tsx
'use client'
import { useState, useRef } from 'react'
import { FileUploader } from './ui/FileUploader'

export function ReceiptUpload({ onUpload }: { onUpload: (file: File) => void }) {
  const [mode, setMode] = useState<'upload' | 'camera'>('upload')
  const videoRef = useRef<HTMLVideoElement>(null)

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    videoRef.current?.srcObject?.(stream)
  }

  return (
    <div className="space-y-4">
      {/* Mode toggle, camera, upload UI */}
    </div>
  )
}
```

**Step 3: Commit**

---

## Task 4: Set Up OCR Integration (Veryfi or Google Vision)

**Files:**
- Create: `lib/ocr.ts` (OCR abstraction)
- Create: `app/api/ocr/route.ts` (OCR API endpoint)
- Create: `.env.local.example`

**Step 1: Create OCR library**

```typescript
// lib/ocr.ts
export interface OCRResult {
  vendor: string
  date: string
  total: number
  tax: number
  currency: string
  lineItems: Array<{
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
}

export async function extractReceipt(imageBuffer: Buffer): Promise<OCRResult> {
  // Use Veryfi or Google Vision here
  // Return structured data
}
```

**Step 2: Create API route**

```typescript
// app/api/ocr/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { extractReceipt } from '@/lib/ocr'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const image = formData.get('image') as File

  const buffer = Buffer.from(await image.arrayBuffer())
  const result = await extractReceipt(buffer)

  return NextResponse.json(result)
}
```

**Step 3: Add .env.example**

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
VERYFI_CLIENT_ID=your_veryfi_client_id
VERYFI_CLIENT_SECRET=your_veryfi_client_secret
NEXT_PUBLIC_OLLAMA_URL=http://localhost:11434
```

**Step 4: Commit**

---

## Task 5: Create Receipts List Page

**Files:**
- Create: `app/page.tsx` (main dashboard)
- Create: `components/ReceiptList.tsx`
- Create: `components/ReceiptCard.tsx`

**Step 1: Create ReceiptCard component**

```tsx
// components/ReceiptCard.tsx
import { Receipt } from '@/types/receipt'

interface ReceiptCardProps {
  receipt: Receipt
  onClick: () => void
}

export function ReceiptCard({ receipt, onClick }: ReceiptCardProps) {
  return (
    <div onClick={onClick} className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{receipt.vendor}</h3>
          <p className="text-gray-500 text-sm">{new Date(receipt.date).toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <p className="font-bold">${receipt.total.toFixed(2)}</p>
          <p className="text-xs text-gray-500">{receipt.currency}</p>
        </div>
      </div>
      {/* Category badge */}
    </div>
  )
}
```

**Step 2: Create ReceiptList**

```tsx
// components/ReceiptList.tsx
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ReceiptCard } from './ReceiptCard'

export function ReceiptList() {
  const [receipts, setReceipts] = useState([])

  useEffect(() => {
    supabase.from('receipts').select('*').order('date', { ascending: false })
      .then(({ data }) => setReceipts(data || []))
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {receipts.map(receipt => (
        <ReceiptCard key={receipt.id} receipt={receipt} onClick={() => {}} />
      ))}
    </div>
  )
}
```

**Step 3: Update main page**

```tsx
// app/page.tsx
import { ReceiptList } from '@/components/ReceiptList'
import { ReceiptUpload } from '@/components/ReceiptUpload'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <ReceiptUpload onUpload={(file) => console.log(file)} />
      <ReceiptList />
    </main>
  )
}
```

**Step 4: Commit**

---

## Task 6: Create Receipt Detail View

**Files:**
- Create: `app/receipt/[id]/page.tsx`
- Create: `components/ReceiptDetail.tsx`

**Step 1: Create detail page**

```tsx
// app/receipt/[id]/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Receipt } from '@/types/receipt'

export default function ReceiptDetail({ params }: { params: { id: string } }) {
  const [receipt, setReceipt] = useState<Receipt | null>(null)

  useEffect(() => {
    supabase.from('receipts').select('*').eq('id', params.id).single()
      .then(({ data }) => setReceipt(data))
  }, [params.id])

  if (!receipt) return <div>Loading...</div>

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Editable receipt form */}
    </div>
  )
}
```

**Step 2: Commit**

---

## Task 7: Implement Duplicate Detection

**Files:**
- Modify: `lib/ocr.ts` (add hashing)
- Modify: `app/api/ocr/route.ts` (check duplicates)
- Create: `components/DuplicateWarning.tsx`

**Step 1: Add image hashing**

```typescript
// lib/ocr.ts
import crypto from 'crypto'

export async function hashImage(buffer: Buffer): Promise<string> {
  return crypto.createHash('sha256').update(buffer).digest('hex')
}

export async function checkDuplicate(hash: string): Promise<Receipt | null> {
  const { data } = await supabase
    .from('receipts')
    .select('*')
    .eq('imageHash', hash)
    .single()
  return data
}
```

**Step 2: Create DuplicateWarning component**

```tsx
// components/DuplicateWarning.tsx
export function DuplicateWarning({ existingReceipt, onContinue, onCancel }: any) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <h3 className="font-semibold text-yellow-800">Possible Duplicate</h3>
      <p className="text-sm text-yellow-700">
        This receipt may already exist from {existingReceipt.vendor} on {existingReceipt.date}
      </p>
      <div className="flex gap-2 mt-3">
        <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
        <button onClick={onContinue} className="px-4 py-2 bg-yellow-500 text-white rounded">Upload Anyway</button>
      </div>
    </div>
  )
}
```

**Step 3: Commit**

---

## Task 8: Integrate Ollama for AI Categorization

**Files:**
- Modify: `lib/ollama.ts`
- Create: `lib/categorizer.ts`
- Modify: `app/api/ocr/route.ts`

**Step 1: Create categorizer**

```typescript
// lib/categorizer.ts
import { generateCompletion } from './ollama'

const CATEGORIES = [
  { en: 'Food & Dining', fr: 'Alimentation', icon: '🍔' },
  { en: 'Transportation', fr: 'Transport', icon: '🚗' },
  { en: 'Office Supplies', fr: 'Fournitures de bureau', icon: '📎' },
  { en: 'Entertainment', fr: 'Divertissement', icon: '🎬' },
  { en: 'Utilities', fr: 'Services publics', icon: '💡' },
  { en: 'Healthcare', fr: 'Santé', icon: '🏥' },
  { en: 'Donations', fr: 'Dons', icon: '❤️' },
]

export async function categorizeReceipt(ocrResult: any, locale: 'en' | 'fr' = 'en'): Promise<string> {
  const prompt = `
Categorize this receipt. Return only the category name.

Vendor: ${ocrResult.vendor}
Items: ${ocrResult.lineItems?.map((i: any) => i.description).join(', ')}

Categories: ${CATEGORIES.map(c => c.en).join(', ')}
  `.trim()

  const result = await generateCompletion(prompt)
  return result.trim()
}
```

**Step 2: Update OCR route to include AI categorization**

**Step 3: Commit**

---

## Task 9: Add Quebec Tax Rules

**Files:**
- Create: `lib/quebec-tax.ts`
- Create: `components/QuebecBadge.tsx`
- Modify: `types/category.ts`

**Step 1: Create Quebec tax rules**

```typescript
// lib/quebec-tax.ts
export const QUEBEC_TAX_CATEGORIES = {
  RND: {
    en: 'R&D Expenses',
    fr: 'Dépenses de R&D',
    credit: 'Credit d\'impôt scientifique',
  },
  DONATION: {
    en: 'Charitable Donations',
    fr: 'Dons de bienfaisance',
    credit: 'Crédit d\'impôt pour dons',
  },
  MEDICAL: {
    en: 'Medical Expenses',
    fr: 'Frais médicaux',
    credit: 'Frais médicaux admissibles',
  },
  CHILDCARE: {
    en: 'Childcare',
    fr: 'Garderie',
    credit: 'Frais de garderie',
  },
}

export function checkQuebecEligibility(vendor: string, category: string): boolean {
  // Logic to determine if receipt qualifies for Quebec tax credit
  return QUEBEC_TAX_CATEGORIES[category as keyof typeof QUEBEC_TAX_CATEGORIES] !== undefined
}
```

**Step 2: Create QuebecBadge component**

**Step 3: Commit**

---

## Task 10: Add Bilingual Support (i18n)

**Files:**
- Create: `lib/i18n.ts`
- Create: `contexts/LanguageContext.tsx`
- Modify: All components to use translations

**Step 1: Create i18n system**

```typescript
// lib/i18n.ts
export const translations = {
  en: {
    upload: 'Upload Receipt',
    camera: 'Take Photo',
    vendor: 'Vendor',
    total: 'Total',
    date: 'Date',
    category: 'Category',
    search: 'Search receipts...',
    export: 'Export',
  },
  fr: {
    upload: 'Télécharger un reçu',
    camera: 'Prendre une photo',
    vendor: 'Fournisseur',
    total: 'Total',
    date: 'Date',
    category: 'Catégorie',
    search: 'Rechercher des reçus...',
    export: 'Exporter',
  },
} as const

export type Locale = 'en' | 'fr'
export type TranslationKey = keyof typeof translations.en
```

**Step 2: Create LanguageContext**

```tsx
// contexts/LanguageContext.tsx
'use client'
import { createContext, useContext, useState } from 'react'
import { Locale, translations } from '@/lib/i18n'

const LanguageContext = createContext<{
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: keyof typeof translations.en) => string
}>({} as any)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en')
  const t = (key: keyof typeof translations.en) => translations[locale][key]
  return <LanguageContext.Provider value={{ locale, setLocale, t }}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => useContext(LanguageContext)
```

**Step 3: Wrap app in LanguageProvider and update components**

**Step 4: Commit**

---

## Task 11: Build Export Functionality

**Files:**
- Create: `lib/export.ts`
- Create: `app/api/export/route.ts`
- Create: `components/ExportButton.tsx`

**Step 1: Create export library**

```typescript
// lib/export.ts
import { Receipt } from '@/types/receipt'
import Papa from 'papaparse'
import jsPDF from 'jspdf'

export function exportToCSV(receipts: Receipt[]): string {
  const data = receipts.map(r => ({
    Vendor: r.vendor,
    Date: r.date,
    Total: r.total,
    Tax: r.tax,
    Currency: r.currency,
    Category: r.category,
    'Quebec Eligible': r.quebecEligible ? 'Yes' : 'No',
  }))
  return Papa.unparse(data)
}

export function exportToPDF(receipts: Receipt[]): Blob {
  const doc = new jsPDF()
  doc.text('Receipts Report', 10, 10)
  receipts.forEach((r, i) => {
    doc.text(`${r.vendor} - $${r.total.toFixed(2)}`, 10, 20 + i * 10)
  })
  return doc.output('blob')
}
```

**Step 2: Create ExportButton component**

```tsx
// components/ExportButton.tsx
'use client'
import { useState } from 'react'
import { Download } from 'lucide-react'

export function ExportButton({ receipts }: { receipts: Receipt[] }) {
  const [format, setFormat] = useState<'csv' | 'pdf'>('csv')

  const handleExport = () => {
    if (format === 'csv') {
      const csv = exportToCSV(receipts)
      // Download logic
    } else {
      const pdf = exportToPDF(receipts)
      // Download logic
    }
  }

  return (
    <div className="flex gap-2">
      <select value={format} onChange={(e) => setFormat(e.target.value as any)}>
        <option value="csv">CSV</option>
        <option value="pdf">PDF</option>
      </select>
      <button onClick={handleExport} className="flex items-center gap-2">
        <Download size={16} /> Export
      </button>
    </div>
  )
}
```

**Step 3: Commit**

---

## Task 12: Set Up Supabase Database Schema

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`
- Create: `supabase/seed/categories.sql`

**Step 1: Create migration**

```sql
-- supabase/migrations/001_initial_schema.sql
CREATE TABLE receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  image_url TEXT,
  vendor TEXT NOT NULL,
  date DATE NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'CAD',
  category TEXT,
  line_items JSONB DEFAULT '[]',
  image_hash TEXT UNIQUE,
  is_duplicate BOOLEAN DEFAULT FALSE,
  linked_receipt_id UUID REFERENCES receipts(id),
  quebec_eligible BOOLEAN DEFAULT FALSE,
  quebec_category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_fr TEXT NOT NULL,
  quebec_tax_credit TEXT,
  icon TEXT
);

-- Enable RLS
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own receipts" ON receipts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own receipts" ON receipts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own receipts" ON receipts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own receipts" ON receipts FOR DELETE USING (auth.uid() = user_id);
```

**Step 2: Commit**

---

## Task 13: Build Dashboard with AI Chat

**Files:**
- Modify: `components/AIAgent.tsx` (existing - adapt for receipt context)
- Create: `components/Dashboard.tsx`
- Create: `components/SpendingChart.tsx`

**Step 1: Adapt AI Agent for receipts**

```tsx
// Update AIAgent to understand receipt context
const RECEIPT_CONTEXT = `
You are a helpful assistant for a receipt tracking app.
You can help users:
- Understand their spending patterns
- Find receipts
- Get tax deduction tips (especially for Quebec)
- Explain categories

Current user receipts: {recentReceiptsSummary}
```

**Step 2: Create Dashboard with spending overview**

**Step 3: Commit**

---

## Plan Complete!

**Next Steps:**
1. Start implementing Task 1 (fix package.json)
2. Work through each task sequentially
3. Test after each task
4. Commit frequently

**Estimated completion:** 8-12 hours for full implementation
