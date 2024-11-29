import { createOrder } from '@/lib/actions/order.actions';
import { NextResponse } from 'next/server';
import stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') as string;

    let event;
    try {
      event = stripeClient.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return NextResponse.json({ error: 'Webhook signature failed' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as stripe.Checkout.Session;
      
      // Log để debug
      console.log('Webhook received:', {
        eventType: event.type,
        metadata: session.metadata,
        amount: session.amount_total
      });

      if (!session?.metadata?.eventId || !session?.metadata?.buyerId) {
        throw new Error('Missing required metadata');
      }

      const order = await createOrder({
        eventId: session.metadata.eventId,
        buyerId: session.metadata.buyerId,
        selectedSeat: Number(session.metadata.selectedSeat),
        seatType: session.metadata.seatType,
        stripeId: session.id,
        totalAmount: (session.amount_total! / 100).toString(),
      });

      return NextResponse.json({ message: 'Order created successfully', order });
    }

    return NextResponse.json({ message: 'Event received' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}