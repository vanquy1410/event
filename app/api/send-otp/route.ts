import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Kiểm tra biến môi trường với giá trị mặc định
const GMAIL_USER = process.env.GMAIL_USER || 'default@gmail.com';
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || 'default_password';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD,
  },
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('SMTP connection error:', error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

// Lưu trữ OTP tạm thời
const otpStore = new Map<string, { otp: string; expires: number }>();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    // Tạo mã OTP ngẫu nhiên 6 số
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Lưu OTP với thời gian hết hạn 5 phút
    otpStore.set(email, {
      otp,
      expires: Date.now() + 5 * 60 * 1000
    });

    // Gửi email
    await transporter.sendMail({
      from: `"Hệ thống thanh toán" <${GMAIL_USER}>`,
      to: email,
      subject: 'Mã xác thực thanh toán',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Xác thực thanh toán</h2>
          <p>Mã xác thực của bạn là: <strong>${otp}</strong></p>
          <p>Mã xác thực chỉ có hiệu lực trong 5 phút.</p>
          <p>Nếu bạn không yêu cầu xác thực, vui lòng bỏ qua thông báo này.</p>
        </div>
      `,
    });

    return NextResponse.json({ message: 'Mã xác thực đã được gửi đến email của bạn.' });
  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    return NextResponse.json({ error: 'Có lỗi xảy ra khi gửi email.' }, { status: 500 });
  }
} 