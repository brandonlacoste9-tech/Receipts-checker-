'use client'

import { useState, useEffect } from 'react'
import { Receipt } from '@/types/receipt'
import { useLanguage } from '@/contexts/LanguageContext'
import { Search, Filter, Download, Trash2, Edit, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReceiptListProps {
  onSelectReceipt: (receipt: Receipt) => void
  onEditReceipt: (receipt: Receipt) => void
  onDeleteReceipt: (id: string) => void
  onExport: (receipts: Receipt[]) => void
}

export function ReceiptList({ onSelectReceipt, onEditReceipt, onDeleteReceipt, onExport }: ReceiptListProps) {
  const { t, locale } = useLanguage()
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 20

  useEffect(() => {
    fetchReceipts()
  }, [page, search, category])

  const fetchReceipts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String((page - 1) * limit),
      })
      if (search) params.set('search', search)
      if (category) params.set('category', category)

      const res = await fetch(`/api/receipts?${params}`)
      const data = await res.json()

      if (data.success) {
        setReceipts(data.data)
        setTotal(data.data.length)
      }
    } catch (err) {
      console.error('Error fetching receipts:', err)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { value: '', label: locale === 'fr' ? 'Toutes les catégories' : 'All Categories' },
    { value: 'food', label: locale === 'fr' ? 'Alimentation' : 'Food & Dining' },
    { value: 'transport', label: locale === 'fr' ? 'Transport' : 'Transportation' },
    { value: 'office', label: locale === 'fr' ? 'Fournitures de bureau' : 'Office Supplies' },
    { value: 'entertainment', label: locale === 'fr' ? 'Divertissement' : 'Entertainment' },
    { value: 'utilities', label: locale === 'fr' ? 'Services publics' : 'Utilities' },
    { value: 'healthcare', label: locale === 'fr' ? 'Santé' : 'Healthcare' },
    { value: 'donations', label: locale === 'fr' ? 'Dons' : 'Donations' },
    { value: 'shopping', label: locale === 'fr' ? 'Achats' : 'Shopping' },
    { value: 'travel', label: locale === 'fr' ? 'Voyage' : 'Travel' },
    { value: 'other', label: locale === 'fr' ? 'Autre' : 'Other' },
  ]

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('search')}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
        <button
          onClick={() => onExport(receipts)}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-xl text-white flex items-center gap-2 transition"
        >
          <Download className="w-4 h-4" />
          {t('export')}
        </button>
      </div>

      {/* Receipts Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : receipts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-2">{t('noReceipts')}</p>
          <p className="text-gray-500 text-sm">{t('uploadFirst')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {receipts.map(receipt => (
            <div
              key={receipt.id}
              className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-purple-500/50 transition cursor-pointer group"
              onClick={() => onSelectReceipt(receipt)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{receipt.vendor || 'Unknown'}</h3>
                  <p className="text-gray-400 text-sm">{new Date(receipt.date).toLocaleDateString(locale === 'fr' ? 'fr-CA' : 'en-CA')}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">${receipt.total.toFixed(2)}</p>
                  <p className="text-gray-500 text-xs">{receipt.currency}</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className={cn(
                  "px-2 py-1 text-xs rounded-full",
                  receipt.quebecEligible
                    ? "bg-green-500/20 text-green-400"
                    : "bg-gray-700 text-gray-400"
                )}>
                  {receipt.category || t('other')}
                </span>

                {receipt.isDuplicate && (
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400">
                    {t('duplicate')}
                  </span>
                )}

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={(e) => { e.stopPropagation(); onEditReceipt(receipt); }}
                    className="p-1.5 hover:bg-gray-700 rounded-lg transition"
                  >
                    <Edit className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteReceipt(receipt.id); }}
                    className="p-1.5 hover:bg-red-500/20 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {receipts.length > 0 && (
        <div className="flex justify-center items-center gap-4 pt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <span className="text-gray-400">Page {page}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={receipts.length < limit}
            className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      )}
    </div>
  )
}
