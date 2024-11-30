import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PaymentSuccessPage({ params }: { params: { paymentId: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">Thanh toán thành công!</h1>
        <p className="text-gray-600 mb-6">
          Mã thanh toán của bạn: {params.paymentId}
        </p>
        <Button asChild>
          <Link href="/organizer">
            Quay lại trang Ban tổ chức
          </Link>
        </Button>
      </div>
    </div>
  );
} 