"use client"

import React, { useState, useEffect } from 'react';
import Calendar from '@/components/shared/Calendar';
import { getAllEvents } from '@/lib/actions/event.actions';
import { IEvent } from '@/lib/database/models/event.model';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const EventCalendarPage = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getAllEvents({
          query: '',
          category: '',
          page: 1,
          limit: 10
        });
        if (fetchedEvents && fetchedEvents.data) {
          setEvents(fetchedEvents.data);
        } else {
          console.error('Không thể lấy dữ liệu sự kiện');
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu sự kiện:', error);
      }
    };
    fetchEvents();
  }, []);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="wrapper my-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="h1-bold">Lịch sự kiện</h1>
        <Button onClick={handleGoHome}>Về trang chủ</Button>
      </div>
      <div className="mb-4">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          className="p-2 border rounded"
        />
      </div>
      <Calendar 
        events={events} 
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      />
    </div>
  );
};

export default EventCalendarPage;
