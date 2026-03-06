'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Locale, translations } from '@/lib/i18n'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: keyof typeof translations.en) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en')

  useEffect(() => {
    const saved = localStorage.getItem('receipts-locale') as Locale
    if (saved && (saved === 'en' || saved === 'fr')) {
      setLocale(saved)
    } else {
      const browserLang = navigator.language.toLowerCase()
      if (browserLang.startsWith('fr')) {
        setLocale('fr')
      }
    }
  }, [])

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    localStorage.setItem('receipts-locale', newLocale)
  }

  const t = (key: keyof typeof translations.en): string => {
    return translations[locale][key] || translations.en[key] || key
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
