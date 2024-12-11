"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { IOrganizer } from "@/types/organizer";
import { getOrganizerEvents } from "@/lib/actions/organizer.actions";

export default function OrganizerDashboard() {
  const { user } = useUser();
  const [organizerData, setOrganizerData] = useState<IOrganizer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizerData = async () => {
      try {
        setLoading(true);
        if (!user?.primaryEmailAddress?.emailAddress) return;

        const events = await getOrganizerEvents();
        
        const userEvent = events.find((event: IOrganizer) => 
          event.email === user.primaryEmailAddress?.emailAddress
        );
        
        if (userEvent) {
          setOrganizerData(userEvent);
          setError(null);
        } else {
          setError("Không tìm thấy thông tin đăng ký sự kiện");
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        setError("Có lỗi xảy ra khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrganizerData();
    }
  }, [user]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Xin chào, {user?.firstName} {user?.lastName}
        </h1>
        <p className="text-gray-600 mb-4">
          Email: {user?.primaryEmailAddress?.emailAddress}
        </p>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-purple-700 mb-2">
            Quyền truy cập: Ban Tổ Chức
          </h2>
          <ul className="text-purple-600 space-y-2">
            <li>• Quản lý và đăng ký sự kiện</li>
            <li>• Theo dõi trạng thái đăng ký</li>
            <li>• Quản lý thanh toán</li>
            <li>• Cập nhật thông tin sự kiện</li>
          </ul>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard
          title="Trạng thái"
          value={organizerData?.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
          bgColor={organizerData?.status === 'approved' ? 'bg-green-50' : 'bg-yellow-50'}
          textColor={organizerData?.status === 'approved' ? 'text-green-700' : 'text-yellow-700'}
        />
        <StatCard
          title="Số người tham dự"
          value={organizerData?.participantLimit || 0}
          bgColor="bg-blue-50"
          textColor="text-blue-700"
        />
        <StatCard
          title="Giá vé"
          value={`${organizerData?.price?.toLocaleString() || 0}đ`}
          bgColor="bg-indigo-50"
          textColor="text-indigo-700"
        />
      </div>

      {/* Latest Event Info */}
      {organizerData && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Sự kiện gần nhất</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Tên sự kiện:</p>
              <p className="font-medium">{organizerData.eventTitle}</p>
            </div>
            <div>
              <p className="text-gray-600">Địa điểm:</p>
              <p className="font-medium">{organizerData.location}</p>
            </div>
            <div>
              <p className="text-gray-600">Thời gian bắt đầu:</p>
              <p className="font-medium">
                {new Date(organizerData.startDateTime).toLocaleDateString('vi-VN')}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Thời gian kết thúc:</p>
              <p className="font-medium">
                {new Date(organizerData.endDateTime).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  bgColor: string;
  textColor: string;
}

const StatCard = ({ title, value, bgColor, textColor }: StatCardProps) => (
  <div className={`${bgColor} rounded-lg p-4`}>
    <h3 className="text-gray-600 text-sm">{title}</h3>
    <p className={`${textColor} text-2xl font-semibold mt-1`}>{value}</p>
  </div>
);