"use client"

import { IEvent } from '@/lib/database/models/event.model'
import { formatDateTime } from '@/lib/utils'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { DeleteConfirmation } from './DeleteConfirmation'
import { DeleteOrder } from './DeleteOrder'
import FavoriteButton from '@/components/shared/FavoriteButton'

type CardProps = {
  event: Partial<IEvent> & { _id: string; title: string; imageUrl?: string },
  hasOrderLink?: boolean,
  hidePrice?: boolean,
  orderId?: string,
  onFavoriteChange?: () => void
}

const Card = ({ event, hasOrderLink, hidePrice, orderId, onFavoriteChange }: CardProps) => {
  const { user } = useUser();
  const userId = user?.publicMetadata?.userId as string;

  const isEventCreator = userId === event.organizer?._id?.toString();

  return (
    <div className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
      <Link 
        href={`/events/${event._id}`}
        style={{ backgroundImage: `url(${event.imageUrl})` }}
        className="flex-center flex-grow bg-gray-50 bg-cover bg-center text-grey-500"
      />
      
      {isEventCreator && !hidePrice && (
        <div className="absolute right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all">
          <Link href={`/events/${event._id}/update`}>
            <Image src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
          </Link>

          <DeleteConfirmation eventId={event._id} />
        </div>
      )}

      {orderId && (
        <div className="absolute right-2 top-2 flex items-center gap-2 rounded-xl bg-white p-2 shadow-sm transition-all">
          <DeleteOrder orderId={orderId} />
        </div>
      )}

      <div className="flex min-h-[230px] flex-col gap-3 p-5 md:gap-4"> 
        <div className="flex justify-between items-center">
          {!hidePrice && event.isFree !== undefined && event.price !== undefined && (
            <div className="flex gap-2">
              <span className="p-semibold-14 w-min rounded-full bg-green-100 px-4 py-1 text-green-60">
                {event.isFree ? 'FREE' : `$${event.price}`}
              </span>
              {event.category?.name && (
                <p className="p-semibold-14 w-min rounded-full bg-grey-500/10 px-4 py-1 text-grey-500 line-clamp-1">
                  {event.category.name}
                </p>
              )}
            </div>
          )}
          {userId && (
            <FavoriteButton 
              eventId={event._id} 
              userId={userId} 
              onFavoriteChange={onFavoriteChange}
            />
          )}
        </div>

        <p className="p-medium-14 text-grey-500">
          {event.startDateTime ? formatDateTime(event.startDateTime).dateTime : 'Chưa có ngày'}
        </p>

        <Link href={`/events/${event._id}`}>
          <p className="p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-black">{event.title}</p>
        </Link>

        <div className="flex-between w-full">
          {event.organizer && (
            <p className="p-medium-14 md:p-medium-16 text-grey-600">
              {event.organizer.firstName} {event.organizer.lastName}
            </p>
          )}

          {hasOrderLink && (
            <Link href={`/orders?eventId=${event._id}`} className="flex gap-2">
              <p className="text-primary-500">Chi tiết đơn hàng</p>
              <Image src="/assets/icons/arrow.svg" alt="search" width={10} height={10} />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Card