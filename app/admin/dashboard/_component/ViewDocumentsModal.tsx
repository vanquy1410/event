import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FaFilePdf, FaFileWord, FaFile } from 'react-icons/fa';

interface ViewDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizerId: string | null;
  documents: string[];
}

export default function ViewDocumentsModal({ isOpen, onClose, organizerId, documents = [] }: ViewDocumentsModalProps) {
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FaFilePdf className="text-red-500" />;
      case 'doc':
      case 'docx':
        return <FaFileWord className="text-blue-500" />;
      default:
        return <FaFile className="text-gray-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white shadow-lg rounded-lg">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-center">Xem Tài liệu</DialogTitle>
        </DialogHeader>
        <div className="mt-6 max-h-[60vh] overflow-y-auto">
          {Array.isArray(documents) && documents.length > 0 ? (
            <ul className="space-y-4">
              {documents.map((doc, index) => (
                <li key={index} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="mr-4 text-2xl">{getFileIcon(doc)}</span>
                  <a 
                    href={doc} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex-grow font-medium"
                  >
                    {doc.split('/').pop()} 
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 italic py-4">Không có tài liệu nào được upload.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
