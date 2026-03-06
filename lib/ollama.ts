// Ollama client for local AI
const OLLAMA_URL = process.env.NEXT_PUBLIC_OLLAMA_URL || 'http://localhost:11434'

export interface OllamaResponse {
  model: string
  response: string
  done: boolean
}

export async function generateCompletion(
  prompt: string,
  model: string = 'llama3.2'
): Promise<string> {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.statusText}`)
    }

    const data: OllamaResponse = await response.json()
    return data.response
  } catch (error) {
    console.error('Ollama error:', error)
    throw error
  }
}

export async function chatCompletion(
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  model: string = 'llama3.2'
): Promise<string> {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.message?.content || ''
  } catch (error) {
    console.error('Ollama chat error:', error)
    throw error
  }
}

export function isOllamaAvailable(): Promise<boolean> {
  return fetch(`${OLLAMA_URL}/api/tags`, { method: 'GET' })
    .then(res => res.ok)
    .catch(() => false)
}
