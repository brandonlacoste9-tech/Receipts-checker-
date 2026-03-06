import { Category } from '@/types/receipt'

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', nameEn: 'Food & Dining', nameFr: 'Alimentation', icon: '🍔' },
  { id: '2', nameEn: 'Transportation', nameFr: 'Transport', icon: '🚗' },
  { id: '3', nameEn: 'Office Supplies', nameFr: 'Fournitures de bureau', icon: '📎' },
  { id: '4', nameEn: 'Entertainment', nameFr: 'Divertissement', icon: '🎬' },
  { id: '5', nameEn: 'Utilities', nameFr: 'Services publics', icon: '💡' },
  { id: '6', nameEn: 'Healthcare', nameFr: 'Santé', icon: '🏥' },
  { id: '7', nameEn: 'Donations', nameFr: 'Dons', icon: '❤️' },
  { id: '8', nameEn: 'Shopping', nameFr: 'Achats', icon: '🛍️' },
  { id: '9', nameEn: 'Travel', nameFr: 'Voyage', icon: '✈️' },
  { id: '10', nameEn: 'Education', nameFr: 'Éducation', icon: '📚' },
  { id: '11', nameEn: 'Home & Garden', nameFr: 'Maison et jardin', icon: '🏠' },
  { id: '12', nameEn: 'Other', nameFr: 'Autre', icon: '📦' },
]

export const getCategoryById = (id: string): Category | undefined => {
  return DEFAULT_CATEGORIES.find(cat => cat.id === id)
}

export const getCategoryByName = (name: string): Category | undefined => {
  return DEFAULT_CATEGORIES.find(cat =>
    cat.nameEn.toLowerCase() === name.toLowerCase() ||
    cat.nameFr.toLowerCase() === name.toLowerCase()
  )
}
