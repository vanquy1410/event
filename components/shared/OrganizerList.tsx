import React, { useState } from 'react';
import { IOrganizer } from '@/lib/database/models/organizer.model';
import { Button } from '@/components/ui/button';
import EditOrganizerForm from '@/components/shared/EditOrganizerForm';
import { toast } from 'react-hot-toast';

interface OrganizerListProps {
  organizers: IOrganizer[];
  onEdit: (organizer: IOrganizer) => void;
  onCancel: (id: string) => void;
  onViewDashboard: (id: string) => void;
}

const OrganizerList: React.FC<OrganizerListProps> = ({ organizers, onEdit, onCancel, onViewDashboard }) => {
  const [editingOrganizer, setEditingOrganizer] = useState<IOrganizer | null>(null);

  const handleEdit = (organizer: IOrganizer) => {
    const organizerWithDates = {
      ...organizer,
      startDateTime: new Date(organizer.startDateTime),
      endDateTime: new Date(organizer.endDateTime)
    };
    setEditingOrganizer(organizerWithDates);
  };

  const handleSubmitEdit = async (updatedData: any) => {
    try {
      const response = await fetch('/api/updateOrganizer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingOrganizer?._id,
          ...updatedData
        }),
      });

      if (!response.ok) {
        throw new Error('Lỗi khi cập nhật');
      }

      const updatedOrganizer = await response.json();
      onEdit(updatedOrganizer);
      setEditingOrganizer(null);
      toast.success('Cập nhật thành công!');
    } catch (error) {
      console.error('Lỗi:', error);
      toast.error('Có lỗi xảy ra khi cập nhật');
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Danh sách phiếu đăng ký ban tổ chức</h2>
      {editingOrganizer ? (
        <EditOrganizerForm
          initialData={editingOrganizer}
          onSubmit={handleSubmitEdit}
          onCancel={() => setEditingOrganizer(null)}
          organizerId={editingOrganizer._id}
        />
      ) : (
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
                      <Button onClick={() => handleEdit(organizer)} size="sm">Chỉnh sửa</Button>
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
      )}
    </div>
  );
};

export default OrganizerList;
