import { IOrganizer } from '@/lib/database/models/organizer.model';
import { connectToDatabase } from '@/lib/database';
import Organizer from '@/lib/database/models/organizer.model';
import { handleError } from '@/lib/utils'; // Điều chỉnh đường dẫn nếu cần

const API_BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

export async function createOrganizerEvent(eventData: Omit<IOrganizer, 'status'>) {
  try {
    const response = await fetch('/api/createOrganizerEvent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Lỗi khi tạo sự kiện');
    }
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi tạo sự kiện:', error);
    throw error;
  }
}

export async function getOrganizerEvents() {
  try {
    const response = await fetch('/api/organizer');
    if (!response.ok) {
      throw new Error('Lỗi khi lấy danh sách sự kiện');
    }
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sự kiện:', error);
    throw error;
  }
}

export async function updateOrganizerEvent(id: string, eventData: Partial<IOrganizer>) {
  try {
    const response = await fetch(`/api/organizer/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error('Lỗi khi cập nhật');
    }

    return await response.json();
  } catch (error) {
    console.error('Lỗi khi cập nhật:', error);
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

export async function updateOrganizerDocument(organizerId: string, documentUrl: string) {
  try {
    connectToDatabase();

    const updatedOrganizer = await Organizer.findByIdAndUpdate(
      organizerId,
      { $push: { documents: documentUrl } },
      { new: true }
    );

    if (!updatedOrganizer) {
      throw new Error('Không tìm thấy ban tổ chức');
    }

    return updatedOrganizer;
  } catch (error) {
    console.error('Lỗi khi cập nhật tài liệu của ban tổ chức:', error);
    throw error;
  }
}
