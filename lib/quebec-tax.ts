// Quebec Tax Categories and Rules
// Reference: Revenu Québec tax credits

export const QUEBEC_TAX_CATEGORIES = {
  RND: {
    key: 'RND',
    en: 'R&D Expenses',
    fr: 'Dépenses de R&D',
    credit: 'Credit d\'impôt scientifique',
    creditEn: 'Scientific Research Tax Credit',
  },
  DONATION: {
    key: 'DONATION',
    en: 'Charitable Donations',
    fr: 'Dons de bienfaisance',
    credit: 'Crédit d\'impôt pour dons',
    creditEn: 'Charitable Donations Tax Credit',
  },
  MEDICAL: {
    key: 'MEDICAL',
    en: 'Medical Expenses',
    fr: 'Frais médicaux',
    credit: 'Frais médicaux admissibles',
    creditEn: 'Medical Expense Tax Credit',
  },
  CHILDCARE: {
    key: 'CHILDCARE',
    en: 'Childcare',
    fr: 'Garderie',
    credit: 'Frais de garderie',
    creditEn: 'Childcare Expense Deduction',
  },
  FITNESS: {
    key: 'FITNESS',
    en: 'Children\'s Fitness',
    fr: 'Activités physiques pour enfants',
    credit: 'Crédit d\'impôt pour activités physiques',
    creditEn: 'Children\'s Fitness Tax Credit',
  },
  ARTS: {
    key: 'ARTS',
    en: 'Arts & Culture',
    fr: 'Arts et culture',
    credit: 'Crédit d\'impôt pour dons culturels',
    creditEn: 'Cultural Donations Tax Credit',
  },
} as const

export type QuebecCategoryKey = keyof typeof QUEBEC_TAX_CATEGORIES

// Categories that can qualify for Quebec tax credits
export const QUEBEC_ELIGIBLE_VENDORS: Record<string, QuebecCategoryKey> = {
  // Medical
  'pharmacy': 'MEDICAL',
  'pharmacie': 'MEDICAL',
  'hospital': 'MEDICAL',
  'clinique': 'MEDICAL',
  'medical': 'MEDICAL',
  'santé': 'MEDICAL',
  'doctor': 'MEDICAL',
  'médecin': 'MEDICAL',
  'dentist': 'MEDICAL',
  'dentiste': 'MEDICAL',
  'optometrist': 'MEDICAL',
  'optométriste': 'MEDICAL',

  // Childcare
  'garderie': 'CHILDCARE',
  'daycare': 'CHILDCARE',
  ' CPE ': 'CHILDCARE',
  'camp': 'CHILDCARE',
  'camp de jour': 'CHILDCARE',

  // Donations
  'foundation': 'DONATION',
  'fondation': 'DONATION',
  'charity': 'DONATION',
  'bienfaisance': 'DONATION',
  'church': 'DONATION',
  'eglise': 'DONATION',
  'paroisse': 'DONATION',
  'museum': 'ARTS',
  'musée': 'ARTS',

  // Fitness
  'fitness': 'FITNESS',
  'gym': 'FITNESS',
  'sport': 'FITNESS',
  'natation': 'FITNESS',
  'swimming': 'FITNESS',
  'soccer': 'FITNESS',
  'hockey': 'FITNESS',
  'danse': 'FITNESS',
  'dance': 'FITNESS',
}

export function checkQuebecEligibility(vendor: string, category: string): { eligible: boolean; category?: QuebecCategoryKey } {
  const vendorLower = vendor.toLowerCase()

  // Check vendor name for keywords
  for (const [keyword, qcCategory] of Object.entries(QUEBEC_ELIGIBLE_VENDORS)) {
    if (vendorLower.includes(keyword)) {
      return { eligible: true, category: qcCategory }
    }
  }

  // Check if category maps to Quebec
  const categoryLower = category.toLowerCase()
  if (categoryLower.includes('health') || categoryLower.includes('santé') || categoryLower.includes('medical')) {
    return { eligible: true, category: 'MEDICAL' }
  }
  if (categoryLower.includes('donation') || categoryLower.includes('don')) {
    return { eligible: true, category: 'DONATION' }
  }
  if (categoryLower.includes('child') || categoryLower.includes('enfant') || categoryLower.includes('garderie')) {
    return { eligible: true, category: 'CHILDCARE' }
  }

  return { eligible: false }
}

export function getQuebecTaxInfo(categoryKey: QuebecCategoryKey, locale: 'en' | 'fr') {
  const category = QUEBEC_TAX_CATEGORIES[categoryKey]
  if (!category) return null

  return {
    category: locale === 'fr' ? category.fr : category.en,
    credit: locale === 'fr' ? category.credit : category.creditEn,
  }
}
