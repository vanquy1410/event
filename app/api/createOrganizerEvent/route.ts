import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import Organizer from '@/lib/database/models/organizer.model';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    const eventData = await request.json();
    console.log('Processing data:', eventData);

    // Validate required fields
    if (!eventData.name || !eventData.email || !eventData.eventTitle) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      );
    }

    // Chuyển đổi facilities từ [Array] sang mảng thực tế nếu cần
    const facilities = Array.isArray(eventData.scaleDetails?.venues?.facilities) 
      ? eventData.scaleDetails.venues.facilities 
      : [];

    // Tạo document mới với dữ liệu đã được xử lý
    const organizerData = {
      name: eventData.name,
      email: eventData.email,
      phoneNumber: eventData.phoneNumber,
      eventTitle: eventData.eventTitle,
      description: eventData.description,
      location: eventData.location,
      startDateTime: new Date(eventData.startDateTime),
      endDateTime: new Date(eventData.endDateTime),
      eventType: eventData.eventType,
      eventScale: eventData.eventScale,
      venueType: eventData.venueType,
      venue: eventData.venue,
      expectedTicketPrice: Number(eventData.expectedTicketPrice),
      expectedRevenue: Number(eventData.expectedRevenue),
      participantLimit: Number(eventData.participantLimit),
      price: Number(eventData.price),
      scaleDetails: {
        capacity: Number(eventData.scaleDetails.capacity),
        basePrice: Number(eventData.scaleDetails.basePrice),
        venues: {
          name: eventData.scaleDetails.venues.name,
          capacity: Number(eventData.scaleDetails.venues.capacity),
          pricePerDay: Number(eventData.scaleDetails.venues.pricePerDay),
          rating: Number(eventData.scaleDetails.venues.rating),
          facilities: facilities
        }
      },
      status: 'pending',
      documents: []
    };

    // Log dữ liệu trước khi lưu
    console.log('Attempting to save:', organizerData);

    // Tạo instance mới của model
    const newOrganizer = new Organizer(organizerData);

    // Validate model trước khi lưu
    await newOrganizer.validate();

    // Lưu vào database
    const savedOrganizer = await newOrganizer.save();
    console.log('Saved organizer:', savedOrganizer);

    return NextResponse.json(savedOrganizer, { status: 201 });

  } catch (error: unknown) {
    console.error('Lỗi chi tiết khi tạo organizer:', error);
    
    if (error instanceof Error) {
      // Xử lý lỗi validation của Mongoose
      if ('name' in error && error.name === 'ValidationError') {
        return NextResponse.json(
          { 
            error: 'Dữ liệu không hợp lệ',
            details: Object.values((error as any).errors).map((err: any) => err.message)
          },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Lỗi khi tạo organizer',
          message: error.message 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Lỗi không xác định khi tạo organizer' },
      { status: 500 }
    );
  }
}
