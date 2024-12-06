import { connectToDatabase } from "@/lib/database";
import Payment from "@/lib/database/models/payment.model";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    await connectToDatabase();

    // Log để debug
    console.log('Searching for email:', email);

    // Lấy tất cả payment không filter
    const payments = await Payment.find().sort({ createdAt: -1 });
    
    // Log để kiểm tra payments
    console.log('All payments:', payments);

    return new Response(JSON.stringify(payments), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error in GET /api/payments:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 