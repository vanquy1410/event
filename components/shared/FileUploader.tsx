'use client'

import { useState, useCallback, Dispatch, SetStateAction } from 'react'
import { useDropzone } from 'react-dropzone'

import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface FileUploaderProps {
  imageUrl: string;
  onFieldChange: (...event: any[]) => void;
  setFiles: Dispatch<SetStateAction<File[]>>;
  eventId: string;
}

export function FileUploader({ imageUrl, onFieldChange }: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setIsUploading(true)
      const file = acceptedFiles[0]
      const formData = new FormData()
      formData.append('file', file)

      try {
        const response = await fetch('/api/s3-storage', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Upload thất bại')
        }

        const data = await response.json()
        onFieldChange(data.fileUrl)
      } catch (error) {
        console.error('Lỗi khi upload:', error)
        // Xử lý lỗi ở đây (ví dụ: hiển thị thông báo lỗi)
      } finally {
        setIsUploading(false)
      }
    }
  }, [onFieldChange])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: false
  })

  return (
    <div
      {...getRootProps()}
      className="flex-center bg-dark-3 flex h-72 cursor-pointer flex-col overflow-hidden rounded-xl bg-grey-50">
      <input {...getInputProps()} className="cursor-pointer" />

      {imageUrl ? (
        <div className="flex h-full w-full flex-1 justify-center ">
          <Image
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
          <Button type="button" className="rounded-full" disabled={isUploading}>
            {isUploading ? 'Đang tải lên...' : 'Chọn từ máy tính'}
          </Button>
        </div>
      )}
    </div>
  )
}
