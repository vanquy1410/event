"use server"

import { connectToDatabase } from "@/lib/database";
import Payment from "@/lib/database/models/payment.model";
import Organizer from "@/lib/database/models/organizer.model";
import { handleError } from "@/lib/utils";

export async function getAllPayments() {
  try {
    await connectToDatabase();

    const payments = await Payment.find({})
      .populate({
        path: 'organizerId',
        model: Organizer,
        select: 'name email phoneNumber location startDateTime endDateTime eventType participantLimit status'
      })
      .sort({ createdAt: -1 });

    const safePayments = await Promise.all(payments.map(async payment => {
      const organizer = payment.organizerId;
      
     return {
        _id: payment._id.toString(),
        organizerId: payment.organizerId?._id.toString(),
        eventTitle: payment.eventTitle,
        amount: payment.amount,
        status: payment.status,
        paymentDate: payment.paymentDate,
        createdAt: payment.createdAt,
        organizerInfo: organizer ? {
          name: organizer.name,
          email: organizer.email,
          phoneNumber: organizer.phoneNumber,
          location: organizer.location,
          startDateTime: organizer.startDateTime,
          endDateTime: organizer.endDateTime,
          eventType: organizer.eventType,
          participantLimit: organizer.participantLimit,
          status: organizer.status
        } : null
      };
    }));

    return JSON.parse(JSON.stringify(safePayments));
  } catch (error) {
    handleError(error);
  }
}

// Thêm các hàm khác nếu cần
export async function getPaymentsByOrganizerId(organizerId: string) {
  try {
    await connectToDatabase();

    const payments = await Payment.find({ organizerId })
      .sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(payments));
  } catch (error) {
    handleError(error);
  }
}

export async function getPaymentsByEmail(email: string) {
  try {
    await connectToDatabase();

    const payments = await Payment.find({ 'organizerInfo.email': email })
      .sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(payments));
  } catch (error) {
    handleError(error);
  }
} 