import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IEvent } from '@/lib/database/models/event.model';
import { formatDateTime } from '@/lib/utils';

interface UpcomingEventsProps {
  events: IEvent[];
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Sự kiện sắp diễn ra</h2>
      <ul className="space-y-4">
        {events.map((event) => {
          const eventDate = new Date(event.startDateTime);
          const formattedDate = eventDate.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
          const formattedTime = eventDate.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <li key={event._id} className="border-b pb-2">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-20 h-20 relative">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <Link href={`/events/${event._id}`} className="hover:text-primary-500">
                    <h3 className="font-semibold">{event.title}</h3>
                  </Link>
                  <p className="text-sm text-gray-600">
                    {formatDateTime(event.startDateTime).dateTime}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UpcomingEvents;
