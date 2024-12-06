import { IOrganizer } from '@/lib/database/models/organizer.model';

interface EventRegistrationInfoProps {
  data: IOrganizer | null;
  selectedEventId?: string;
}

export default function EventRegistrationInfo({ data, selectedEventId }: EventRegistrationInfoProps) {
  const eventData = selectedEventId ? data : null;
  
  if (!eventData) return null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number) => {
    return price ? price.toLocaleString('vi-VN') : '0';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Thông tin đăng ký sự kiện</h2>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-600">Tên người đăng ký:</span>
          <span>{eventData.name}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-600">Email:</span>
          <span>{eventData.email}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-600">Số điện thoại:</span>
          <span>{eventData.phoneNumber}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-600">Tên sự kiện:</span>
          <span>{eventData.eventTitle}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-600">Trạng thái:</span>
          <span className={`font-medium ${
            eventData.status === 'approved' ? 'text-green-600' : 
            eventData.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
          }`}>
            {eventData.status === 'approved' ? 'Đã duyệt' : 
             eventData.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-600">Số người tham dự:</span>
          <span>{eventData.participantLimit}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-600">Giá vé:</span>
          <span>{formatPrice(eventData.price)}đ</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-600">Địa điểm:</span>
          <span>{eventData.location}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-600">Mô tả:</span>
          <span className="text-justify">{eventData.description}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-600">Ngày bắt đầu:</span>
          <span>{formatDate(new Date(eventData.startDateTime))}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-600">Ngày kết thúc:</span>
          <span>{formatDate(new Date(eventData.endDateTime))}</span>
        </div>

        {eventData.digitalSignature && (
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-600">Chữ ký số:</span>
            <img 
              src={eventData.digitalSignature} 
              alt="Digital Signature"
              className="max-h-20 object-contain" 
            />
          </div>
        )}
      </div>
    </div>
  );
} 