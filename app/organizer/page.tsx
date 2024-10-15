"use client"
import React, { useState, useEffect } from 'react';
import OrganizerEventForm from '@/components/shared/OrganizerEventForm';
import OrganizerList from '@/components/shared/OrganizerList';
import { Button } from '@/components/ui/button';
import { getOrganizerEvents } from '@/lib/actions/organizer.actions';
import { IOrganizer } from '@/lib/database/models/organizer.model';
// import EditOrganizerButton from '@/components/shared/EditOrganizerButton';
import EditOrganizerForm from '@/components/shared/EditOrganizerForm';
import { updateOrganizerEvent } from '@/lib/actions/organizer.actions';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

const OrganizerPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [organizers, setOrganizers] = useState<IOrganizer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [organizerData, setOrganizerData] = useState({
    name: '',
    email: '',
    description: '',
    price: 0,
    status: '',
  });
  const [editingOrganizerId, setEditingOrganizerId] = useState<string | null>(null);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
  });
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      setUserData({
        name: `${user.firstName} ${user.lastName}`,
        email: user.primaryEmailAddress?.emailAddress || '',
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        setLoading(true);
        const events = await getOrganizerEvents();
        setOrganizers(events);
        setError(null);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sự kiện:', error);
        setError('Không thể tải danh sách sự kiện. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizers();
  }, []);

  const handleEditSubmit = async (data: any) => {
    if (!editingOrganizerId) {
      console.error('Không có ID ban tổ chức để cập nhật');
      return;
    }
    try {
      const response = await fetch('/api/updateOrganizer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: editingOrganizerId, ...data }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error('Lỗi khi cập nhật thông tin ban tổ chức');
      }
      const updatedOrganizer = await response.json();
      setOrganizers(prevOrganizers => 
        prevOrganizers.map(org => 
          org._id === editingOrganizerId ? { ...org, ...updatedOrganizer } : org
        )
      );
      setIsEditing(false);
      setEditingOrganizerId(null);
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin ban tổ chức:', error);
      // Xử l lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleEdit = (id: string) => {
    const organizerToEdit = organizers.find(org => org._id === id);
    if (organizerToEdit) {
      if (organizerToEdit.status === 'pending') {
        setEditingOrganizerId(id);
        setOrganizerData({
          name: organizerToEdit.name, // Keep the original name
          email: organizerToEdit.email, // Keep the original email
          description: organizerToEdit.description,
          price: organizerToEdit.price,
          status: organizerToEdit.status,
        });
        setIsEditing(true);
      } else {
        alert('Chỉ có thể chỉnh sửa phiếu đang ở trạng thái chờ duyệt.');
      }
    } else {
      console.error('Không tìm thấy ban tổ chức với ID:', id);
    }
  };

  const handleCancel = async (id: string) => {
    const organizerToCancel = organizers.find(org => org._id === id);
    if (organizerToCancel) {
      if (organizerToCancel.status === 'pending') {
        if (confirm('Bạn có chắc chắn muốn hủy đăng ký này không?')) {
          try {
            const response = await fetch('/api/cancelOrganizer', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ id }),
            });
            if (!response.ok) {
              const errorText = await response.text();
              console.error('Server response:', errorText);
              throw new Error('Lỗi khi hủy đăng ký');
            }
            const updatedOrganizer = await response.json();
            setOrganizers(prevOrganizers => 
              prevOrganizers.map(org => 
                org._id === id ? updatedOrganizer : org
              )
            );
            alert('Đã hủy đăng ký thành công.');
          } catch (error) {
            console.error('Lỗi khi hủy đăng ký:', error);
            alert('Có lỗi xảy ra khi hủy đăng ký. Vui lòng thử lại sau.');
          }
        }
      } else {
        alert('Chỉ có thể hủy đăng ký đang ở trạng thái chờ duyệt.');
      }
    } else {
      console.error('Không tìm thấy ban tổ chức với ID:', id);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Đăng ký ban tổ chức sự kiện</h1>
      <Button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Ẩn form' : 'Tạo sự kiện ban tổ chức'}
      </Button>
      {showForm && <OrganizerEventForm setOrganizers={setOrganizers} userData={userData} />}
      {loading && <p>Đang tải...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <OrganizerList 
          organizers={organizers} 
          onEdit={handleEdit} 
          onCancel={handleCancel}
          onViewDashboard={(id) => router.push(`/admin/dashboard?organizerId=${id}`)}
        />
      )}
      {isEditing && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Chỉnh sửa thông tin ban tổ chức</h2>
          <EditOrganizerForm
            initialData={organizerData}
            onSubmit={handleEditSubmit}
            onCancel={handleEditCancel}
            organizerId={editingOrganizerId}
          />
        </div>
      )}
    </div>
  );
};

export default OrganizerPage;
