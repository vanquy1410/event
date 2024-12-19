import React, { useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js';

import { IEvent } from '@/lib/database/models/event.model';
import { Button } from '../ui/button';
import { checkoutOrder } from '@/lib/actions/order.actions';
import { OrderData } from '@/types';

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const Checkout = ({ event, userId, selectedSeat }: { event: IEvent; userId: string; selectedSeat: number }) => {
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      window.location.reload();
    }
  }, []);

  const onCheckout = async () => {
    const order: OrderData = {
      eventTitle: event.title,
      eventId: event._id,
      price: event.price,
      isFree: event.isFree,
      buyerId: userId,
      selectedSeat: selectedSeat
    };

    await checkoutOrder(order);
  }

  return (
    <form action={onCheckout} method="post">
      <Button type="submit" role="link" size="lg" className="button sm:w-fit">
        {event.isFree ? 'Mua vé' : `Mua vé số ${selectedSeat + 1}`}
      </Button>
    </form>
  )
}

export default Checkout
