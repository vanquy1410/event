"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import EventTable from '@/app/employee/_components/EventTable';
import { getAllEvents, deleteEvent } from '@/lib/actions/event.actions';

const EmployeeEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getAllEvents({
          query: query,
          category: category,
          limit: 10,
          page: 1
        });
        setEvents(fetchedEvents?.data || []);
      } catch (err) {
        console.error('Lỗi khi tải danh sách sự kiện:', err);
        setError('Không thể tải danh sách sự kiện. Vui lòng thử lại sau.');
      }
    };

    fetchEvents();
  }, [query, category]);

  const handleDelete = async (eventId: string) => {
    await deleteEvent({ eventId, path: '/employee/events' });
    setEvents(events.filter((event: any) => event._id !== eventId));
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
          filterType="all" currentPage={0} totalPages={0} onPageChange={function (page: number): void {
            throw new Error('Function not implemented.');
          } }        />
      </section>
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
};

export default EmployeeEventsPage;
