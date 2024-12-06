import { connectToDatabase } from "@/lib/database";
import Payment from "@/lib/database/models/payment.model";

export async function getPaymentsByOrganizerId(organizerId: string) {
  try {
    await connectToDatabase();

    const payments = await Payment.find({ organizerId })
      .sort({ paymentDate: -1 }) // Sắp xếp theo thời gian mới nhất
      .lean();

    return JSON.parse(JSON.stringify(payments));
  } catch (error) {
    console.error("Error getting payments:", error);
    throw error;
  }
} 