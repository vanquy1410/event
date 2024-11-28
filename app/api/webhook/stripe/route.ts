import { createOrder } from '@/lib/actions/order.actions';
import { NextResponse } from 'next/server';
import stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') as string;
    const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY!);

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (error) {
      return NextResponse.json({ error: 'Webhook signature failed' }, { status: 400 });
    }

    // Xử lý sự kiện thanh toán thành công
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as stripe.Checkout.Session;
      const { eventId, buyerId, selectedSeat, seatType } = session.metadata!;

      // Tạo order mới
      const order = await createOrder({
        eventId,
        buyerId,
        selectedSeat: Number(selectedSeat),
        seatType,
        stripeId: session.id,
        totalAmount: session.amount_total!.toString(),
        });

      return NextResponse.json({ message: 'Order created successfully', order });
    }

    return NextResponse.json({ message: 'Event received' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}