'use server';

import { connectToDatabase } from '@/lib/database';
import { IOrganizer } from '@/types/organizer';
import Organizer from '@/lib/database/models/organizer.model';
import { headers } from 'next/headers';
import { auth } from '@clerk/nextjs';

export async function createOrganizerEvent(eventData: Omit<IOrganizer, '_id' | 'status'>) {
  try {
    await connectToDatabase();
    
    const newOrganizer = new Organizer({
      ...eventData,
      status: 'pending',
      documents: []
    });

    const savedOrganizer = await newOrganizer.save();
    return savedOrganizer;

  } catch (error) {
    console.error('Lỗi khi tạo sự kiện:', error);
    throw error;
  }
}

export async function getOrganizerEvents(): Promise<IOrganizer[]> {
  try {
    const { getToken } = auth();
    const token = await getToken();
    
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/organizer`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Lỗi khi tải danh sách ban tổ chức');
    }

    return await response.json();
  } catch (error) {
    console.error('Lỗi khi tải danh sách ban tổ chức:', error);
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
    const { getToken } = auth();
    const token = await getToken();
    
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/organizer-admin/${organizerId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Lỗi khi cập nhật trạng thái');
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

export async function getOrganizerById(id: string) {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/organizer/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Lỗi khi tải thông tin ban tổ chức');
    }

    return await response.json();
  } catch (error) {
    console.error('Lỗi khi tải thông tin ban tổ chức:', error);
    throw error;
  }
}

// Hàm helper để lấy base URL
const getBaseUrl = () => {
  const headersList = headers();
  const host = headersList.get('host');
  const protocol = process?.env?.NODE_ENV === 'development' ? 'http' : 'https';
  return `${protocol}://${host}`;
};
