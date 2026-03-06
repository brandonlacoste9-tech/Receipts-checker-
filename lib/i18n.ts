export const translations = {
  en: {
    // Navigation
    home: 'Home',
    receipts: 'Receipts',
    upload: 'Upload',
    dashboard: 'Dashboard',
    settings: 'Settings',

    // Upload
    uploadReceipt: 'Upload Receipt',
    takePhoto: 'Take Photo',
    dragDrop: 'Drag & drop receipt here',
    orBrowse: 'or browse files',
    supportedFormats: 'Supports JPG, PNG, PDF up to 10MB',

    // Receipt
    vendor: 'Vendor',
    date: 'Date',
    total: 'Total',
    tax: 'Tax',
    category: 'Category',
    lineItems: 'Line Items',
    quantity: 'Qty',
    unitPrice: 'Unit Price',
    description: 'Description',

    // Categories
    foodDining: 'Food & Dining',
    transportation: 'Transportation',
    officeSupplies: 'Office Supplies',
    entertainment: 'Entertainment',
    utilities: 'Utilities',
    healthcare: 'Healthcare',
    donations: 'Donations',
    other: 'Other',

    // Actions
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    export: 'Export',
    search: 'Search receipts...',

    // Status
    processing: 'Processing...',
    completed: 'Completed',
    failed: 'Failed',
    duplicate: 'Duplicate Detected',

    // Quebec
    quebecEligible: 'Quebec Tax Eligible',
    quebecTaxCredit: 'Tax Credit',

    // Export
    exportCSV: 'Export to CSV',
    exportPDF: 'Export to PDF',

    // Messages
    noReceipts: 'No receipts yet',
    uploadFirst: 'Upload your first receipt to get started',
    duplicateWarning: 'This receipt may already exist',
    uploadAnyway: 'Upload Anyway',
  },
  fr: {
    // Navigation
    home: 'Accueil',
    receipts: 'Reçus',
    upload: 'Télécharger',
    dashboard: 'Tableau de bord',
    settings: 'Paramètres',

    // Upload
    uploadReceipt: 'Télécharger un reçu',
    takePhoto: 'Prendre une photo',
    dragDrop: 'Glissez le reçu ici',
    orBrowse: 'ou parcourir les fichiers',
    supportedFormats: 'Supporte JPG, PNG, PDF jusqu\'à 10Mo',

    // Receipt
    vendor: 'Fournisseur',
    date: 'Date',
    total: 'Total',
    tax: 'Taxe',
    category: 'Catégorie',
    lineItems: 'Articles',
    quantity: 'Qté',
    unitPrice: 'Prix unitaire',
    description: 'Description',

    // Categories
    foodDining: 'Alimentation',
    transportation: 'Transport',
    officeSupplies: 'Fournitures de bureau',
    entertainment: 'Divertissement',
    utilities: 'Services publics',
    healthcare: 'Santé',
    donations: 'Dons',
    other: 'Autre',

    // Actions
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    export: 'Exporter',
    search: 'Rechercher des reçus...',

    // Status
    processing: 'Traitement...',
    completed: 'Terminé',
    failed: 'Échoué',
    duplicate: 'Doublon détecté',

    // Quebec
    quebecEligible: 'Admissible au crédit d\'impôt QC',
    quebecTaxCredit: 'Crédit d\'impôt',

    // Export
    exportCSV: 'Exporter en CSV',
    exportPDF: 'Exporter en PDF',

    // Messages
    noReceipts: 'Aucun reçu',
    uploadFirst: 'Téléchargez votre premier reçu pour commencer',
    duplicateWarning: 'Ce reçu pourrait déjà exister',
    uploadAnyway: 'Télécharger quand même',
  },
} as const

export type Locale = 'en' | 'fr'
export type TranslationKey = keyof typeof translations.en
