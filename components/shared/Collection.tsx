import { IEvent } from '@/lib/database/models/event.model'
import { IOrder } from '@/lib/database/models/order.model'
import React from 'react'
import Card from './Card'
import Pagination from './Pagination'
import FavoriteButton from './FavoriteButton'

type CollectionProps = {
  data: IEvent[] | IOrder[],
  emptyTitle: string,
  emptyStateSubtext: string,
  limit: number,
  page: number | string,
  totalPages?: number,
  urlParamName?: string,
  collectionType?: 'Events_Organized' | 'My_Tickets' | 'All_Events',
  onFavoriteChange?: () => void
}

const Collection = ({
  data,
  emptyTitle,
  emptyStateSubtext,
  page,
  totalPages = 0,
  collectionType,
  urlParamName,
  onFavoriteChange
}: CollectionProps) => {
  return (
    <>
      {data && data.length > 0 ? (
        <div className="flex flex-col items-center gap-10">
          <ul className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10">
            {data.map((item) => {
              const hasOrderLink = collectionType === 'Events_Organized';
              const hidePrice = collectionType === 'My_Tickets';
              
              // Check if the item is an IOrder or IEvent
              const event = 'event' in item ? item.event : item;
              const orderId = 'event' in item ? item._id : undefined;

              // Add a null check for the event
              if (!event) return null;

              return (
                <li key={event._id?.toString() || orderId?.toString()} className="flex justify-center">
                  <Card 
                    event={event as IEvent} 
                    hasOrderLink={hasOrderLink} 
                    hidePrice={hidePrice}
                    orderId={orderId?.toString()}
                    onFavoriteChange={onFavoriteChange}
                  />
                </li>
              )
            })}
          </ul>

          {totalPages > 1 && (
            <Pagination urlParamName={urlParamName} page={page} totalPages={totalPages} />
          )}
        </div>
      ): (
        <div className="flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-[14px] bg-grey-50 py-28 text-center">
          <h3 className="p-bold-20 md:h5-bold">{emptyTitle}</h3>
          <p className="p-regular-14">{emptyStateSubtext}</p>
        </div>
      )} 
    </>
  )
}

export default Collection