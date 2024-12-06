"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { IPayment } from "@/lib/database/models/payment.model";

export default function PaymentsPage() {
  const { user } = useUser();
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        if (!user?.primaryEmailAddress?.emailAddress) return;

        const response = await fetch(`/api/payments?email=${user.primaryEmailAddress.emailAddress}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error);
        }
        
        console.log("Fetched payments:", data);
        setPayments(data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu thanh toán:", error);
        setError("Không thể tải dữ liệu thanh toán");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPayments();
    }
  }, [user]);

  useEffect(() => {
    console.log("Current payments state:", payments);
  }, [payments]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý thanh toán</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Quyền truy cập</h2>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-purple-700 font-medium">Ban Tổ Chức</p>
            <ul className="text-purple-600 mt-2 space-y-1">
              <li>• Xem lịch sử thanh toán</li>
              <li>• Kiểm tra trạng thái thanh toán</li>
              <li>• Quản lý thông tin thanh toán</li>
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Danh sách thanh toán</h2>
          {payments.length === 0 ? (
            <div className="text-gray-500">Chưa có thanh toán nào</div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment._id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-gray-600">Mã thanh toán:</span>
                      <p className="font-medium">{payment._id}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Tên sự kiện:</span>
                      <p className="font-medium">{payment.eventTitle}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Số tiền:</span>
                      <p className="font-medium">{payment.amount.toLocaleString()}đ</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Ngày thanh toán:</span>
                      <p className="font-medium">
                        {new Date(payment.paymentDate).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Trạng thái:</span>
                      <p className={`font-medium ${
                        payment.status === 'success' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {payment.status === 'success' ? 'Thành công' : 'Thất bại'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Ngày tạo:</span>
                      <p className="font-medium">
                        {new Date(payment.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 