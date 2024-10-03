import { IOrganizer } from '@/lib/database/models/organizer.model';

export async function createOrganizerEvent(eventData: Omit<IOrganizer, 'status'>) {
  try {
    const response = await fetch('/api/organizer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    if (!response.ok) {
      throw new Error('Lỗi khi tạo sự kiện');
    }
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi tạo sự kiện:', error);
    throw error;
  }
}

export async function getOrganizerEvents(status?: 'pending' | 'approved' | 'rejected') {
  try {
    const url = status ? `/api/organizer?status=${status}` : '/api/organizer';
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Lỗi khi lấy danh sách sự kiện');
    }
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sự kiện:', error);
    throw error;
  }
}

export async function updateOrganizerEventStatus(organizerId: string, status: 'approved' | 'rejected') {
  try {
    const response = await fetch(`/api/organizer/${organizerId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', errorText);
      throw new Error('Lỗi khi cập nhật trạng thái ban tổ chức');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái ban tổ chức:', error);
    throw error;
  }
}