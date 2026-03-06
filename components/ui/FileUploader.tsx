'use client'

import { useCallback, useState, useRef } from 'react'
import { Upload, Camera, X, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploaderProps {
  onFileSelect: (file: File) => void
  accept?: string
  maxSize?: number
}

export function FileUploader({ onFileSelect, accept = 'image/*,.pdf', maxSize = 10 * 1024 * 1024 }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
    setError(null)
    if (file.size > maxSize) {
      setError(`File too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB`)
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    onFileSelect(file)
  }, [maxSize, onFileSelect])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  const clearPreview = () => {
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-4">
      {!preview ? (
        <div
          onDragEnter={(e) => { e.preventDefault(); setDragActive(true) }}
          onDragLeave={() => setDragActive(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
            dragActive ? "border-purple-500 bg-purple-500/10" : "border-gray-600 hover:border-gray-500 bg-gray-800/50"
          )}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
          <Upload className={cn("w-10 h-10 mx-auto mb-3", dragActive ? "text-purple-400" : "text-gray-400")} />
          <p className="text-gray-200 font-medium mb-1">
            {dragActive ? "Drop receipt here" : "Drag & drop receipt here"}
          </p>
          <p className="text-gray-500 text-sm mb-3">or click to browse</p>
          <p className="text-gray-600 text-xs">
            Supports JPG, PNG, PDF up to {Math.round(maxSize / 1024 / 1024)}MB
          </p>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-gray-700">
          <img src={preview} alt="Receipt preview" className="w-full max-h-64 object-contain bg-gray-900" />
          <button
            onClick={clearPreview}
            className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full hover:bg-black/80 transition"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  )
}
