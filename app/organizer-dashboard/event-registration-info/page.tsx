"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { IOrganizer } from "@/types/organizer";
import { getOrganizerEvents } from "@/lib/actions/organizer.actions";
import EventRegistrationInfo from "../_components/EventRegistrationInfo";
import { IEvent } from "@/types";
import { getEventByEventOrganizerId } from "@/lib/actions/event.actions";
import { getOrdersByEventId } from "@/lib/actions/order.actions";

export default function EventRegistrationInfoPage() {
  const { user } = useUser();
  const [organizerData, setOrganizerData] = useState<IOrganizer[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventData, setEventData] = useState<IEvent | null>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrganizerData = async () => {
      try {
        setLoading(true);
        if (!user?.primaryEmailAddress?.emailAddress) return;

        const events = await getOrganizerEvents();

        console.log('====================================');
        console.log('events', events);
        console.log('====================================');
        
        if (events.length > 0) {
          setOrganizerData(events);
          setSelectedEventId(events[0]._id); // Mặc định chọn event đầu tiên
          setError(null);

          getEventByEventOrganizerId(events[0]._id).then(event => {
            setEventData(event);
            getOrdersByEventId({
              eventId: event._id,
              limit: Number.MAX_SAFE_INTEGER,
              page: 1
            }).then(response => {
              setOrders(response.data);
            }).catch((error) => {
              console.log('====================================');
              console.log('error', error);
              console.log('====================================');
            })  
          }).catch((error) => {
            console.log('====================================');
            console.log('error', error);
            console.log('====================================');
          })

       
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

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEventId(e.target.value);

    try {
      const event = await getEventByEventOrganizerId(e.target.value);
      setEventData(event);

      const response = await getOrdersByEventId({
        eventId: e.target.value,
        limit: Number.MAX_SAFE_INTEGER,
        page: 1
      })

      setOrders(response.data);
    } catch (error) {
      console.log('====================================');
      console.log('error', error);
      console.log('====================================');
    }
  }
  console.log('====================================');
  console.log('orders', orders);
  console.log('====================================');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Thông tin đăng ký sự kiện</h1>
      
      {/* Danh sách các sự kiện */}
      <div className="mb-6">
        <select 
          className="w-full p-2 border rounded"
          value={selectedEventId || ''}
          onChange={handleChange}
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
        eventData={eventData}
        selectedEventId={selectedEventId || undefined}
        orders={orders}
      />
    </div>
  );
} 