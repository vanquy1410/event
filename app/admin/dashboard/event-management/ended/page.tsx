'use client'
import { useEffect, useState } from 'react';
import EventTable from '../../_component/EventTable';
import { getAllEvents } from '@/lib/actions/event.actions';

export default function EndedEventsPage() {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchEvents = async () => {
      const now = new Date().toISOString();
      const fetchedEvents = await getAllEvents({
        query: '',
        category: '',
        limit: 10,
        page: currentPage,
        endDate: now,
        minPrice: undefined,
        maxPrice: undefined,
        isFree: undefined
      });
      setEvents(fetchedEvents?.data || []);
      setTotalPages(fetchedEvents?.totalPages || 1);
    };

    fetchEvents();
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Sự kiện đã kết thúc</h1>
      <EventTable 
        events={events} 
        onDelete={() => {}} 
        onSearch={() => {}} 
        onCategoryChange={() => {}}
        filterType="ended"
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

