'use client';

import { useState, useEffect } from 'react';
import { IPayment } from '@/lib/database/models/payment.model';
import { IOrganizer } from '@/types/organizer';

interface PaymentHistoryProps {
  organizerId?: string;
}

export default function PaymentHistory({ organizerId }: PaymentHistoryProps) {
  const [payments, setPayments] = useState<(IPayment & { organizerInfo?: IOrganizer })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        if (!organizerId) return;
        
        setLoading(true);
        const response = await fetch(`/api/payments/${organizerId}?includeOrganizerInfo=true`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error);
        }
        
        setPayments(data);
        setError(null);
      } catch (error) {
        console.error("Lỗi khi tải lịch sử thanh toán:", error);
        setError("Không thể tải lịch sử thanh toán");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [organizerId]);

  if (!organizerId) return null;
  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Lịch sử thanh toán</h2>
      
      {payments.length === 0 ? (
        <div className="text-gray-500">Chưa có lịch sử thanh toán</div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment._id} className="border rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Số tiền: {payment.amount.toLocaleString()}đ</span>
                <span className="text-gray-500">
                  {new Date(payment.paymentDate).toLocaleDateString('vi-VN')}
                </span>
              </div>

              {payment.organizerInfo && (
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Tên người đăng ký: {payment.organizerInfo.name}</div>
                  <div>Email: {payment.organizerInfo.email}</div>
                  <div>Số điện thoại: {payment.organizerInfo.phoneNumber}</div>
                  <div>Địa điểm: {payment.organizerInfo.location}</div>
                  <div>Thời gian bắt đầu: {new Date(payment.organizerInfo.startDateTime).toLocaleString('vi-VN')}</div>
                  <div>Thời gian kết thúc: {new Date(payment.organizerInfo.endDateTime).toLocaleString('vi-VN')}</div>
                  <div>Loại sự kiện: {payment.organizerInfo.eventType}</div>
                  <div>Số lượng người tham gia: {payment.organizerInfo.participantLimit}</div>
                </div>
              )}

              <div className="mt-2 flex justify-between text-sm">
                <div>Sự kiện: {payment.eventTitle}</div>
                <div className={payment.status === 'success' ? 'text-green-600' : 'text-red-600'}>
                  {payment.status === 'success' ? 'Thành công' : 'Thất bại'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 