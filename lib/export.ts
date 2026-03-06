import { Receipt } from '@/types/receipt'
import Papa from 'papaparse'
import { jsPDF } from 'jspdf'

export function exportToCSV(receipts: Receipt[], locale: 'en' | 'fr' = 'en'): string {
  const data = receipts.map(r => ({
    [locale === 'fr' ? 'Fournisseur' : 'Vendor']: r.vendor,
    [locale === 'fr' ? 'Date' : 'Date']: r.date,
    [locale === 'fr' ? 'Total' : 'Total']: r.total,
    [locale === 'fr' ? 'Taxe' : 'Tax']: r.tax,
    [locale === 'fr' ? 'Devise' : 'Currency']: r.currency,
    [locale === 'fr' ? 'Catégorie' : 'Category']: r.category,
    [locale === 'fr' ? 'Admissible QC' : 'Quebec Eligible']: r.quebecEligible ? (locale === 'fr' ? 'Oui' : 'Yes') : (locale === 'fr' ? 'Non' : 'No'),
    [locale === 'fr' ? 'Créé le' : 'Created']: r.createdAt,
  }))

  return Papa.unparse(data)
}

export function exportToPDF(receipts: Receipt[], locale: 'en' | 'fr' = 'en'): Blob {
  const doc = new jsPDF()

  // Title
  doc.setFontSize(18)
  doc.text(locale === 'fr' ? 'Rapport des reçus' : 'Receipts Report', 14, 22)

  // Date
  doc.setFontSize(10)
  doc.text(`${new Date().toLocaleDateString(locale === 'fr' ? 'fr-CA' : 'en-CA')}`, 14, 30)

  // Summary
  const totalAmount = receipts.reduce((sum, r) => sum + r.total, 0)
  const totalTax = receipts.reduce((sum, r) => sum + r.tax, 0)
  doc.text(
    locale === 'fr'
      ? `Total: ${totalAmount.toFixed(2)} $ (Taxe: ${totalTax.toFixed(2)} $)`
      : `Total: $${totalAmount.toFixed(2)} (Tax: $${totalTax.toFixed(2)})`,
    14, 38
  )

  // Table header
  let y = 50
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text(locale === 'fr' ? 'Fournisseur' : 'Vendor', 14, y)
  doc.text(locale === 'fr' ? 'Date' : 'Date', 70, y)
  doc.text(locale === 'fr' ? 'Total' : 'Total', 110, y)
  doc.text(locale === 'fr' ? 'Catégorie' : 'Category', 150, y)

  // Table rows
  doc.setFont('helvetica', 'normal')
  receipts.slice(0, 25).forEach((r, i) => {
    y += 8
    if (y > 280) {
      doc.addPage()
      y = 20
    }
    doc.text(r.vendor.substring(0, 25), 14, y)
    doc.text(r.date, 70, y)
    doc.text(r.total.toFixed(2), 110, y)
    doc.text(r.category.substring(0, 20), 150, y)
  })

  return doc.output('blob')
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
