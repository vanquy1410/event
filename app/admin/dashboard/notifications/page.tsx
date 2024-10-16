"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Notification {
  _id: string;
  message: string;
  createdAt: string;
  eventId: string; // Thêm trường này
}

export default function AllNotificationsPage() {
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
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className='h3-bold text-center sm:text-left'>Tất cả thông báo</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/admin/dashboard">
              Quay lại Dashboard
            </Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        {notifications.length === 0 ? (
          <p>Không có thông báo.</p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((notification) => (
              <li key={notification._id} className="bg-white shadow-md rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg">{notification.message}</p>
                    <small className="text-gray-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </small>
                  </div>
                  <Button asChild className="ml-4">
                    <Link href={`/events/${notification.eventId}`}>Xem chi tiết sự kiện</Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
