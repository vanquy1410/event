import React, { useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js';

import { IEvent } from '@/lib/database/models/event.model';
import { Button } from '../ui/button';
import { checkoutOrder } from '@/lib/actions/order.actions';
import { updateEvent } from '@/lib/actions/event.actions';

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const Checkout = ({ event, userId, selectedSeat }: { event: IEvent; userId: string; selectedSeat: number }) => {
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.');
    }

    if (query.get('canceled')) {
      console.log('Order canceled -- continue to shop around and checkout when youre ready.');
    }
  }, []);

  const onCheckout = async () => {
    const order = {
      eventTitle: event.title,
      eventId: event._id,
      price: event.price,
      isFree: event.isFree,
      buyerId: userId
    }

    await checkoutOrder(order);

    // After successful checkout
    const updatedSeats = [...(event.seats || [])];
    updatedSeats[selectedSeat] = true;

    await updateEvent({
      userId,
      event: {
        _id: event._id,
        currentParticipants: (event.currentParticipants || 0) + 1,
        seats: updatedSeats,
      },
      path: `/events/${event._id}`
    })
  }

  return (
    <form action={onCheckout} method="post">
      <Button type="submit" role="link" size="lg" className="button sm:w-fit">
        {event.isFree ? 'Get Ticket' : `Buy Ticket for Seat ${selectedSeat + 1}`}
      </Button>
    </form>
  )
}

export default Checkout