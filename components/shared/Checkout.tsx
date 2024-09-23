import React, { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js';

import { IEvent } from '@/lib/database/models/event.model';
import { Button } from '../ui/button';
import { checkoutOrder, hasUserRegisteredForEvent } from '@/lib/actions/order.actions';
import { updateEvent } from '@/lib/actions/event.actions';
import { UpdateEventParams } from '@/types'; // Add this import

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const Checkout = ({ event, userId }: { event: IEvent; userId: string }) => {
  const [hasRegistered, setHasRegistered] = useState(false);

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.');
    }

    if (query.get('canceled')) {
      console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
    }

    // Check if user has already registered for the event
    const checkRegistration = async () => {
      const registered = await hasUserRegisteredForEvent(userId, event._id);
      setHasRegistered(registered);
    };

    checkRegistration();
  }, [event._id, userId]);

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
    await updateEvent({
      userId,
      event: {
        _id: event._id,
        currentParticipants: (event.currentParticipants || 0) + 1,
        // Remove the line that increases participantLimit
      } as UpdateEventParams['event'],
      path: `/events/${event._id}`
    })
  }

  return (
    <form action={onCheckout} method="post">
      {hasRegistered ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">You have already registered for this event.</span>
        </div>
      ) : (
        <Button type="submit" role="link" size="lg" className="button sm:w-fit">
          {event.isFree ? 'Get Ticket' : 'Buy Ticket'}
        </Button>
      )}
    </form>
  )
}

export default Checkout