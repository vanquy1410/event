import { NextResponse } from 'next/server';
import { createOrganizerEvent } from '@/lib/actions/organizer.actions';

export async function POST(request: Request) {
  try {
    const eventData = await request.json();
    const newEvent = await createOrganizerEvent(eventData);
    return NextResponse.json(newEvent, { status: 200 });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Error creating event', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
