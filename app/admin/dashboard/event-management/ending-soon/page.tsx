'use client'
import { useEffect, useState } from 'react';
import EventTable from '../../_component/EventTable';
import { getAllEvents } from '@/lib/actions/event.actions';

export default function EndingSoonEventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const now = new Date();
      const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
      const fetchedEvents = await getAllEvents({
        query: '',
        category: '',
        limit: 10,
        page: 1,
        startDate: now.toISOString(),
        endDate: threeDaysLater,
        minPrice: undefined,
        maxPrice: undefined,
        isFree: undefined
      });
      setEvents(fetchedEvents?.data || []);
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Sự kiện sắp kết thúc</h1>
      <EventTable 
        events={events} 
        onDelete={() => {}} 
        onSearch={() => {}} 
        onCategoryChange={() => {}}
        filterType="ending-soon"
      />
    </div>
  );
}

