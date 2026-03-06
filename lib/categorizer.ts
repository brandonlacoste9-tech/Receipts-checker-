import { generateCompletion } from './ollama'
import { DEFAULT_CATEGORIES } from './categories'

const CATEGORIES_EN = DEFAULT_CATEGORIES.map(c => c.nameEn).join(', ')
const CATEGORIES_FR = DEFAULT_CATEGORIES.map(c => c.nameFr).join(', ')

export async function categorizeWithAI(
  ocrResult: { vendor: string; lineItems: { description: string }[] },
  locale: 'en' | 'fr' = 'en'
): Promise<{ category: string; confidence: number }> {
  const categories = locale === 'fr' ? CATEGORIES_FR : CATEGORIES_EN

  const prompt = `
You are a receipt categorizer. Given the vendor name and line items from a receipt, categorize it into exactly ONE category.

Available categories: ${categories}

Respond with ONLY the category name, nothing else.

Vendor: ${ocrResult.vendor}
Line items: ${ocrResult.lineItems?.map((i: any) => i.description).join(', ') || 'N/A'}
`.trim()

  try {
    const result = await generateCompletion(prompt)
    const category = result.trim()

    // Validate category exists
    const validCategory = DEFAULT_CATEGORIES.find(
      c => c.nameEn.toLowerCase() === category.toLowerCase() ||
           c.nameFr.toLowerCase() === category.toLowerCase()
    )

    return {
      category: validCategory?.nameEn || 'Other',
      confidence: 0.8,
    }
  } catch (error) {
    console.error('AI categorization failed:', error)
    return {
      category: 'Other',
      confidence: 0,
    }
  }
}

export async function getSpendingInsights(
  receipts: { vendor: string; total: number; category: string; date: string }[],
  locale: 'en' | 'fr' = 'en'
): Promise<string> {
  const total = receipts.reduce((sum, r) => sum + r.total, 0)
  const byCategory: Record<string, number> = {}
  const byVendor: Record<string, number> = {}

  receipts.forEach(r => {
    byCategory[r.category] = (byCategory[r.category] || 0) + r.total
    byVendor[r.vendor] = (byVendor[r.vendor] || 0) + r.total
  })

  const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]
  const topVendor = Object.entries(byVendor).sort((a, b) => b[1] - a[1])[0]

  const prompt = locale === 'fr' ? `
Tu es un assistant financier. Analyse ces reçus et donne des insights brefs en français.

Total dépensé: ${total.toFixed(2)} $
Catégorie principale: ${topCategory?.[0] || 'N/A'} (${topCategory?.[1]?.toFixed(2) || 0} $)
Fournisseur principal: ${topVendor?.[0] || 'N/A'} (${topVendor?.[1]?.toFixed(2) || 0} $)

Donne 2-3 insights brefs sur les habitudes de dépenses.
` : `
You are a financial assistant. Analyze these receipts and give brief insights.

Total spent: $${total.toFixed(2)}
Top category: ${topCategory?.[0] || 'N/A'} ($${topCategory?.[1]?.toFixed(2) || 0})
Top vendor: ${topVendor?.[0] || 'N/A'} ($${topVendor?.[1]?.toFixed(2) || 0})

Give 2-3 brief insights about spending habits.
`.trim()

  try {
    return await generateCompletion(prompt)
  } catch (error) {
    console.error('AI insights failed:', error)
    return locale === 'fr'
      ? 'Analyse non disponible pour le moment.'
      : 'Analysis not available at this time.'
  }
}

export async function askAboutReceipts(
  question: string,
  receipts: { vendor: string; total: number; category: string; date: string }[],
  locale: 'en' | 'fr' = 'en'
): Promise<string> {
  const receiptsSummary = receipts
    .slice(0, 10)
    .map(r => `- ${r.date}: ${r.vendor} - $${r.total.toFixed(2)} (${r.category})`)
    .join('\n')

  const systemPrompt = locale === 'fr' ? `
Tu es un assistant helpful pour une application de reçus.
Tu peux répondre aux questions sur les reçus de l'utilisateur.
Sois bref et utile.
Voici les récents reçus de l'utilisateur:
${receiptsSummary}
` : `
You are a helpful assistant for a receipt tracking app.
You can answer questions about the user's receipts.
Be brief and helpful.
Here are the user's recent receipts:
${receiptsSummary}
`.trim()

  try {
    const result = await chatCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: question },
    ])
    return result
  } catch (error) {
    console.error('AI chat failed:', error)
    return locale === 'fr'
      ? 'Désolé, je ne peux pas répondre pour le moment.'
      : 'Sorry, I cannot answer at this time.'
  }
}
