"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FaBell, FaCalendar } from 'react-icons/fa';

interface Notification {
  _id: string;
  message: string;
  createdAt: string;
  eventId: string;
  type?: string;
}

export default function AllNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllNotifications = async () => {
      try {
        const [notificationsRes, cancelNotificationsRes] = await Promise.all([
          fetch('/api/notifications'),
          fetch('/api/cancel-notifications')
        ]);

        const notificationsData = await notificationsRes.json();
        const cancelNotificationsData = await cancelNotificationsRes.json();

        const allNotifications = [
          ...notificationsData.notifications.map((n: any) => ({ ...n, type: 'general' })),
          ...cancelNotificationsData.notifications.map((n: any) => ({ ...n, type: 'cancel' }))
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setNotifications(allNotifications);
      } catch (error) {
        console.error('Lỗi khi tải thông báo:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllNotifications();
  }, []);

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-between">
          <h3 className='h3-bold'>Tất cả thông báo</h3>
          <Button asChild size="lg" className="button">
            <Link href="/admin/dashboard">
              Quay lại Dashboard
            </Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        {loading ? (
          <p>Đang tải thông báo...</p>
        ) : notifications.length === 0 ? (
          <p>Không có thông báo nào.</p>
        ) : (
          <div className="grid gap-4">
            {notifications.map((notification) => (
              <div 
                key={notification._id} 
                className="bg-white shadow-md rounded-lg p-4 flex justify-between items-start"
              >
                <div className="flex gap-3">
                  <div className={`p-2 rounded-full ${
                    notification.type === 'cancel' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    {notification.type === 'cancel' ? (
                      <FaCalendar className="text-red-500" />
                    ) : (
                      <FaBell className="text-blue-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{notification.message}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(notification.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
                {notification.eventId && (
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/events/${notification.eventId}`}>
                      Xem chi tiết
                    </Link>
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
} 