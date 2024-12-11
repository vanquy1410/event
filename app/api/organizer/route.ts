import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import Organizer from '@/lib/database/models/organizer.model';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const events = await Organizer.find().sort({ createdAt: -1 });
    return NextResponse.json(events);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sự kiện:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();
    
    const organizerData = {
      name: data.name,
      phoneNumber: data.phoneNumber,
      email: data.email,
      eventTitle: data.eventTitle,
      description: data.description,
      location: data.location,
      startDateTime: new Date(data.startDateTime),
      endDateTime: new Date(data.endDateTime),
      eventType: data.eventType,
      eventScale: data.eventScale,
      venueType: data.venueType,
      venue: data.venue,
      expectedTicketPrice: Number(data.expectedTicketPrice),
      expectedRevenue: Number(data.expectedRevenue),
      participantLimit: Number(data.participantLimit),
      price: Number(data.price),
      scaleDetails: {
        capacity: Number(data.scaleDetails.capacity),
        basePrice: Number(data.scaleDetails.basePrice),
        venues: {
          name: data.scaleDetails.venues.name,
          capacity: Number(data.scaleDetails.venues.capacity),
          pricePerDay: Number(data.scaleDetails.venues.pricePerDay),
          rating: Number(data.scaleDetails.venues.rating),
          facilities: data.scaleDetails.venues.facilities
        }
      },
      status: 'pending'
    };

    console.log('Processing data:', organizerData);
    const newOrganizer = await Organizer.create(organizerData);
    console.log('Created organizer:', newOrganizer.toObject());
    
    return NextResponse.json(newOrganizer, { status: 201 });
  } catch (error: any) {
    console.error('API error:', error);
    if (error.errors) {
      console.error('Validation errors:', error.errors);
    }
    return NextResponse.json(
      { 
        message: error.message || 'Lỗi khi tạo organizer',
        errors: error.errors 
      }, 
      { status: 500 }
    );
  }
}
