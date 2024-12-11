"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { IOrganizer } from "@/types/organizer";
import { getOrganizerEvents } from "@/lib/actions/organizer.actions";
import EventRegistrationInfo from "../_components/EventRegistrationInfo";

export default function EventRegistrationInfoPage() {
  const { user } = useUser();
  const [organizerData, setOrganizerData] = useState<IOrganizer[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizerData = async () => {
      try {
        setLoading(true);
        if (!user?.primaryEmailAddress?.emailAddress) return;

        const events = await getOrganizerEvents();
        
        if (events.length > 0) {
          setOrganizerData(events);
          setSelectedEventId(events[0]._id); // Mặc định chọn event đầu tiên
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

  const selectedEvent = organizerData.find(event => event._id === selectedEventId);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Thông tin đăng ký sự kiện</h1>
      
      {/* Danh sách các sự kiện */}
      <div className="mb-6">
        <select 
          className="w-full p-2 border rounded"
          value={selectedEventId || ''}
          onChange={(e) => setSelectedEventId(e.target.value)}
        >
          {organizerData.map((event) => (
            <option key={event._id} value={event._id}>
              {event.eventTitle}
            </option>
          ))}
        </select>
      </div>

      {/* Hiển thị thông tin chi tiết */}
      <EventRegistrationInfo 
        data={selectedEvent || null}
        selectedEventId={selectedEventId || undefined}
      />
    </div>
  );
} 