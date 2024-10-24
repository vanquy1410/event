import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (fileUrl: string) => void;
  organizerId: string | null;
}

export default function UploadDocumentModal({ isOpen, onClose, onUploadSuccess, organizerId }: UploadDocumentModalProps) {
  const [isUploading, setIsUploading] = useState(false);
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

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0 && organizerId) {
      setIsUploading(true);
      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('organizerId', organizerId);

      try {
        const response = await fetch('/api/upload-document', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Upload tài liệu thất bại: ${errorData.error || response.statusText}`);
        }

        const data = await response.json();
        setUploadedDocument({ name: file.name, url: data.fileUrl });
        onUploadSuccess(data.fileUrl);
      } catch (error) {
        console.error('Lỗi khi upload tài liệu:', error);
        // Bạn có thể muốn đặt một trạng thái lỗi ở đây và hiển thị nó cho người dùng
        // setError(error.message);
      } finally {
        setIsUploading(false);
      }
    }
  }, [organizerId, onUploadSuccess]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Tài liệu</DialogTitle>
        </DialogHeader>
        <div
          {...getRootProps()}
          className="flex-center bg-dark-3 flex h-40 cursor-pointer flex-col overflow-hidden rounded-xl bg-grey-50"
        >
          <input {...getInputProps()} className="cursor-pointer" />

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
                Xem tài liệu
              </a>
            </div>
          ) : (
            <div className="flex-center flex-col py-5 text-grey-500">
              <img src="/assets/icons/upload.svg" width={40} height={40} alt="file upload" />
              <h3 className="mb-2 mt-2">Kéo tài liệu vào đây</h3>
              <p className="p-medium-12 mb-4">PDF, DOC, DOCX</p>
              <Button type="button" className="rounded-full" disabled={isUploading}>
                {isUploading ? 'Đang tải tài liệu lên...' : 'Chọn tài liệu từ máy tính'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
