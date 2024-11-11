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

export function FileUploader({ imageUrl, documentUrl, onImageChange, onDocumentChange }: FileUploaderProps) {
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isUploadingDocument, setIsUploadingDocument] = useState(false)
  const [uploadedDocument, setUploadedDocument] = useState<{ name: string, url: string } | null>(null);
  const [uploadedDiagram, setUploadedDiagram] = useState<{ name: string, url: string } | null>(null);

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
  }, [onImageChange])

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

  const onDropDiagram = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setIsUploadingDocument(true);
      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileType', 'diagram');

      try {
        const response = await fetch('/api/s3-storage', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload sơ đồ ghế thất bại');
        }

        const data = await response.json();
        onDocumentChange(data.url2);
      } catch (error) {
        console.error('Lỗi khi upload sơ đồ ghế:', error);
      } finally {
        setIsUploadingDocument(false);
      }
    }
  }, [onDocumentChange]);

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

  const { getRootProps: getDiagramRootProps, getInputProps: getDiagramInputProps } = useDropzone({
    onDrop: onDropDiagram,
    accept: {
      'image/png': ['.png'],
      'image/jpg': ['.jpg']
    },
    multiple: false
  })

  return (
    <div className="flex flex-col gap-4">
      <div
        {...getImageRootProps()}
        className="flex-center bg-dark-3 flex h-72 cursor-pointer flex-col overflow-hidden rounded-xl bg-grey-50">
        <input {...getImageInputProps()} className="cursor-pointer" />

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
            <Button type="button" className="rounded-full" disabled={isUploadingImage}>
              {isUploadingImage ? 'Đang tải ảnh lên...' : 'Chọn ảnh từ máy tính'}
            </Button>
          </div>
        )}
      </div>



      <div
        {...getDocumentRootProps()}
        className="flex-center bg-dark-3 flex h-40 cursor-pointer flex-col overflow-hidden rounded-xl bg-grey-50">
        <input {...getDocumentInputProps()} className="cursor-pointer" />

        {uploadedDocument ? (
          <div className="flex-center flex-col">
            <Image
              src={getFileIcon(uploadedDocument.name)}
              width={40}
              height={40}
              alt="File icon"
            />
            <p className="mt-2 text-sm">{uploadedDocument.name}</p>
            <a href={uploadedDocument.url} target="_blank" rel="noopener noreferrer" className="mt-2 text-blue-500 hover:underline">
            </a>
          </div>
        ) : (
          <div className="flex-center flex-col py-5 text-grey-500">
            <img src="/assets/icons/upload.svg" width={40} height={40} alt="file upload" />
            <h3 className="mb-2 mt-2">Kéo tài liệu vào đây</h3>
            <p className="p-medium-12 mb-4">PDF, DOC, DOCX</p>
            <Button type="button" className="rounded-full" disabled={isUploadingDocument}>
              {isUploadingDocument ? 'Đang tải tài liệu lên...' : 'Chọn tài liệu từ máy tính'}
            </Button>
          </div>
        )}
      </div>

      <div
        {...getDiagramRootProps()}
        className="flex-center bg-dark-3 flex h-40 cursor-pointer flex-col overflow-hidden rounded-xl bg-grey-50">
        <input {...getDiagramInputProps()} className="cursor-pointer" />

        {uploadedDiagram ? (
          <div className="flex-center flex-col">
            <Image
              src={getFileIcon(uploadedDiagram.name)}
              width={40}
              height={40}
              alt="Diagram icon"
            />
            <p className="mt-2 text-sm">{uploadedDiagram.name}</p>
            <a href={uploadedDiagram.url} target="_blank" rel="noopener noreferrer" className="mt-2 text-blue-500 hover:underline">
            </a>
          </div>
        ) : (
          <div className="flex-center flex-col py-5 text-grey-500">
            <img src="/assets/icons/upload.svg" width={40} height={40} alt="file upload" />
            <h3 className="mb-2 mt-2">Kéo sơ đồ ghế vào đây</h3>
            <p className="p-medium-12 mb-4">PNG, JPG</p>
            <Button type="button" className="rounded-full" disabled={isUploadingDocument}>
              {isUploadingDocument ? 'Đang tải sơ đồ lên...' : 'Chọn sơ đồ từ máy tính'}
            </Button>
          </div>
        )}
      </div>
      

    </div>
  )
}
