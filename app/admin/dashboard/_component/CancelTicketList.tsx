"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface CancelTicketNotification {
  _id: string;
  orderId: string;
  eventTitle: string;
  userEmail: string;
  ticketPrice: number;
  cancelDate: string;
  message: string;
}

export default function CancelTicketList() {
  const [cancelTickets, setCancelTickets] = useState<CancelTicketNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCancelTickets = async () => {
      try {
        const response = await fetch('/api/cancel-notifications');
        const data = await response.json();
        setCancelTickets(data.notifications);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách vé hủy:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCancelTickets();
  }, []);

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Danh sách vé đã hủy</h2>
      {cancelTickets.length === 0 ? (
        <p>Không có vé hủy nào.</p>
      ) : (
        <ul className="space-y-4">
          {cancelTickets.map((ticket) => (
            <li key={ticket._id} className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{ticket.eventTitle}</p>
                  <p>Email: {ticket.userEmail}</p>
                  <p>Giá vé: {ticket.ticketPrice.toLocaleString()}đ</p>
                  <p>Ngày hủy: {new Date(ticket.cancelDate).toLocaleString('vi-VN')}</p>
                  <p className="text-gray-600">{ticket.message}</p>
                </div>
                <Button asChild variant="outline">
                  <Link href={`/admin/dashboard/notifications/cancel-tickets/${ticket.orderId}`}>
                    Chi tiết
                  </Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
