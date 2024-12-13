'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { formatDateTime } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { IOrderItem } from '@/types'
import Pagination from './Pagination'
import { cancelOrder } from '@/lib/actions/order.actions';
import Link from 'next/link';
import dynamic from 'next/dynamic'

interface TicketListProps {
  userId: string
  orders: IOrderItem[]
  page: number
  totalPages: number
}

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Please wait for loading…</p>,
});

const TicketList = ({ userId, orders, page, totalPages }: TicketListProps) => {
  const [orderList, setOrderList] = useState(orders);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleCancelOrder = async () => {
    if (!selectedOrderId) return;

    try {
      await cancelOrder({ orderId: selectedOrderId });
      
      // Cập nhật UI ngay lập tức
      setOrderList(prevOrders => {
        const canceledOrder = prevOrders.find(order => order._id === selectedOrderId);
        if (canceledOrder) {
          // Cập nhật trạng thái ghế trong event
          const updatedSeats = [...canceledOrder.event.seats];
          updatedSeats[canceledOrder.selectedSeat] = false;
          
          // Cập nhật số lượng người tham gia
          canceledOrder.event.currentParticipants = 
            (canceledOrder.event.currentParticipants || 0) - 1;
        }
        return prevOrders.filter(order => order._id !== selectedOrderId);
      });

      setSelectedOrderId(null);
      setIsConfirming(false);
      
      // Reload trang để cập nhật trạng thái mới nhất
      window.location.reload();
    } catch (error) {
      console.error('Lỗi khi hủy đơn hàng:', error);
      alert('Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại.');
    }
  };

  useEffect(() => {
    if (isConfirming) {
      const confirmCancel = window.confirm("Bạn có chắc chắn muốn hủy vé này?");
      if (confirmCancel) {
        handleCancelOrder();
      } else {
        setSelectedOrderId(null);
        setIsConfirming(false);
      }
    }
  }, [isConfirming]);

  const openQRCodeTab = (order: IOrderItem) => {
    const qrData = JSON.stringify({
      orderId: order._id,
      eventTitle: order.event.title,
      buyer: order.buyer,
      totalAmount: order.totalAmount,
      seatNumber: order.selectedSeat + 1
    });
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=900x900`;
    window.open(qrUrl, '_blank');
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 w-full">
        <thead className="bg-primary-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-black uppercase tracking-wider">STT</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-black uppercase tracking-wider">Hình ảnh</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-black uppercase tracking-wider">Tên sự kiện</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-black uppercase tracking-wider">Mô tả</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-black uppercase tracking-wider">Giá</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-black uppercase tracking-wider">Ngày bắt đầu</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-black uppercase tracking-wider">Ngày kết thúc</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-black uppercase tracking-wider">Chi tiết</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-black uppercase tracking-wider">Tài liệu</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-black uppercase tracking-wider">QR</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orderList?.map((order: IOrderItem, index: number) => (
            <tr key={order._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {order.event && order.event.imageUrl ? (
                  <Image
                    src={order.event.imageUrl}
                    alt={order.event.title || 'Event image'}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.event.title}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <ReactQuill 
                  value={order.event.description} 
                  readOnly={true} 
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {Number(order.totalAmount).toLocaleString('vi-VN') || 0} đ
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateTime(order.event.startDateTime).dateTime}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateTime(order.event.endDateTime).dateTime}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="text-primary-500 hover:text-primary-600 hover:bg-primary-50 transition-colors">Xem chi tiết</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-white rounded-lg shadow-xl">
                    <DialogHeader className="border-b pb-4">
                      <DialogTitle className="text-2xl font-bold text-primary-500">{order.event.title}</DialogTitle>
                      <DialogDescription className="text-gray-500">Chi tiết vé</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-6">
                      <Image
                        src={order.event.imageUrl}
                        alt={order.event.title}
                        width={100}
                        height={100}
                        className="rounded-md mx-auto"
                      />
                      <div className="space-y-2">
                        <p className="text-gray-700">
                          <strong className="text-primary-500">Mô tả:</strong>
                          <ReactQuill value={order.event.description} readOnly={true} theme="bubble" />
                        </p>
                        <p className="text-gray-700">
                          <strong className="text-primary-500">Giá:</strong> {Number(order.totalAmount).toLocaleString('vi-VN') || 0} đ
                        </p>
                        <p className="text-gray-700">
                          <strong className="text-primary-500">Vị trí ghế:</strong> Số {order.selectedSeat + 1}
                        </p>
                        <p className="text-gray-700">
                          <strong className="text-primary-500">Bắt đầu:</strong> {formatDateTime(order.event.startDateTime).dateTime}
                        </p>
                        <p className="text-gray-700">
                          <strong className="text-primary-500">Kết thúc:</strong> {formatDateTime(order.event.endDateTime).dateTime}
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" className="mt-4 bg-primary-500 text-white hover:bg-primary-600 transition-colors">Đóng</Button>
                      </DialogClose>
                      <Button variant="destructive" className="mt-4" onClick={() => {
                        setSelectedOrderId(order._id);
                        setIsConfirming(true);
                      }}>Hủy vé</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button variant="outline" className="text-primary-500 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                  <Link href={order.event.url || '#'} target="_blank">
                    Tải tài liệu
                  </Link>
                </Button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button variant="outline" className="text-primary-500 hover:text-primary-600 hover:bg-primary-50 transition-colors" onClick={() => openQRCodeTab(order)}>
                  Hiển thị QR
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination 
            page={page}
            totalPages={totalPages}
            urlParamName="ordersPage"
          />
        </div>
      )}
    </div>
  )
}

export default TicketList
