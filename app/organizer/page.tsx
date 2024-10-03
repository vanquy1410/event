"use client"
import React, { useState, useEffect } from 'react';
import OrganizerEventForm from '@/components/shared/OrganizerEventForm';
import OrganizerList from '@/components/shared/OrganizerList';
import { Button } from '@/components/ui/button';
import { getOrganizerEvents } from '@/lib/actions/organizer.actions';
import { IOrganizer } from '@/lib/database/models/organizer.model';

const OrganizerPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [organizers, setOrganizers] = useState<IOrganizer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Đăng ký ban tổ chức sự kiện</h1>
      <Button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Ẩn form' : 'Tạo sự kiện ban tổ chức'}
      </Button>
      {showForm && <OrganizerEventForm setOrganizers={setOrganizers} />}
      {loading && <p>Đang tải...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && <OrganizerList organizers={organizers} />}
    </div>
  );
};

export default OrganizerPage;