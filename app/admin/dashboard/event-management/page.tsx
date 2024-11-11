"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button'
import { getAllEvents, deleteEvent } from '@/lib/actions/event.actions';
import EventTable from '../_component/EventTable';

const EventManagementPage: React.FC = () => {
  const [events, setEvents] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getAllEvents({
          query: query,
          category: category,
          limit: 10,
          page: currentPage
        });
        setEvents(fetchedEvents?.data || []);
        setTotalPages(fetchedEvents?.totalPages || 1);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Không thể tải danh sách sự kiện. Vui lòng thử lại sau.');
      }
    };

    fetchEvents();
  }, [query, category, currentPage]);

  const handleDelete = async (eventId: string) => {
    await deleteEvent({ eventId, path: '/admin/dashboard/event-management' });
    setEvents(events.filter((event: any) => event._id !== eventId));
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className='h3-bold text-center sm:text-left'>Quản lý sự kiện</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/events/create">
              Tạo sự kiện mới
            </Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <EventTable 
          events={events} 
          onDelete={handleDelete} 
          onSearch={setQuery}
          onCategoryChange={setCategory}
          filterType="all"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </section>
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
};

export default EventManagementPage;
