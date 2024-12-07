interface Payment {
  _id: string;
  organizerId: string;
  eventTitle: string;
  amount: number;
  status: string;
  paymentDate: string;
  createdAt: string;
  organizerInfo: {
    name: string;
    email: string;
    phoneNumber: string;
    location: string;
    startDateTime: string;
    endDateTime: string;
    eventType: string;
    participantLimit: number;
    status: string;
  } | null;
}

export default function PaymentTable({ payments }: { payments: Payment[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-3 px-4 border-b">STT</th>
            <th className="py-3 px-4 border-b">Tên sự kiện</th>
            <th className="py-3 px-4 border-b">Người tổ chức</th>
            <th className="py-3 px-4 border-b">Số tiền</th>
            <th className="py-3 px-4 border-b">Trạng thái</th>
            <th className="py-3 px-4 border-b">Ngày thanh toán</th>
            <th className="py-3 px-4 border-b">Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr key={payment._id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{index + 1}</td>
              <td className="py-2 px-4 border-b">{payment.eventTitle}</td>
              <td className="py-2 px-4 border-b">
                {payment.organizerInfo?.name || 'N/A'}
              </td>
              <td className="py-2 px-4 border-b">
                {payment.amount.toLocaleString('vi-VN')}đ
              </td>
              <td className="py-2 px-4 border-b">
                <span className={`px-2 py-1 rounded-full text-sm ${
                  payment.status === 'success' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {payment.status === 'success' ? 'Thành công' : 'Thất bại'}
                </span>
              </td>
              <td className="py-2 px-4 border-b">
                {new Date(payment.paymentDate).toLocaleDateString('vi-VN')}
              </td>
              <td className="py-2 px-4 border-b">
                <details className="cursor-pointer">
                  <summary className="text-blue-600 hover:text-blue-800">
                    Xem thêm
                  </summary>
                  {payment.organizerInfo && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                      <p>Email: {payment.organizerInfo.email}</p>
                      <p>SĐT: {payment.organizerInfo.phoneNumber}</p>
                      <p>Địa điểm: {payment.organizerInfo.location}</p>
                      <p>Thời gian bắt đầu: {new Date(payment.organizerInfo.startDateTime).toLocaleString('vi-VN')}</p>
                      <p>Thời gian kết thúc: {new Date(payment.organizerInfo.endDateTime).toLocaleString('vi-VN')}</p>
                      <p>Loại sự kiện: {payment.organizerInfo.eventType}</p>
                      <p>Số lượng người tham gia: {payment.organizerInfo.participantLimit}</p>
                      <p>Trạng thái tổ chức: {payment.organizerInfo.status}</p>
                    </div>
                  )}
                </details>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}