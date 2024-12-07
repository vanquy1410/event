"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface CanceledTicket {
  _id: string;
  orderId: string;
  eventTitle: string;
  userEmail: string;
  ticketPrice: number;
  cancelDate: string;
  message: string;
}

export default function CanceledTicketsPage() {
  const [canceledTickets, setCanceledTickets] = useState<CanceledTicket[]>([]);

  useEffect(() => {
    const fetchCanceledTickets = async () => {
      try {
        const response = await fetch('/api/cancel-notifications');
        const data = await response.json();
        setCanceledTickets(data.notifications);
      } catch (error) {
        console.error('Lỗi khi tải danh sách vé hủy:', error);
      }
    };

    fetchCanceledTickets();
  }, []);

  const handleHideTicket = (ticketId: string) => {
    setCanceledTickets(prevTickets => 
      prevTickets.filter(ticket => ticket._id !== ticketId)
    );
  };

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className='h3-bold text-center sm:text-left'>Danh sách vé đã hủy</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/admin/dashboard">
              Quay lại Dashboard
            </Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Mã đơn hàng</th>
                <th className="py-2 px-4 border-b">Tên sự kiện</th>
                <th className="py-2 px-4 border-b">Email người hủy</th>
                <th className="py-2 px-4 border-b">Giá vé</th>
                <th className="py-2 px-4 border-b">Ngày hủy</th>
                <th className="py-2 px-4 border-b">Ghi chú</th>
                <th className="py-2 px-4 border-b">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {canceledTickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td className="py-2 px-4 border-b">{ticket.orderId}</td>
                  <td className="py-2 px-4 border-b">{ticket.eventTitle}</td>
                  <td className="py-2 px-4 border-b">{ticket.userEmail}</td>
                  <td className="py-2 px-4 border-b">
                    {ticket.ticketPrice.toLocaleString()} VNĐ
                  </td>
                  <td className="py-2 px-4 border-b">
                    {new Date(ticket.cancelDate).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b">{ticket.message}</td>
                  <td className="py-2 px-4 border-b">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline">Xóa</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white rounded-lg shadow-lg">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xóa vé đã hủy</AlertDialogTitle>
                          <AlertDialogDescription>Bạn có chắc chắn muốn xóa vé đã hủy này khỏi danh sách hiển thị không?</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleHideTicket(ticket._id)}>Xóa</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
