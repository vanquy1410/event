import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IOrganizer } from "@/lib/database/models/organizer.model";
import { format } from "date-fns";
import { X } from "lucide-react";

interface OrganizerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizer: IOrganizer | null;
}

const OrganizerDetailModal = ({ isOpen, onClose, organizer }: OrganizerDetailModalProps) => {
  if (!organizer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-white rounded-xl p-0 overflow-hidden">
        <div className="relative">
          {/* Header với gradient background */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-6">
            <DialogTitle className="text-2xl font-bold text-white mb-2">
              Chi tiết phiếu đăng ký ban tổ chức
            </DialogTitle>
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-2 gap-8">
              {/* Thông tin người đăng ký */}
              <div className="bg-purple-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-purple-700 mb-4">Thông tin người đăng ký</h3>
                <div className="space-y-3">
                  <InfoItem label="Họ và tên" value={organizer.name} />
                  <InfoItem label="Email" value={organizer.email} />
                  <InfoItem label="Số điện thoại" value={organizer.phoneNumber} />
                </div>
              </div>

              {/* Thông tin sự kiện */}
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-blue-700 mb-4">Thông tin sự kiện</h3>
                <div className="space-y-3">
                  <InfoItem label="Tên sự kiện" value={organizer.eventTitle} />
                  <InfoItem label="Địa điểm" value={organizer.location} />
                  <InfoItem label="Hình thức" value={organizer.eventType} />
                </div>
              </div>

              {/* Mô tả sự kiện */}
              <div className="col-span-2 bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Mô tả sự kiện</h3>
                <p className="text-gray-600">{organizer.description}</p>
              </div>

              {/* Thời gian */}
              <div className="bg-green-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-green-700 mb-4">Thời gian</h3>
                <div className="space-y-3">
                  <InfoItem 
                    label="Bắt đầu" 
                    value={format(new Date(organizer.startDateTime), 'dd/MM/yyyy HH:mm')} 
                  />
                  <InfoItem 
                    label="Kết thúc" 
                    value={format(new Date(organizer.endDateTime), 'dd/MM/yyyy HH:mm')} 
                  />
                </div>
              </div>

              {/* Thông tin khác */}
              <div className="bg-orange-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-orange-700 mb-4">Thông tin khác</h3>
                <div className="space-y-3">
                  <InfoItem label="Giá vé" value={`${organizer.price.toLocaleString('vi-VN')}đ`} />
                  <InfoItem label="Số người tham dự" value={organizer.participantLimit.toString()} />
                  <InfoItem 
                    label="Trạng thái" 
                    value={
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        organizer.status === 'approved' ? 'bg-green-200 text-green-800' :
                        organizer.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-red-200 text-red-800'
                      }`}>
                        {organizer.status === 'approved' ? 'Đã duyệt' :
                         organizer.status === 'pending' ? 'Chờ duyệt' :
                         'Từ chối'}
                      </span>
                    } 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const InfoItem = ({ label, value }: { label: string, value: React.ReactNode }) => (
  <div>
    <span className="font-medium text-gray-700">{label}: </span>
    <span className="text-gray-600">{value}</span>
  </div>
);

export default OrganizerDetailModal; 