import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const MIN_AMOUNT = 10000; // Số tiền tối thiểu là 10,000 VND

export async function POST(req: Request) {
  try {
    const { amount, email } = await req.json();

    if (amount < MIN_AMOUNT) {
      return NextResponse.json(
        { 
          error: 'Số tiền thanh toán phải từ 10,000 VND trở lên' 
        }, 
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Không cần nhân 100 vì đã là VND
      currency: 'vnd',
      metadata: { email },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret 
    });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: 'Error creating payment intent' },
      { status: 500 }
    );
  }
} 