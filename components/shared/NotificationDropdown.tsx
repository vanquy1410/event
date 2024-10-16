"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Notification {
  _id: string;
  message: string;
  createdAt: string;
  eventId: string;
}

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      setNotifications(data.notifications);
    };

    fetchNotifications();
  }, []);

  return (
    <div className="relative">
      <Button 
        onClick={() => setIsOpen(!isOpen)} 
        variant="ghost" 
        size="icon"
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {notifications.length}
          </span>
        )}
      </Button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10">
          {notifications.length === 0 ? (
            <p className="p-4">Không có thông báo mới.</p>
          ) : (
            <ul className="max-h-96 overflow-auto">
              {notifications.map((notification) => (
                <li key={notification._id} className="border-b last:border-b-0">
                  <Link href={`/events/${notification.eventId}`} className="block p-4 hover:bg-gray-100">
                    <p className="text-sm">{notification.message}</p>
                    <small className="text-gray-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </small>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
