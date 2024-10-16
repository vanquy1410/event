'use server'

import { revalidatePath } from 'next/cache'

import { connectToDatabase } from '@/lib/database'
import Event from '@/lib/database/models/event.model'
import User from '@/lib/database/models/user.model'
import Category from '@/lib/database/models/category.model'
import { handleError } from '@/lib/utils'
import { auth } from '@clerk/nextjs';
import Notification from '@/lib/database/models/notification.model';

import {
  CreateEventParams,
  UpdateEventParams,
  DeleteEventParams,
  GetAllEventsParams,
  GetEventsByUserParams,
  GetRelatedEventsByCategoryParams,
} from '@/types'

const getCategoryByName = async (name: string) => {
  return Category.findOne({ name: { $regex: name, $options: 'i' } })
}

const populateEvent = (query: any) => {
  return query
    .populate({ path: 'organizer', model: User, select: '_id firstName lastName' })
    .populate({ path: 'category', model: Category, select: '_id name' })
}

// CREATE
export async function createEvent({ event, userId, path }: CreateEventParams) {
  try {
    await connectToDatabase()

    const organizer = await User.findById(userId)
    if (!organizer) throw new Error('Organizer not found')

    const newEvent = await Event.create({
      ...event,
      category: event.categoryId,
      organizer: userId
    })

    // Tạo thông báo mới
    await Notification.create({
      message: `Sự kiện mới "${newEvent.title}" đã được tạo`,
      eventId: newEvent._id
    });

    revalidatePath(path)

    return JSON.parse(JSON.stringify(newEvent))
  } catch (error) {
    handleError(error)
  }
}

// GET ONE EVENT BY ID
export async function getEventById(eventId: string) {
  try {
    await connectToDatabase()

    const event = await populateEvent(Event.findById(eventId))

    if (!event) throw new Error('Event not found')

    return JSON.parse(JSON.stringify(event))
  } catch (error) {
    handleError(error)
  }
}

// UPDATE
export async function updateEvent({ userId, event, path }: UpdateEventParams) {
  try {
    await connectToDatabase();

    const { sessionClaims } = auth();
 

    const eventToUpdate = await Event.findById(event._id);
    if (!eventToUpdate) {
      console.log("Event not found:", event._id);
      throw new Error('Event not found');
    }
    console.log("Event to update:", eventToUpdate);

    // Remove the authentication check
    // if (!isAdmin && eventToUpdate.organizer.toString() !== actualUserId) {
    //   console.log("Unauthorized: User is not admin and not the organizer");
    //   throw new Error('Unauthorized to update this event');
    // }

    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      { ...event },
      { new: true }
    );

    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedEvent));
  } catch (error) {
    console.error("Error in updateEvent:", error);
    handleError(error);
  }
}

// DELETE
export async function deleteEvent({ eventId, path }: DeleteEventParams) {
  try {
    await connectToDatabase()

    const deletedEvent = await Event.findByIdAndDelete(eventId)
    if (deletedEvent) revalidatePath(path)
  } catch (error) {
    handleError(error)
  }
}

// GET ALL EVENTS
export async function getAllEvents({
  query,
  category,
  page = 1,
  limit = 6,
  startDate,
  endDate,
  minPrice,
  maxPrice,
  isFree
}: GetAllEventsParams & {
  startDate?: string;
  endDate?: string;
  minPrice?: number;
  maxPrice?: number;
  isFree?: boolean;
}) {
  try {
    await connectToDatabase()

    const conditions: any = {}

    if (query) {
      conditions.title = { $regex: query, $options: 'i' }
    }

    if (category) {
      conditions.category = category
    }

    if (startDate) {
      conditions.startDateTime = { $gte: new Date(startDate) }
    }

    if (endDate) {
      conditions.endDateTime = { $lte: new Date(endDate) }
    }

    if (isFree) {
      conditions.isFree = true
    } else {
      if (minPrice !== undefined) {
        conditions.price = { $gte: minPrice }
      }

      if (maxPrice !== undefined) {
        conditions.price = { ...conditions.price, $lte: maxPrice }
      }
    }

    const skipAmount = (Number(page) - 1) * limit

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const events = await populateEvent(eventsQuery)
    const eventsCount = await Event.countDocuments(conditions)

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit)
    }
  } catch (error) {
    handleError(error)
  }
}

// GET EVENTS BY ORGANIZER
export async function getEventsByUser({ userId, limit = 6, page }: GetEventsByUserParams) {
  try {
    await connectToDatabase()

    const conditions = { organizer: userId }
    const skipAmount = (Number(page) - 1) * limit

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const events = await populateEvent(eventsQuery)
    const eventsCount = await Event.countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
  } catch (error) {
    handleError(error)
  }
}

// GET RELATED EVENTS: EVENTS WITH SAME CATEGORY
export async function getRelatedEventsByCategory({
  categoryId,
  eventId,
  limit = 3,
  page = 1,
}: GetRelatedEventsByCategoryParams) {
  try {
    await connectToDatabase()

    const skipAmount = (Number(page) - 1) * limit
    const conditions = { $and: [{ category: categoryId }, { _id: { $ne: eventId } }] }

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const events = await populateEvent(eventsQuery)
    const eventsCount = await Event.countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
  } catch (error) {
    handleError(error)
  }
}

// GET ALL EVENTS FOR ADMIN
export async function getAllEventsForAdmin() {
  try {
    await connectToDatabase()

    const events = await populateEvent(Event.find().sort({ createdAt: 'desc' }))

    return JSON.parse(JSON.stringify(events))
  } catch (error) {
    handleError(error)
  }
}

export async function getUpcomingEvents(limit: number = 5) {
  try {
    await connectToDatabase();

    const today = new Date();
    const events = await Event.find({ startDateTime: { $gte: today } })
      .select('title startDateTime imageUrl') // Thêm 'imageUrl' vào đây
      .sort({ startDateTime: 1 })
      .limit(limit)
      .lean();

    return JSON.parse(JSON.stringify(events));
  } catch (error) {
    console.error('Lỗi khi lấy sự kiện sắp diễn ra:', error);
    throw error;
  }
}

