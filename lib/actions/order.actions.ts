"use server"

import Stripe from 'stripe';
import { 
  CheckoutOrderParams, 
  CreateOrderParams, 
  GetOrdersByEventParams, 
  GetOrdersByUserParams, 
  Order,
  OrderData,
  IOrderItem
} from "@/types";
import { redirect } from 'next/navigation';
import { handleError } from '../utils';
import { connectToDatabase } from '../database';
import OrderModel from '../database/models/order.model';
import Event from '../database/models/event.model';
import { ObjectId } from 'mongodb';
import User from '../database/models/user.model';
import { revalidatePath } from 'next/cache';
import { updateEvent } from './event.actions';
import CancelNotification from '../database/models/cancelNotification.model'
import Image from 'next/image';
import { formatDateTime } from '../utils';
import mongoose from 'mongoose';

export const checkoutOrder = async (order: OrderData) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'vnd',
            unit_amount: Number(order.price),
            product_data: {
              name: order.eventTitle,
              description: `Ghế số ${order.selectedSeat + 1}`
            }
          },
          quantity: 1
        },
      ],
      metadata: {
        eventId: order.eventId,
        buyerId: order.buyerId,
        selectedSeat: order.selectedSeat.toString()
      },
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    });

    redirect(session.url!);
  } catch (error) {
    throw error;
  }
}

export const createOrder = async (orderData: {
  eventId: string;
  buyerId: string;
  selectedSeat: number;
  stripeId: string;
  totalAmount: string;
}): Promise<Order | null> => {
  try {
    await connectToDatabase();
    
    const event = await Event.findById(orderData.eventId);
    if (!event) throw new Error('Event not found');

    // Cập nhật trạng thái ghế
    const updatedSeats = [...event.seats];
    updatedSeats[orderData.selectedSeat] = true;
    
    // Cập nhật số người tham gia
    const updatedParticipants = (event.currentParticipants || 0) + 1;

    // Cập nhật event
    await Event.findByIdAndUpdate(orderData.eventId, {
      seats: updatedSeats,
      currentParticipants: updatedParticipants
    });

    // Tạo order mới
    const newOrder = await OrderModel.create({
      stripeId: orderData.stripeId,
      totalAmount: orderData.totalAmount,
      event: orderData.eventId,
      buyer: orderData.buyerId,
      selectedSeat: orderData.selectedSeat
    });

    return JSON.parse(JSON.stringify(newOrder));
  } catch (error) {
    handleError(error);
    return null;
  }
}

// GET ORDERS BY EVENT
export async function getOrdersByEvent({ searchString, eventId }: GetOrdersByEventParams) {
  try {
    await connectToDatabase()

    if (!eventId) throw new Error('Event ID is required')
    const eventObjectId = new ObjectId(eventId)

    const orders = await OrderModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'buyer',
          foreignField: '_id',
          as: 'buyer',
        },
      },
      {
        $unwind: '$buyer',
      },
      {
        $lookup: {
          from: 'events',
          localField: 'event',
          foreignField: '_id',
          as: 'event',
        },
      },
      {
        $unwind: '$event',
      },
      {
        $project: {
          _id: 1,
          totalAmount: 1,
          createdAt: 1,
          eventTitle: '$event.title',
          eventId: '$event._id',
          buyer: {
            $concat: ['$buyer.firstName', ' ', '$buyer.lastName'],
          },
        },
      },
      {
        $match: {
          $and: [{ eventId: eventObjectId }, { buyer: { $regex: RegExp(searchString, 'i') } }],
        },
      },
    ])

    return JSON.parse(JSON.stringify(orders))
  } catch (error) {
    handleError(error)
  }
}

// GET ORDERS BY USER
export async function getOrdersByUser({
  userId,
  limit = 3,
  page,
}: {
  userId: string
  limit?: number
  page: number
}) {
  try {
    await connectToDatabase()

    const skipAmount = (page - 1) * limit

    const conditions = { buyer: userId }

    const orders = await OrderModel.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)
      .populate({
        path: 'event',
        model: Event,
        populate: {
          path: 'organizer',
          model: User,
          select: '_id firstName lastName',
        },
      })

    const ordersCount = await OrderModel.countDocuments(conditions)

    return {
      data: JSON.parse(JSON.stringify(orders)),
      totalPages: Math.ceil(ordersCount / limit),
    }
  } catch (error) {
    handleError(error)
    return { data: [], totalPages: 0 }
  }
}

export async function getAllOrders({
  query,
  limit = 10,
  page = 1,
}: {
  query?: string;
  limit?: number;
  page?: number;
}) {
  try {
    await connectToDatabase();

    const skipAmount = (page - 1) * limit;

    const conditions = query
      ? {
          $or: [
            { eventTitle: { $regex: query, $options: 'i' } },
            { buyerName: { $regex: query, $options: 'i' } },
            { username: { $regex: query, $options: 'i' } },
          ],
        }
      : {};

    const orders = await OrderModel.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit);

    const ordersCount = await OrderModel.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(orders)),
      totalPages: Math.ceil(ordersCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

export async function deleteOrder({ orderId, path }: { orderId: string; path: string }) {
  try {
    await connectToDatabase();

    const deletedOrder = await OrderModel.findByIdAndDelete(orderId);

    if (deletedOrder) revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}

export async function deleteOrderClient(orderId: string) {
  try {
    await connectToDatabase();

    const deletedOrder = await OrderModel.findByIdAndDelete(orderId);

    return deletedOrder; // Trả về đơn hàng đã xóa
  } catch (error) {
    handleError(error);
  }
}

export async function cancelOrder({ orderId }: { orderId: string }) {
  try {
    await connectToDatabase();

    const order = await OrderModel.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const event = await Event.findById(order.event);
    if (!event) {
      throw new Error('Event not found');
    }

    const buyer = await User.findById(order.buyer);
    if (!buyer) {
      throw new Error('Buyer not found');
    }

    // Tạo thông báo hủy vé
    await CancelNotification.create({
      orderId: order._id,
      userId: order.buyer,
      userEmail: buyer.email,
      eventTitle: event.title,
      ticketPrice: order.totalAmount,
      message: `Vé sự kiện "${event.title}" đã được hủy bởi người dùng ${buyer.firstName} ${buyer.lastName}`
    });

    // Cập nhật ghế đã hủy
    const updatedSeats = [...(event.seats || [])];
    if (order.selectedSeat !== undefined) {
      updatedSeats[order.selectedSeat] = false;
    }
    
    await updateEvent({
      userId: order.buyer,
      event: {
        _id: event._id,
        currentParticipants: (event.currentParticipants || 0) - 1,
        seats: updatedSeats,
      },
      path: `/events/${event._id}`
    });
    
    await OrderModel.findByIdAndDelete(orderId);

  } catch (error) {
    handleError(error);
  }
}

// GET ORDERS BY EVENT ID
export async function getOrdersByEventId({
  eventId,
  limit = 3,
  page,
}: {
  eventId: string
  limit?: number
  page: number
}) {
  try {
    await connectToDatabase()

    const skipAmount = (page - 1) * limit

    const conditions = { 
      event: new mongoose.Types.ObjectId(eventId)
     }

    const orders = await OrderModel.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)
      .populate({
         path: 'buyer',
          model: User,
          select: '_id firstName lastName',
      })
        

    const ordersCount = await OrderModel.countDocuments(conditions)

    return {
      data: JSON.parse(JSON.stringify(orders)),
      totalPages: Math.ceil(ordersCount / limit),
    }
  } catch (error) {
    handleError(error)
    return { data: [], totalPages: 0 }
  }
}
