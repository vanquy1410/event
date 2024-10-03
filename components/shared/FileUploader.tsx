'use client'

import { useCallback, Dispatch, SetStateAction, useState } from 'react'
import { Button } from '@/components/ui/button'
import { uploadToS3 } from '@/lib/s3Client'

type FileUploaderProps = {
  onFieldChange: (url: string) => void
  imageUrl: string
  setFiles: Dispatch<SetStateAction<File[]>>
}

export function FileUploader({ imageUrl, onFieldChange, setFiles }: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsUploading(true)
      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/s3-storage', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Upload failed')
        }

        const { url } = await response.json()
        onFieldChange(url)
        setFiles([file])
      } catch (error) {
        console.error('Lỗi khi upload file:', error)
      } finally {
        setIsUploading(false)
      }
    }
  }, [onFieldChange, setFiles])

  return (
    <div className="flex-center bg-dark-3 flex h-72 cursor-pointer flex-col overflow-hidden rounded-xl bg-grey-50">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        id="fileInput"
      />

      {imageUrl ? (
        <div className="flex h-full w-full flex-1 justify-center ">
          <img
            src={imageUrl}
            alt="image"
            width={250}
            height={250}
            className="w-full object-cover object-center"
          />
        </div>
      ) : (
        <div className="flex-center flex-col py-5 text-grey-500">
          <img src="/assets/icons/upload.svg" width={77} height={77} alt="file upload" />
          <h3 className="mb-2 mt-2">Kéo ảnh vào đây</h3>
          <p className="p-medium-12 mb-4">SVG, PNG, JPG</p>
          <Button
            type="button"
            className="rounded-full"
            onClick={() => document.getElementById('fileInput')?.click()}
            disabled={isUploading}
          >
            {isUploading ? 'Đang tải lên...' : 'Chọn từ máy tính'}
          </Button>
        </div>
      )}
    </div>
  )
}
