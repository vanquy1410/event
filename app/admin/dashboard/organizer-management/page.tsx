"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button'
import { getOrganizerEvents, updateOrganizerEventStatus } from '@/lib/actions/organizer.actions';
import OrganizerTable from '../_component/OrganizerTable';
import { IOrganizer } from '@/types/organizer';
import { toast } from 'react-hot-toast';

const OrganizerManagementPage: React.FC = () => {
  const [organizers, setOrganizers] = useState<IOrganizer[]>([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        const fetchedOrganizers = await getOrganizerEvents();
        setOrganizers(fetchedOrganizers || []);
      } catch (err) {
        console.error('Lỗi khi tải danh sách ban tổ chức:', err);
        setError('Không thể tải danh sách ban tổ chức. Vui lòng thử lại sau.');
      }
    };

    fetchOrganizers();
  }, [query]);

  const handleStatusUpdate = async (organizerId: string, status: 'approved' | 'rejected') => {
    try {
      const updatedOrganizer = await updateOrganizerEventStatus(organizerId, status);
      
      if (updatedOrganizer) {
        setOrganizers(prev => 
          prev.map(org => 
            org._id === organizerId ? { ...org, status: updatedOrganizer.status } : org
          )
        );
        toast.success('Cập nhật trạng thái thành công');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const handleDocumentUpdate = (organizerId: string, newDocument: string) => {
    setOrganizers(prevOrganizers => prevOrganizers.map(org => 
      org._id === organizerId 
        ? { ...org, documents: [...(org.documents || []), newDocument] }
        : org
    ));
  };

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className='h3-bold text-center sm:text-left'>Quản lý tổ chức sự kiện</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/admin/dashboard">
              Quay lại Dashboard
            </Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <OrganizerTable 
          organizers={organizers} 
          onStatusUpdate={handleStatusUpdate} 
          onSearch={setQuery}
          onDocumentUpdate={handleDocumentUpdate}
        />
      </section>
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
};

export default OrganizerManagementPage;
