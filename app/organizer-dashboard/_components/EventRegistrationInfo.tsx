import { IOrganizer } from '@/types/organizer';
import PaymentHistory from './PaymentHistory';
import { IEvent } from '@/types';

interface EventRegistrationInfoProps {
  data: IOrganizer & {
    currentParticipants?: number;
  } | null;
  selectedEventId?: string;
  eventData: IEvent | null;
  orders: any[];
}

const EventRegistrationInfo: React.FC<EventRegistrationInfoProps> = ({ data, eventData , selectedEventId, orders = [] }) => {
  if (!data) return null;

  data.currentParticipants = 0

  if(eventData !== null) {
    data.eventTitle = eventData.title;
    data.location = eventData.location;
    data.startDateTime = eventData.startDateTime;
    data.endDateTime = eventData.endDateTime;
    data.participantLimit = eventData.participantLimit;
    data.currentParticipants = eventData.currentParticipants;
  }


  const revenue = orders.reduce((acc, order) => acc + +order?.totalAmount, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Chi tiết đăng ký sự kiện</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem label="Tên sự kiện" value={data?.eventTitle} />
          <InfoItem label="Địa điểm" value={data.location} />
          <InfoItem label="Thời gian bắt đầu" value={new Date(data.startDateTime).toLocaleDateString('vi-VN')} />
          <InfoItem label="Thời gian kết thúc" value={new Date(data.endDateTime).toLocaleDateString('vi-VN')} />
          <InfoItem label="Loại sự kiện" value={data.eventType} />
          <InfoItem label="Quy mô" value={data.eventScale} />
          <InfoItem label="Dự kiến" value={data.participantLimit.toString() + ' người tham gia'} />
          <InfoItem label="Giá vé" value={`${data.price.toLocaleString('vi-VN')}đ`} />
          <InfoItem label="Đã bán" value={`${data?.currentParticipants}  vé`} />
          <InfoItem label="Còn lại" value={`${data.participantLimit-data?.currentParticipants} vé`} />
          <InfoItem label="Doanh thu" value={`${revenue.toLocaleString('vi-VN')}đ`} />
          <InfoItem label="Trạng thái" value={getStatusText(data.status)} />
        </div>
      </div>

      {selectedEventId && (
        <PaymentHistory organizerId={selectedEventId} />
      )}

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Lịch sử đơn hàng</h2>
            <div className="grid grid-cols-1  gap-4">
              {orders.length > 0 && orders.map((order, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded-lg grid grid-cols-2 gap-4">
                  <InfoItem label="Mã đơn hàng" value={order._id} />
                  <InfoItem label="Người mua" value={`${order.buyer.firstName} ${order.buyer.lastName }`} />
                  <InfoItem label="Ngày đặt" value={new Date(order.createdAt).toLocaleDateString('vi-VN')} />
                  <InfoItem label="Tổng tiền" value={`${order.totalAmount.toLocaleString('vi-VN')}đ`} />
                </div>
              ))}
            </div>
          </div>

    </div>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <span className="font-medium">{label}: </span>
    <span className="text-gray-700">{value}</span>
  </div>
);

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Chờ duyệt';
    case 'approved':
      return 'Đã duyệt';
    case 'rejected':
      return 'Từ chối';
    case 'cancelled':
      return 'Đã hủy';
    default:
      return status;
  }
};

export default EventRegistrationInfo; 