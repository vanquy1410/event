import React from 'react';
import { IOrganizer } from '@/lib/database/models/organizer.model';
import { Button } from '@/components/ui/button';

interface OrganizerListProps {
  organizers: IOrganizer[];
  onEdit: (id: string) => void;
  onCancel: (id: string) => void;
  onViewDashboard: (id: string) => void;
}

const OrganizerList: React.FC<OrganizerListProps> = ({ organizers, onEdit, onCancel, onViewDashboard }) => {
  return (
    <div className="mt-6 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Danh sách Ban Tổ Chức</h2>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-3 px-4 text-left">Tên</th>
            <th className="py-3 px-4 text-left">Sự kiện</th>
            <th className="py-3 px-4 text-left">Mô tả</th>
            <th className="py-3 px-4 text-left">Giá ($)</th>
            <th className="py-3 px-4 text-left">Địa điểm</th>
            <th className="py-3 px-4 text-left">Trạng thái</th>
            <th className="py-2 px-4 border-b">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {organizers.map((organizer, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="py-3 px-4 border-b">{organizer.name}</td>
              <td className="py-3 px-4 border-b">{organizer.eventTitle}</td>
              <td className="py-3 px-4 border-b">{organizer.description.substring(0, 50)}...</td>
              <td className="py-3 px-4 border-b">{organizer.price.toLocaleString('vi-VN')}</td>
              <td className="py-3 px-4 border-b">{organizer.location}</td>
              <td className="py-3 px-4 border-b">
                <span className={`px-3 py-1 rounded-full text-sm font-medium inline-block min-w-[100px] text-center ${
                  organizer.status === 'approved' ? 'bg-green-200 text-green-800' :
                  organizer.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                  'bg-red-200 text-red-800'
                }`}>
                  {organizer.status === 'approved' ? 'Đã duyệt' :
                   organizer.status === 'pending' ? 'Chờ duyệt' :
                   'Từ chối'}
                </span>
              </td>
              <td className="py-2 px-4 border-b">
                {organizer.status === 'pending' && (
                  <div className="flex space-x-2">
                    <Button onClick={() => onEdit(organizer._id)} size="sm">Chỉnh sửa</Button>
                    <Button onClick={() => onCancel(organizer._id)} variant="destructive" size="sm">Hủy</Button>
                  </div>
                )}
                {organizer.status === 'approved' && (
                  <Button
                    onClick={() => onViewDashboard(organizer._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Xem Dashboard
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrganizerList;
