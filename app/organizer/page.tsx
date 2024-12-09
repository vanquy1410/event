"use client"
import React, { useState, useEffect } from 'react';
import OrganizerEventForm from '@/components/shared/OrganizerEventForm';
import OrganizerList from '@/components/shared/OrganizerList';
import { Button } from '@/components/ui/button';
import { getOrganizerEvents, updateOrganizerEvent } from '@/lib/actions/organizer.actions';
import { IOrganizer } from '@/lib/database/models/organizer.model';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

const OrganizerPage = () => {
  const [organizers, setOrganizers] = useState<IOrganizer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
  });

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
        const userEvents = events.filter((event: IOrganizer) => 
          event.email === user?.primaryEmailAddress?.emailAddress
        );
        setOrganizers(userEvents);
        setError(null);
      } catch (error) {
        console.error('Lỗi khi tải danh sách:', error);
        setError('Không thể tải danh sách. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrganizers();
    }
  }, [user]);

  const handleEdit = async (updatedData: IOrganizer) => {
    try {
      const updatedOrganizer = await updateOrganizerEvent(updatedData._id, updatedData);
      setOrganizers(prev => 
        prev.map(org => 
          org._id === updatedData._id ? updatedOrganizer : org
        )
      );
      toast.success('Cập nhật thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
      toast.error('Có lỗi xảy ra khi cập nhật');
    }
  };

  const handleCancel = async (organizerId: string) => {
    try {
      const response = await fetch('/api/deleteOrganizer', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: organizerId }),
      });

      if (!response.ok) {
        throw new Error('Lỗi khi xóa phiếu đăng ký');
      }

      setOrganizers(prev => prev.filter(org => org._id !== organizerId));
      toast.success('Xóa phiếu đăng ký thành công');
    } catch (error) {
      console.error('Lỗi:', error);
      toast.error('Có lỗi xảy ra khi xóa phiếu đăng ký. Vui lòng thử lại sau.');
    }
  };

  return (
    <>
      <Header />
      
      <main className="flex-1">
        <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
          <div className="wrapper flex items-center justify-center sm:justify-between">
            <h3 className='h3-bold text-center sm:text-left'>Đăng ký tổ chức sự kiện</h3>
            <Button asChild size="lg" className="button hidden sm:flex">
              <Link href="/">
                Quay về trang chủ
              </Link>
            </Button>
          </div>
        </section>

        <div className="wrapper my-8">
          <OrganizerEventForm 
            setOrganizers={setOrganizers}
            userData={userData}
          />
          
          {loading ? (
            <div>Đang tải...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <OrganizerList
              organizers={organizers}
              onEdit={handleEdit}
              onCancel={handleCancel}
              onViewDashboard={(id) => {/* Xử lý xem dashboard */}}
            />
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default OrganizerPage;
