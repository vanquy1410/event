import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import Organizer from '@/lib/database/models/organizer.model';
import Payment from '@/lib/database/models/payment.model';

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { organizerId, eventTitle, price, signature, paymentIntentId, email } = await req.json();
    
    // Thêm log để kiểm tra
    console.log("Creating payment with organizerId:", organizerId);

    // Cập nhật trạng thái thanh toán cho organizer
    const updatedOrganizer = await Organizer.findByIdAndUpdate(
      organizerId,
      { 
        $set: { 
          paymentStatus: 'paid',
          digitalSignature: signature
        } 
      },
      { new: true }
    );

    if (!updatedOrganizer) {
      console.log("Không tìm thấy organizer với ID:", organizerId);
      return NextResponse.json(
        { error: 'Không tìm thấy thông tin ban tổ chức' },
        { status: 404 }
      );
    }

    // Tạo bản ghi thanh toán mới
    const payment = await Payment.create({
      organizerId: organizerId.toString(),
      eventTitle,
      amount: price * 1000,
      status: 'success',
      paymentDate: new Date(),
      paymentMethod: 'card',
      paymentIntentId,
      email
    });

    console.log("Created payment:", payment);

    return NextResponse.json({
      success: true,
      paymentId: payment._id.toString(),
      message: 'Thanh toán thành công'
    });

  } catch (error) {
    console.error('Lỗi khi xử lý thanh toán:', error);
    return NextResponse.json(
      { error: 'Lỗi khi xử lý thanh toán' },
      { status: 500 }
    );
  }
} 