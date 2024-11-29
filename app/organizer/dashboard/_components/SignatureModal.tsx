import { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signature: string) => void;
}

export default function SignatureModal({ isOpen, onClose, onSave }: SignatureModalProps) {
  const signatureRef = useRef<SignatureCanvas>(null);

  const handleClear = () => {
    signatureRef.current?.clear();
  };

  const handleSave = () => {
    if (signatureRef.current) {
      const signatureData = signatureRef.current.toDataURL();
      onSave(signatureData);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tạo chữ ký số</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-4">
          <Button onClick={handleClear} className="bg-red-500 hover:bg-red-600">
            Xóa
          </Button>
          <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600">
            Lưu
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 