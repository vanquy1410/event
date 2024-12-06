import { connectToDatabase } from "@/lib/database";
import Payment from "@/lib/database/models/payment.model";
import Organizer from "@/lib/database/models/organizer.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { organizerId: string } }
) {
  try {
    await connectToDatabase();

    const { organizerId } = params;
    const includeOrganizerInfo = req.nextUrl.searchParams.get('includeOrganizerInfo') === 'true';

    const payments = await Payment.find({ organizerId })
      .sort({ paymentDate: -1 })
      .lean();

    if (includeOrganizerInfo) {
      // Lấy thông tin chi tiết từ collection Organizer
      const paymentsWithInfo = await Promise.all(
        payments.map(async (payment) => {
          const organizerInfo = await Organizer.findOne({
            email: payment.email
          }).lean();

          return {
            ...payment,
            organizerInfo
          };
        })
      );

      return NextResponse.json(paymentsWithInfo);
    }

    return NextResponse.json(payments);
  } catch (error) {
    console.error("Error getting payments:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 