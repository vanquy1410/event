import { IOrganizer } from '@/types/organizer';
import PaymentHistory from './PaymentHistory';
import { IEvent } from '@/types';

interface EventRegistrationInfoProps {
  data: IOrganizer & {
    currentParticipants?: number;
  } | null;
  selectedEventId?: string;
  eventData: IEvent | null;
}

const EventRegistrationInfo: React.FC<EventRegistrationInfoProps> = ({ data, eventData , selectedEventId }) => {
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
          <InfoItem label="Dự kiến người tham gia" value={data.participantLimit.toString()} />
          <InfoItem label="Hiện tại người tham gia" value={data?.currentParticipants?.toString()} />
          <InfoItem label="Giá vé" value={`${data.price.toLocaleString('vi-VN')}đ`} />
          <InfoItem label="Trạng thái" value={getStatusText(data.status)} />
        </div>
      </div>

      {selectedEventId && (
        <PaymentHistory organizerId={selectedEventId} />
      )}
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