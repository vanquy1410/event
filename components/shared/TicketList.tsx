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
import { IOrder } from '@/types'
import Pagination from './Pagination'
import { deleteOrderClient } from '@/lib/actions/order.actions';
import Link from 'next/link';

interface TicketListProps {
  userId: string
  orders: IOrder[]
  page: number
  totalPages: number
}

const TicketList = ({ userId, orders, page, totalPages }: TicketListProps) => {
  const [orderList, setOrderList] = useState(orders);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false); // Thêm state để kiểm soát xác nhận

  const handleCancelOrder = async () => {
    if (!selectedOrderId) return;

    try {
      await deleteOrderClient(selectedOrderId);
      setOrderList(orderList.filter(order => order._id !== selectedOrderId));
      setSelectedOrderId(null);
      setIsConfirming(false); // Đặt lại trạng thái xác nhận
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
        setSelectedOrderId(null); // Reset ID nếu không xác nhận
        setIsConfirming(false); // Đặt lại trạng thái xác nhận
      }
    }
  }, [isConfirming]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 w-full"> {/* Thêm w-full để bảng chiếm toàn bộ chiều rộng */}
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
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orderList?.map((order: IOrder, index: number) => (
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
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.event.description.substring(0, 50)}...</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.totalAmount}$</td>
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
                        <p className="text-gray-700"><strong className="text-primary-500">Mô tả:</strong> {order.event.description}</p>
                        <p className="text-gray-700"><strong className="text-primary-500">Giá:</strong> {order.totalAmount}</p>
                        <p className="text-gray-700"><strong className="text-primary-500">Bắt đầu:</strong> {formatDateTime(order.event.startDateTime).dateTime}</p>
                        <p className="text-gray-700"><strong className="text-primary-500">Kết thúc:</strong> {formatDateTime(order.event.endDateTime).dateTime}</p>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" className="mt-4 bg-primary-500 text-white hover:bg-primary-600 transition-colors">Đóng</Button>
                      </DialogClose>
                      <Button variant="destructive" className="mt-4" onClick={() => {
                        setSelectedOrderId(order._id);
                        setIsConfirming(true); // Đặt trạng thái xác nhận
                      }}>Hủy vé</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {/* Thêm nút "Xem tài liệu" ở đây */}
                        <Button variant="outline" className="text-primary-500 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                        <Link href={order.event.url} target="_blank">
                          Tải tài liệu
                        </Link>
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