"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Notification {
  _id: string;
  message: string;
  createdAt: string;
  eventId: string;
}

export default function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      setNotifications(data.notifications);
    };

    fetchNotifications();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Thông báo mới nhất</h2>
      {notifications.length === 0 ? (
        <p>Không có thông báo mới.</p>
      ) : (
        <ul className="space-y-2">
          {notifications.slice(0, 5).map((notification) => (
            <li key={notification._id} className="border-b pb-2 flex justify-between items-center">
              <div>
                <p>{notification.message}</p>
                <small className="text-gray-500">
                  {new Date(notification.createdAt).toLocaleString()}
                </small>
              </div>
              <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <Link href={`/events/${notification.eventId}`}>Xem chi tiết sự kiện</Link>
              </Button>
            </li>
          ))}
        </ul>
      )}
      <Button asChild className="mt-4">
        <Link href="/employee/notifications">Xem tất cả thông báo</Link>
      </Button>
    </div>
  );
}

