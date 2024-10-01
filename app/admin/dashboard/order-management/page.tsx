"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button'
import { getAllOrders, deleteOrder } from '@/lib/actions/order.actions';
import OrderTable from '../_component/OrderTable';

const OrderManagementPage: React.FC = () => {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await getAllOrders({
          query: query,
          limit: 10,
          page: 1
        });
        setOrders(fetchedOrders?.data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.');
      }
    };

    fetchOrders();
  }, [query]);

  const handleDelete = async (orderId: string) => {
    await deleteOrder({ orderId, path: '/admin/dashboard/order-management' });
    setOrders(orders.filter((order: any) => order._id !== orderId));
  };

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className='h3-bold text-center sm:text-left'>Quản lý đơn hàng</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/admin/dashboard">
              Quay lại Dashboard
            </Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <OrderTable 
          orders={orders} 
          onDelete={handleDelete} 
          onSearch={setQuery}
        />
      </section>
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
};

export default OrderManagementPage;
