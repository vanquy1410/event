'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { getOrganizerById } from "@/lib/actions/organizer.actions";
import SignatureCanvas from 'react-signature-canvas';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { IOrganizer } from '@/lib/database/models/organizer.model';

export default function OrganizerDashboard({ params }: { params: { id: string } }) {
  const [organizer, setOrganizer] = useState<IOrganizer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isViewSignatureModalOpen, setIsViewSignatureModalOpen] = useState(false);
  const router = useRouter();
  const signatureRef = useRef<SignatureCanvas>(null);

  // Lấy thông tin ban tổ chức
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getOrganizerById(params.id);
        setOrganizer(data);
      } catch (err) {
        setError('Không thể tải thông tin ban tổ chức');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  const handleSaveSignature = async () => {
    if (signatureRef.current) {
      const signatureData = signatureRef.current.toDataURL();
      try {
        const response = await fetch('/api/organizer/signature', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            organizerId: params.id,
            signatureData
          })
        });

        if (response.ok) {
          toast.success('Lưu chữ ký thành công');
          setIsSignatureModalOpen(false);
          setOrganizer((prev: IOrganizer | null) => 
            prev ? {...prev, digitalSignature: signatureData} : null
          );
        } else {
          throw new Error('Lỗi khi lưu chữ ký');
        }
      } catch (error) {
        toast.error('Có lỗi xảy ra khi lưu chữ ký');
        console.error(error);
      }
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Đang tải...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!organizer) return <div className="text-center">Không tìm thấy thông tin ban tổ chức</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard Ban Tổ Chức</h1>
        <Button asChild variant="outline">
          <Link href="/organizer">Quay lại</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Thông tin sự kiện</h2>
          <div className="space-y-3">
            <InfoItem label="Tên sự kiện" value={organizer.eventTitle} />
            <InfoItem label="Mô tả" value={organizer.description} />
            <InfoItem label="Địa điểm" value={organizer.location} />
            <InfoItem label="Giá vé" value={`${organizer.price.toLocaleString('vi-VN')}đ`} />
            <InfoItem label="Số lượng người tham gia" value={organizer.participantLimit} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Tài liệu và Chữ ký số</h2>
          <div className="space-y-4">
            {organizer.documents?.map((doc: string, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span>Tài liệu {index + 1}</span>
                <Button onClick={() => window.open(doc, '_blank')}>
                  Xem
                </Button>
              </div>
            ))}
            
            <div className="flex space-x-4 mt-6">
              <Button 
                onClick={() => setIsSignatureModalOpen(true)}
                className="bg-green-500 hover:bg-green-600"
              >
                {organizer.digitalSignature ? 'Cập nhật chữ ký số' : 'Tạo chữ ký số'}
              </Button>
              {organizer.digitalSignature && (
                <Button
                  onClick={() => setIsViewSignatureModalOpen(true)}
                  variant="outline"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Xem chữ ký
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isSignatureModalOpen} onOpenChange={setIsSignatureModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Tạo chữ ký số</DialogTitle>
          </DialogHeader>
          <div className="border rounded-lg p-4">
            <SignatureCanvas
              ref={signatureRef}
              canvasProps={{
                className: 'signature-canvas w-full h-[200px] border rounded',
              }}
            />
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <Button variant="outline" onClick={() => signatureRef.current?.clear()}>
              Xóa
            </Button>
            <Button onClick={handleSaveSignature}>
              Lưu chữ ký
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewSignatureModalOpen} onOpenChange={setIsViewSignatureModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chữ ký số của bạn</DialogTitle>
          </DialogHeader>
          <div className="border rounded-lg p-4">
            <img 
              src={organizer.digitalSignature} 
              alt="Chữ ký số"
              className="w-full h-[200px] object-contain"
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setIsViewSignatureModalOpen(false)}>
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const InfoItem = ({ label, value }: { label: string, value: string | number }) => (
  <div>
    <span className="font-medium">{label}: </span>
    <span>{value}</span>
  </div>
); 