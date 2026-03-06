'use client'

import { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, X, Loader2 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Receipt } from '@/types/receipt'
import { askAboutReceipts, isOllamaAvailable } from '@/lib/ollama'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AIChatProps {
  receipts: Receipt[]
}

export function AIChat({ receipts }: AIChatProps) {
  const { t, locale } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [ollamaAvailable, setOllamaAvailable] = useState<boolean | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ollamaAvailable === null) {
      isOllamaAvailable().then(setOllamaAvailable)
    }
  }, [ollamaAvailable])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const reply = await askAboutReceipts(input, receipts, locale)

      const assistantMessage: Message = {
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: locale === 'fr'
          ? 'Désolé, une erreur est survenue. Assurez-vous qu\'Ollama est en cours d\'exécution.'
          : 'Sorry, an error occurred. Make sure Ollama is running.',
        timestamp: new Date(),
      }])
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 text-white rounded-full p-4 shadow-2xl hover:scale-110 transition-all"
      >
        <Sparkles className="w-7 h-7" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-[380px] h-[520px] bg-gray-900/95 backdrop-blur-2xl rounded-3xl border border-purple-500/30 shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="p-4 border-b border-purple-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-2">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">AI Assistant</h3>
              <p className="text-xs text-gray-400">
                {ollamaAvailable
                  ? locale === 'fr' ? 'Ollama Connecté' : 'Ollama Connected'
                  : locale === 'fr' ? 'Ollama non disponible' : 'Ollama unavailable'}
              </p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center mt-8 space-y-2">
            <div className="text-4xl">💬</div>
            <p className="text-gray-400 text-sm">
              {locale === 'fr'
                ? 'Pose des questions sur tes reçus'
                : 'Ask questions about your receipts'}
            </p>
            <p className="text-gray-500 text-xs">
              {locale === 'fr'
                ? '"Quel est mon plus gros dépense?"'
                : '"What was my biggest expense?"'}
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={cn(
              "max-w-[80%] rounded-2xl px-3 py-2 text-sm",
              msg.role === 'user'
                ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white'
                : 'bg-gray-800 border border-purple-500/20 text-gray-100'
            )}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 border border-purple-500/20 rounded-2xl px-3 py-2 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
              <span className="text-xs text-gray-400">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-purple-500/30">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
            placeholder={locale === 'fr' ? 'Pose une question...' : 'Ask a question...'}
            disabled={loading || !ollamaAvailable}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim() || !ollamaAvailable}
            className="bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 p-2 rounded-xl transition-all"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
