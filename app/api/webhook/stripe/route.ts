import { createOrder } from '@/lib/actions/order.actions';
import { NextResponse } from 'next/server';
import stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') as string;
    const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY!);
    
    console.log('Received webhook request');
    console.log('Signature:', signature);
    
    let event;
    try {
      event = stripeClient.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
      console.log('Event type:', event.type);
      console.log('Event data:', event.data.object);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return NextResponse.json({ error: 'Webhook signature failed' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as stripe.Checkout.Session;
      console.log('Session metadata:', session.metadata);
      
      if (!session.metadata) {
        console.error('No metadata found in session');
        return NextResponse.json({ error: 'No metadata found' }, { status: 400 });
      }

      const { eventId, buyerId, selectedSeat, seatType } = session.metadata;
      
      // Validate metadata
      if (!eventId || !buyerId || selectedSeat === undefined || !seatType) {
        console.error('Missing required metadata:', { eventId, buyerId, selectedSeat, seatType });
        return NextResponse.json({ error: 'Missing required metadata' }, { status: 400 });
      }

      const order = await createOrder({
        eventId,
        buyerId,
        selectedSeat: Number(selectedSeat),
        seatType,
        stripeId: session.id,
        totalAmount: (session.amount_total! / 100).toString(),
      });

      console.log('Created order:', order);
      return NextResponse.json({ message: 'Order created successfully', order });
    }

    return NextResponse.json({ message: 'Event received' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}