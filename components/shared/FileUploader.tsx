'use client'

import { useState, useCallback, Dispatch, SetStateAction } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface FileUploaderProps {
  imageUrl: string;
  documentUrl: string;
  onImageChange: (...event: any[]) => void;
  onDocumentChange: (...event: any[]) => void;
  setFiles: Dispatch<SetStateAction<File[]>>;
  eventId: string;
}

export function FileUploader({ imageUrl, documentUrl, onImageChange, onDocumentChange, setFiles }: FileUploaderProps) {
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isUploadingDocument, setIsUploadingDocument] = useState(false)
  const [uploadedDocument, setUploadedDocument] = useState<{ name: string, url: string } | null>(null);

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '/assets/icons/pdf.svg';
      case 'doc':
      case 'docx':
        return '/assets/icons/word.svg';
      default:
        return '/assets/icons/document.svg';
    }
  };

  const onDropImage = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setIsUploadingImage(true)
      const file = acceptedFiles[0]
      setFiles([file])
      
      const formData = new FormData()
      formData.append('file', file)
      formData.append('fileType', 'image')

      try {
        const response = await fetch('/api/s3-storage', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Upload hình ảnh thất bại')
        }

        const data = await response.json()
        onImageChange(data.fileUrl)
      } catch (error) {
        console.error('Lỗi khi upload hình ảnh:', error)
      } finally {
        setIsUploadingImage(false)
      }
    }
  }, [onImageChange, setFiles])

  const onDropDocument = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setIsUploadingDocument(true);
      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileType', 'document');

      try {
        const response = await fetch('/api/s3-storage', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload tài liệu thất bại');
        }

        const data = await response.json();
        onDocumentChange(data.fileUrl);
        setUploadedDocument({ name: file.name, url: data.fileUrl });
      } catch (error) {
        console.error('Lỗi khi upload tài liệu:', error);
      } finally {
        setIsUploadingDocument(false);
      }
    }
  }, [onDocumentChange])

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } = useDropzone({
    onDrop: onDropImage,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: false
  })

  const { getRootProps: getDocumentRootProps, getInputProps: getDocumentInputProps } = useDropzone({
    onDrop: onDropDocument,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  })

  return (
<div className="flex flex-row gap-4 justify-center items-start">
<div
    {...getImageRootProps()}
    className="flex flex-col items-center justify-center w-80 h-80 border-dashed border-2 border-gray-300 rounded-lg cursor-pointer">
    <input {...getImageInputProps()} />
    {imageUrl ? (
  <Image
    src={imageUrl}
    alt="Uploaded Image"
    width={250}
    height={250}
    style={{
      maxWidth: '100%',   // Đảm bảo ảnh không vượt quá chiều rộng khung
      maxHeight: '100%',  // Đảm bảo ảnh không vượt quá chiều cao khung
      objectFit: 'contain', // Giữ nguyên tỉ lệ ảnh mà không cắt
    }}
    className="rounded-md"
  />
) : (
  <>
    <img src="/assets/icons/upload.svg" width={77} height={77} alt="Upload Icon" />
    <p className="mt-4 text-center text-gray-600">Kéo ảnh vào đây<br />SVG, PNG, JPG</p>
    <Button className="mt-2">{isUploadingImage ? 'Đang tải lên...' : 'Chọn ảnh'}</Button>
  </>
)}
  </div>

  <div
    {...getDocumentRootProps()}
    className="flex flex-col items-center justify-center w-80 h-80 border-dashed border-2 border-gray-300 rounded-lg cursor-pointer">
    <input {...getDocumentInputProps()} />
    {uploadedDocument ? (
      <>
        <Image src={getFileIcon(uploadedDocument.name)} width={77} height={77} alt="File Icon" />
        <p className="mt-2 text-center text-gray-600">{uploadedDocument.name}</p>
        <a
          href={uploadedDocument.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-blue-500 hover:underline">
          Tải về
        </a>
      </>
    ) : (
      <>
        <img src="/assets/icons/upload.svg" width={80} height={80} alt="Upload Icon" />
        <p className="mt-4 text-center text-gray-600">Kéo tài liệu vào đây<br />PDF, DOC, DOCX</p>
        <Button className="mt-2">{isUploadingDocument ? 'Đang tải lên...' : 'Chọn tài liệu'}</Button>
      </>
    )}
  </div>
</div>

  )
}
