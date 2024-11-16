"use client"

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Collection from '@/components/shared/Collection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { IEvent } from '@/lib/database/models/event.model';

const FavoritesPage = () => {
  const { user } = useUser();
  const [favoriteEvents, setFavoriteEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = user?.publicMetadata?.userId as string;

  const fetchFavorites = async () => {
    try {
      const response = await fetch(`/api/favorites?userId=${userId}`);
      const data = await response.json();
      setFavoriteEvents(data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách yêu thích:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFavorites();
    }
  }, [userId]);

  if (loading) {
    return <div className="wrapper">Đang tải...</div>;
  }

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">Thư viện yêu thích</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/event-page">
              Khám phá thêm sự kiện
            </Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection 
          data={favoriteEvents}
          emptyTitle="Chưa có sự kiện yêu thích nào"
          emptyStateSubtext="Hãy khám phá và thêm các sự kiện bạn yêu thích vào thư viện"
          collectionType="All_Events"
          limit={6}
          page={1}
          totalPages={1}
          urlParamName="favoriteEvents"
          onFavoriteChange={fetchFavorites}
        />
      </section>
    </>
  );
};

export default FavoritesPage; 