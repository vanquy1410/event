import Collection from '@/components/shared/Collection'
import { Button } from '@/components/ui/button'
import { getEventsByUser } from '@/lib/actions/event.actions'
import { getOrdersByUser } from '@/lib/actions/order.actions'
import { IOrder, SearchParamProps } from '@/types'
import { auth } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'
import TicketList from '@/components/shared/TicketList'
import { UrlObject } from 'url'

const ProfilePage = async ({ searchParams }: SearchParamProps) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  const ordersPage = Number(searchParams?.ordersPage) || 1;
  const eventsPage = Number(searchParams?.eventsPage) || 1;

  const ordersData = await getOrdersByUser({ userId, page: ordersPage, limit: 10 })
  const orders = ordersData?.data || []
  const ordersTotalPages = ordersData?.totalPages || 1

  const organizedEvents = await getEventsByUser({ userId, page: eventsPage })

  return (
    <>
      {/* My Tickets */}
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className='h3-bold text-center sm:text-left'>Vé của tôi</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/#events">
              Xem thêm sự kiện
            </Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <TicketList 
          userId={userId}
          orders={orders}
          page={ordersPage}
          totalPages={ordersTotalPages}
        />     
      </section>

      {/* Events Organized */}
      {/* <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className='h3-bold text-center sm:text-left'>Sự kiện đã tổ chức</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/events/create">
              Create New Event
            </Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection 
          data={organizedEvents?.data || []}
          emptyTitle="No events have been created yet"
          emptyStateSubtext="Go create some now"
          collectionType="Events_Organized"
          limit={3}
          page={eventsPage}
          urlParamName="eventsPage"
          totalPages={organizedEvents?.totalPages}
        />
      </section> */}
    </>
  )
}

export default ProfilePage