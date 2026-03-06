export interface Category {
  id: string
  nameEn: string
  nameFr: string
  quebecTaxCredit?: string
  icon: string
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', nameEn: 'Food & Dining', nameFr: 'Alimentation', icon: '🍔' },
  { id: '2', nameEn: 'Transportation', nameFr: 'Transport', icon: '🚗' },
  { id: '3', nameEn: 'Office Supplies', nameFr: 'Fournitures de bureau', icon: '📎' },
  { id: '4', nameEn: 'Entertainment', nameFr: 'Divertissement', icon: '🎬' },
  { id: '5', nameEn: 'Utilities', nameFr: 'Services publics', icon: '💡' },
  { id: '6', nameEn: 'Healthcare', nameFr: 'Santé', icon: '🏥' },
  { id: '7', nameEn: 'Donations', nameFr: 'Dons', icon: '❤️' },
  { id: '8', nameEn: 'Shopping', nameFr: 'Achats', icon: '🛒' },
  { id: '9', nameEn: 'Travel', nameFr: 'Voyage', icon: '✈️' },
  { id: '10', nameEn: 'Other', nameFr: 'Autre', icon: '📦' },
]

// Quebec-specific tax categories
export const QUEBEC_TAX_CATEGORIES = {
  RND: {
    id: 'qc-rnd',
    nameEn: 'R&D Expenses',
    nameFr: 'Dépenses de R&D',
    quebecTaxCredit: 'Credit d\'impôt scientifique',
    icon: '🔬'
  },
  DONATION: {
    id: 'qc-donation',
    nameEn: 'Charitable Donations',
    nameFr: 'Dons de bienfaisance',
    quebecTaxCredit: 'Crédit d\'impôt pour dons',
    icon: '❤️'
  },
  MEDICAL: {
    id: 'qc-medical',
    nameEn: 'Medical Expenses',
    nameFr: 'Frais médicaux',
    quebecTaxCredit: 'Frais médicaux admissibles',
    icon: '🏥'
  },
  CHILDCARE: {
    id: 'qc-childcare',
    nameEn: 'Childcare',
    nameFr: 'Garderie',
    quebecTaxCredit: 'Frais de garderie',
    icon: '👶'
  },
  FITNESS: {
    id: 'qc-fitness',
    nameEn: 'Fitness & Sports',
    nameFr: 'Fitness et sports',
    quebecTaxCredit: 'Crédit d\'impôt pour sports',
    icon: '💪'
  },
} as const
