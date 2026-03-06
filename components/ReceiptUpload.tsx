'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { FileUploader } from '@/components/ui/FileUploader'
import { Camera, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { OCRResult } from '@/types/receipt'

interface ReceiptUploadProps {
  onUpload: (file: File) => Promise<void>
  onOCRResult?: (result: OCRResult) => void
}

export function ReceiptUpload({ onUpload, onOCRResult }: ReceiptUploadProps) {
  const { t } = useLanguage()
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      setStream(mediaStream)
      setIsCameraOpen(true)
    } catch (err) {
      console.error('Camera error:', err)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsCameraOpen(false)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)

    canvas.toBlob((blob) => {
      if (blob) {
        const capturedFile = new File([blob], `receipt-${Date.now()}.jpg`, { type: 'image/jpeg' })
        setFile(capturedFile)
        stopCamera()
      }
    }, 'image/jpeg')
  }

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop())
    }
  }, [stream])

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile)
  }

  const handleUpload = async () => {
    if (!file) return

    setIsProcessing(true)
    try {
      await onUpload(file)
    } catch (err) {
      console.error('Upload error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setIsCameraOpen(false)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            !isCameraOpen ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
        >
          {t('uploadReceipt')}
        </button>
        <button
          onClick={startCamera}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition ${
            isCameraOpen ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
        >
          <Camera className="w-4 h-4" />
          {t('takePhoto')}
        </button>
      </div>

      {isCameraOpen ? (
        <div className="relative rounded-xl overflow-hidden bg-black">
          <video ref={videoRef} autoPlay playsInline className="w-full" />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
            <button
              onClick={capturePhoto}
              className="px-6 py-3 bg-white rounded-full font-bold text-black hover:bg-gray-200 transition"
            >
              {t('takePhoto')}
            </button>
            <button
              onClick={stopCamera}
              className="px-4 py-3 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      ) : (
        <FileUploader onFileSelect={handleFileSelect} />
      )}

      <canvas ref={canvasRef} className="hidden" />

      {file && (
        <button
          onClick={handleUpload}
          disabled={isProcessing}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t('processing')}
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              {t('uploadReceipt')}
            </>
          )}
        </button>
      )}
    </div>
  )
}
