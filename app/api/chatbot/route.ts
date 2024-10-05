import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { message } = await req.json();

  const reply = `Bạn đã gửi: "${message}". Đây là phản hồi từ chatbot.`;

  return NextResponse.json({ reply });
}