"use client"

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import dynamic from 'next/dynamic';
import Loading from '@/components/shared/Loading';
import Link from 'next/link';

// Dynamic imports với đường dẫn chính xác
const BarChart = dynamic(
  () => import('@/components/shared/Charts/BarChart'),
  { ssr: false, loading: () => <Loading /> }
);

const PieChart = dynamic(
  () => import('@/components/shared/Charts/PieChart'),
  { ssr: false, loading: () => <Loading /> }
);

interface AnalyticsData {
  totalEventsAttended: number;
  totalFavorites: number;
  totalSpent: number;
  categoryAnalytics: {
    attended: Array<{
      name: string;
      value: number;
    }>;
    favorites: Array<{
      name: string;
      value: number;
    }>;
  };
  monthlyAttendance: Array<{
    month: string;
    count: number;
  }>;
}

const AnalyticsPage = () => {
  const { user, isLoaded } = useUser();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !user) return;
      
      try {
        const userId = user.publicMetadata.userId as string;
        const response = await fetch(`/api/analytics?userId=${userId}`);
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu thống kê:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, isLoaded]);

  if (!isLoaded || isLoading) {
    return <Loading />;
  }

  if (!user) {
    return <div className="wrapper">Vui lòng đăng nhập đ xem thống kê</div>;
  }

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-between">
          <h3 className="h3-bold text-center sm:text-left">Thống Kê & Phân Tích</h3>
          <Link 
            href="/"
            className="flex items-center gap-2 rounded-full bg-primary-500 px-6 py-3 text-white transition-all hover:bg-primary-600"
          >
            <span>Về trang chủ</span>
          </Link>
        </div>
      </section>

      {analytics && (
        <section className="wrapper my-8">
          <div className="flex gap-4 mb-6">
            <button
              className={`px-4 py-2 rounded ${activeTab === 'overview' ? 'bg-primary-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('overview')}
            >
              Tổng Quan
            </button>
            <button
              className={`px-4 py-2 rounded ${activeTab === 'events' ? 'bg-primary-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('events')}
            >
              Sự Kiện Tham Gia
            </button>
            <button
              className={`px-4 py-2 rounded ${activeTab === 'favorites' ? 'bg-primary-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('favorites')}
            >
              Sự Kiện Yêu Thích
            </button>
          </div>

          {/* Tab content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-bold text-xl mb-2">Tổng số sự kiện tham gia</h4>
                <p className="text-3xl font-bold">{analytics.totalEventsAttended}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-bold text-xl mb-2">Sự kiện yêu thích</h4>
                <p className="text-3xl font-bold">{analytics.totalFavorites}</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-bold text-xl mb-2">Tổng chi tiêu</h4>
                <p className="text-3xl font-bold">{analytics.totalSpent?.toLocaleString()}đ</p>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-bold text-xl mb-4">Phân bố theo danh mục</h4>
                <PieChart 
                  data={analytics.categoryAnalytics?.attended || []} 
                  title="Danh mục sự kiện đã tham gia"
                />
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-bold text-xl mb-4">Xu hướng tham gia</h4>
                <BarChart 
                  data={analytics.monthlyAttendance || []}
                  xKey="month"
                  yKey="count"
                  title="Số lượng sự kiện theo tháng"
                />
              </div>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-bold text-xl mb-4">Danh mục yêu thích</h4>
                <PieChart 
                  data={analytics.categoryAnalytics?.favorites || []} 
                  title="Phân bố danh mục yêu thích"
                />
              </div>
            </div>
          )}
        </section>
      )}
    </>
  );
};

export default AnalyticsPage; 