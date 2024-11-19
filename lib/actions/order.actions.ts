"use server"

import Stripe from 'stripe';
import { 
  CheckoutOrderParams, 
  CreateOrderParams, 
  GetOrdersByEventParams, 
  GetOrdersByUserParams, 
  Order
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

export const checkoutOrder = async (order: CheckoutOrderParams) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const price = order.isFree ? 0 : Number(order.price) * 100;

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: price,
            product_data: {
              name: order.eventTitle
            }
          },
          quantity: 1
        },
      ],
      metadata: {
        eventId: order.eventId,
        buyerId: order.buyerId,
        selectedSeat: order.selectedSeat,
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

export const createOrder = async (order: CreateOrderParams): Promise<Order | null> => {
  try {
    await connectToDatabase();
    
    const event = await Event.findById(order.eventId);
    const buyer = await User.findById(order.buyerId);
    
    if (!event || !buyer) {
      throw new Error('Event or Buyer not found');
    }
    
    // Cập nhật ghế đã chọn
    const updatedSeats = [...(event.seats || [])];
    if (order.selectedSeat !== undefined) {
      updatedSeats[order.selectedSeat] = true; // Đánh dấu ghế đã chọn
    }

    // Tạo đơn hàng
    const newOrder = await OrderModel.create({
      ...order,
      event: order.eventId,
      buyer: order.buyerId,
      eventTitle: event.title,
      buyerName: `${buyer.firstName} ${buyer.lastName}`,
      username: buyer.username,
      selectedSeat: order.selectedSeat, // Lưu ghế đã chọn
    });

    // Cập nhật sự kiện với ghế đã chọn
    await updateEvent({
      userId: buyer._id, // Sử dụng ID của người mua
      event: {
        _id: event._id,
        currentParticipants: (event.currentParticipants || 0) + 1, // Tăng số lượng người tham gia
        seats: updatedSeats,
      },
      path: `/events/${event._id}`
    });

    return JSON.parse(JSON.stringify(newOrder));
  } catch (error) {
    handleError(error);
    return null; // Trả về null nếu có lỗi
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
  limit = 10,
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
