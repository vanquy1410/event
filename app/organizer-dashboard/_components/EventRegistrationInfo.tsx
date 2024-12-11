import { IOrganizer } from '@/types/organizer';

interface EventRegistrationInfoProps {
  data: IOrganizer | null;
  selectedEventId?: string;
}

const EventRegistrationInfo: React.FC<EventRegistrationInfoProps> = ({ data, selectedEventId }) => {
  if (!data) return null;

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
          <span>{data.name}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-600">Email:</span>
          <span>{data.email}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-600">Số điện thoại:</span>
          <span>{data.phoneNumber}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-600">Tên sự kiện:</span>
          <span>{data.eventTitle}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-600">Trạng thái:</span>
          <span className={`font-medium ${
            data.status === 'approved' ? 'text-green-600' : 
            data.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
          }`}>
            {data.status === 'approved' ? 'Đã duyệt' : 
             data.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-600">Số người tham dự:</span>
          <span>{data.participantLimit}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-600">Giá vé:</span>
          <span>{formatPrice(data.price)}đ</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-600">Địa điểm:</span>
          <span>{data.location}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-600">Mô tả:</span>
          <span className="text-justify">{data.description}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-600">Ngày bắt đầu:</span>
          <span>{formatDate(new Date(data.startDateTime))}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-600">Ngày kết thúc:</span>
          <span>{formatDate(new Date(data.endDateTime))}</span>
        </div>

        {data.digitalSignature && (
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-600">Chữ ký số:</span>
            <img 
              src={data.digitalSignature} 
              alt="Digital Signature"
              className="max-h-20 object-contain" 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EventRegistrationInfo; 