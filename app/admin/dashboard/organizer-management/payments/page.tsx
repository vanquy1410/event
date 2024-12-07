"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PaymentTable from '@/app/admin/dashboard/_component/PaymentTable';
import { getAllPayments } from '@/lib/actions/payment.actions';

const OrganizerPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await getAllPayments();
        setPayments(response || []);
      } catch (err) {
        console.error('Lỗi khi tải danh sách thanh toán:', err);
        setError('Không thể tải danh sách thanh toán. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className='h3-bold text-center sm:text-left'>Quản lý thanh toán tổ chức sự kiện</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/admin/dashboard/organizer-management">
              Quay lại
            </Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        {loading ? (
          <div className="text-center">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <PaymentTable payments={payments} />
        )}
      </section>
    </>
  );
};

export default OrganizerPaymentsPage; 