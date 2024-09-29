"use client"

import { IEvent } from '@/lib/database/models/event.model'
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import Checkout from './Checkout'
import SeatSelectionPopup from './SeatSelectionPopup'

const CheckoutButton = ({ event }: { event: IEvent }) => {
  const { user } = useUser();
  const userId = user?.publicMetadata.userId as string;
  const hasEventFinished = new Date(event.endDateTime) < new Date();
  const isEventFull = event.currentParticipants >= event.participantLimit;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  const handleSeatSelection = (seat: number) => {
    setSelectedSeat(seat);
  };

  return (
    <div className="flex items-center gap-3">
      {hasEventFinished ? (
        <p className="p-2 text-red-400">Sorry, tickets are no longer available.</p>
      ) : isEventFull ? (
        <p className="p-2 text-red-400">Sorry, this event is fully booked.</p>
      ) : (
        <>
          <SignedOut>
            <Button asChild className="button rounded-full" size="lg">
              <Link href="/sign-in">
                Get Tickets
              </Link>
            </Button>
          </SignedOut>

          <SignedIn>
            <Button onClick={() => setIsPopupOpen(true)} className="button rounded-full" size="lg">
              Select Seat
            </Button>
            <SeatSelectionPopup
              isOpen={isPopupOpen}
              onClose={() => setIsPopupOpen(false)}
              participantLimit={event.participantLimit}
              seats={event.seats || []}
              onSeatSelect={handleSeatSelection}
            />
            {selectedSeat !== null && (
              <Checkout event={event} userId={userId} selectedSeat={selectedSeat} />
            )}
          </SignedIn>
        </>
      )}
    </div>
  )
}

export default CheckoutButton