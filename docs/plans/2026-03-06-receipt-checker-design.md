# Receipt Checker - Product Design

**Date:** 2026-03-06
**Version:** 1.0

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Receipt Checker App                       │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐│
│  │   Mobile     │  │   Web App    │  │   Browser Ext   ││
│  │  (PWA)       │  │  (Next.js)   │  │   (Chrome)      ││
│  └──────────────┘  └──────────────┘  └──────────────────┘│
├─────────────────────────────────────────────────────────────┤
│                      API Layer (Next.js)                     │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────┐ │
│  │  Upload    │ │   OCR      │ │    AI      │ │ Export │ │
│  │  Handler   │ │  (Veryfi)  │ │  (Ollama)  │ │  CSV/  │ │
│  │            │ │  or Google │ │  Local     │ │  PDF   │ │
│  └────────────┘ └────────────┘ └────────────┘ └────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    Storage (Supabase)                        │
│  ┌────────────┐ ┌────────────┐ ┌──────────────────────┐  │
│  │  Receipts  │ │ Categories │ │  Quebec Tax Rules   │  │
│  │  Table     │ │  Table     │ │  & Credits Config    │  │
│  └────────────┘ └────────────┘ └──────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 2. Core Features

| Feature | Description | Priority |
|---------|-------------|----------|
| **Receipt Upload** | Camera capture, file upload, drag-and-drop | P0 |
| **OCR Extraction** | Vendor, date, total, tax, line items | P0 |
| **AI Categorization** | Auto-categorize: Food, Transport, Office, etc. | P0 |
| **Duplicate Detection** | Hash-based detection of duplicate receipts | P0 |
| **Quebec Tax Rules** | Identify Quebec tax credits, R&D, donations | P1 |
| **Bilingual UI** | French/English toggle, French receipt OCR | P1 |
| **Export** | CSV, PDF, QuickBooks, Xero integration | P1 |
| **AI Chat** | Ask questions about spending, get insights (Ollama) | P1 |
| **Search** | Search by vendor, date, amount, category | P2 |
| **Reports** | Monthly/yearly spending reports, charts | P2 |

## 3. Data Model

### Receipt
```typescript
{
  id: string
  userId: string
  imageUrl: string
  vendor: string
  date: Date
  total: number
  tax: number
  currency: string (CAD/USD)
  category: string
  lineItems: LineItem[]
  imageHash: string  // for duplicate detection
  isDuplicate: boolean
  linkedReceiptId?: string  // if duplicate
  quebecEligible: boolean  // for tax credits
  quebecCategory?: string  // specific to QC
  createdAt: Date
  updatedAt: Date
}
```

### Category
```typescript
{
  id: string
  nameEn: string
  nameFr: string
  quebecTaxCredit?: string  // e.g., "R&D", "Donation"
  icon: string
}
```

## 4. UI/UX Design

### Key Pages
1. **Dashboard** - Recent receipts, spending summary, AI insights
2. **Upload** - Camera/file upload with OCR processing
3. **Receipts List** - Searchable, filterable list with bulk actions
4. **Receipt Detail** - View/edit extracted data, categorize
5. **Reports** - Charts, export options, Quebec tax summary
6. **Settings** - Language toggle, export integrations, account

### Bilingual Approach
- All UI text in both French and English
- User can toggle language (default: detect browser)
- Quebec-specific categories only show for French locale

## 5. Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (React), Tailwind CSS |
| Mobile | PWA (Progressive Web App) |
| OCR | Veryfi API OR Google Cloud Vision |
| AI | Ollama (local Llama/Mistral) |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage (receipt images) |
| Auth | Supabase Auth |
| Export | PDFKit (PDF), papaparse (CSV) |

## 6. Unique Differentiators

- 🤖 **AI Layer** - Ollama-powered local AI for spending insights
- 🇨🇦 **Quebec** - Tax credit detection, Revenu Québec-friendly
- ⚡ **Speed** - Fast uploads, instant OCR preview
- 🔒 **Privacy** - Self-host option, user owns data, local AI
