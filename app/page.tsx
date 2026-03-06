'use client'

import { useState } from 'react'
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext'
import { ReceiptUpload } from '@/components/ReceiptUpload'
import { ReceiptList } from '@/components/ReceiptList'
import { AIChat } from '@/components/AIChat'
import { Receipt } from '@/types/receipt'
import { AIChat } from '@/components/AIChat'
import { Upload, FileText, BarChart3, Settings, Globe, Plus, X } from 'lucide-react'
import { exportToCSV, exportToPDF, downloadBlob } from '@/lib/export'

function Dashboard() {
  const { t, locale, setLocale } = useLanguage()
  const [activeTab, setActiveTab] = useState<'receipts' | 'upload' | 'dashboard'>('receipts')
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null)

  const handleUpload = async (file: File) => {
    console.log('Uploading file:', file.name)
    // TODO: Implement actual upload to Supabase + OCR
    alert('Upload functionality - configure Supabase and OCR to use')
  }

  const handleExport = (receipts: Receipt[]) => {
    if (receipts.length === 0) return

    const csv = exportToCSV(receipts, locale)
    const blob = new Blob([csv], { type: 'text/csv' })
    downloadBlob(blob, `receipts-${new Date().toISOString().split('T')[0]}.csv`)
  }

  const tabs = [
    { id: 'receipts', label: t('receipts'), icon: FileText },
    { id: 'upload', label: t('upload'), icon: Upload },
    { id: 'dashboard', label: t('dashboard'), icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            🧾 Receipts Checker
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocale(locale === 'en' ? 'fr' : 'en')}
              className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700 transition"
            >
              <Globe className="w-4 h-4" />
              {locale === 'en' ? 'FR' : 'EN'}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-black/10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition border-b-2 ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'upload' && (
          <div className="max-w-xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">{t('uploadReceipt')}</h2>
              <ReceiptUpload onUpload={handleUpload} />
            </div>
          </div>
        )}

        {activeTab === 'receipts' && (
          <ReceiptList
            onSelectReceipt={setSelectedReceipt}
            onEditReceipt={setSelectedReceipt}
            onDeleteReceipt={(id) => console.log('Delete:', id)}
            onExport={handleExport}
          />
        )}

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700">
              <h3 className="text-gray-400 text-sm mb-2">{t('total')}</h3>
              <p className="text-3xl font-bold text-white">$0.00</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700">
              <h3 className="text-gray-400 text-sm mb-2">{t('receipts')}</h3>
              <p className="text-3xl font-bold text-white">0</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700">
              <h3 className="text-gray-400 text-sm mb-2">{t('quebecEligible')}</h3>
              <p className="text-3xl font-bold text-green-400">$0.00</p>
            </div>
          </div>
        )}
      </main>

      {/* Receipt Detail Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700 flex justify-between items-start">
              <h2 className="text-xl font-semibold text-white">{selectedReceipt.vendor}</h2>
              <button onClick={() => setSelectedReceipt(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm">{t('date')}</label>
                  <p className="text-white">{new Date(selectedReceipt.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">{t('category')}</label>
                  <p className="text-white">{selectedReceipt.category || t('other')}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">{t('total')}</label>
                  <p className="text-white font-bold">${selectedReceipt.total.toFixed(2)}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">{t('tax')}</label>
                  <p className="text-white">${selectedReceipt.tax.toFixed(2)}</p>
                </div>
              </div>
              {selectedReceipt.quebecEligible && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                  <p className="text-green-400 font-medium">✓ {t('quebecEligible')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Home() {
  return (
    <LanguageProvider>
      <Dashboard />
      <AIChat receipts={[]} />
    </LanguageProvider>
  )
}
