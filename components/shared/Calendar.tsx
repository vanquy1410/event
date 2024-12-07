import React from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { IEvent } from '@/lib/database/models/event.model';
import { useRouter } from 'next/navigation';

moment.locale('vi');
const localizer = momentLocalizer(moment);

interface CalendarProps {
  events: IEvent[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ events, selectedDate, onDateChange }) => {
  const router = useRouter();

  const eventStyleGetter = (event: IEvent) => {
    return {
      style: {
        backgroundColor: '#7857FF',
        borderRadius: '8px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '180px', // Giới hạn chiều rộng của sự kiện
      }
    };
  };

  const dayPropGetter = (date: Date) => {
    return {
      style: {
        position: 'relative',
      }
    };
  };

  const handleEventClick = (event: IEvent) => {
    router.push(`/events/${event._id}`);
  };

  const calendarEvents = events.map(event => ({
    ...event,
    start: new Date(event.startDateTime),
    end: new Date(event.endDateTime),
    title: event.title,
  }));

  return (
    <div style={{ height: '500px' }}>
      <BigCalendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        eventPropGetter={eventStyleGetter}
        dayPropGetter={dayPropGetter}
        onSelectEvent={handleEventClick}
        views={['month']}
        date={selectedDate}
        onNavigate={(date: Date) => onDateChange(date)}
        messages={{
          next: "Tiếp",
          previous: "Trước",
          today: "Hôm nay",
          month: "Tháng",
          week: "Tuần",
          day: "Ngày"
        }}
      />
    </div>
  );
};

export default Calendar;
