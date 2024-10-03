import { connectToDatabase } from '@/lib/database';
import Organizer, { IOrganizer } from '@/lib/database/models/organizer.model';

export async function createOrganizerEvent(eventData: Omit<IOrganizer, 'status'>) {
  try {
    await connectToDatabase();

    const newEvent = await Organizer.create({
      ...eventData,
      status: 'pending'
    });

    return JSON.parse(JSON.stringify(newEvent));
  } catch (error) {
    console.error('Error creating organizer event:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
}

export async function getOrganizerEvents(status?: 'pending' | 'approved' | 'rejected') {
  try {
    await connectToDatabase();

    const query = status ? { status } : {};
    const events = await Organizer.find(query);

    return JSON.parse(JSON.stringify(events));
  } catch (error) {
    console.error('Error getting organizer events:', error);
    throw error;
  }
}

export async function updateOrganizerEventStatus(eventId: string, status: 'approved' | 'rejected') {
  try {
    await connectToDatabase();

    const updatedEvent = await Organizer.findByIdAndUpdate(
      eventId,
      { status },
      { new: true }
    );

    return JSON.parse(JSON.stringify(updatedEvent));
  } catch (error) {
    console.error('Error updating organizer event status:', error);
    throw error;
  }
}
