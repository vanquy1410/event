import CheckoutButton from '@/components/shared/CheckoutButton';
import Collection from '@/components/shared/Collection';
import { getEventById, getRelatedEventsByCategory } from '@/lib/actions/event.actions'
import { formatDateTime } from '@/lib/utils';
import { SearchParamProps } from '@/types'
import Image from 'next/image';
import ReviewForm from '@/components/shared/ReviewForm';
import ReviewList from '@/components/shared/ReviewList';
import { getReviewsByEvent } from '@/lib/actions/review.actions';
import { auth, currentUser } from "@clerk/nextjs";

const EventDetails = async ({ params, searchParams }: SearchParamProps) => {
  const event = await getEventById(params.id);

  if (!event) {
    // Handle the case where the event is not found
    return <div>Event not found</div>;
  }

  let relatedEvents = null;
  if (event.category?._id) {
    relatedEvents = await getRelatedEventsByCategory({
      categoryId: event.category._id.toString(),
      eventId: event._id.toString(),
      page: searchParams.page as string,
    });
  }

  const reviews = await getReviewsByEvent(params.id);
  const { userId } = auth();
  const user = await currentUser();

  return (
    <>
    <section className="flex justify-center bg-primary-50 bg-dotted-pattern bg-contain">
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl">
        <Image 
          src={event.imageUrl}
          alt="hero image"
          width={1000}
          height={1000}
          className="h-full min-h-[300px] object-cover object-center"
        />

        <div className="flex w-full flex-col gap-8 p-5 md:p-10">
          <div className="flex flex-col gap-6">
            <h2 className='h2-bold'>{event.title}</h2>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex gap-3">
                <p className="p-bold-20 rounded-full bg-green-500/10 px-5 py-2 text-green-700">
                  {event.isFree ? 'FREE' : `$${event.price}`}
                </p>
                <p className="p-medium-16 rounded-full bg-grey-500/10 px-4 py-2.5 text-grey-500">
                  {event.category?.name || 'Uncategorized'}
                </p>
              </div>

              <p className="p-medium-18 ml-2 mt-2 sm:mt-0">
                by{' '}
                <span className="text-primary-500">
                  {event.organizer?.firstName} {event.organizer?.lastName}
                </span>
              </p>
            </div>
          </div>

          <CheckoutButton event={event} />

          <div className="flex flex-col gap-5">
            <div className='flex gap-2 md:gap-3'>
              <Image src="/assets/icons/calendar.svg" alt="calendar" width={32} height={32} />
              <div className="p-medium-16 lg:p-regular-20 flex flex-wrap items-center">
                <p>
                  {event.startDateTime ? formatDateTime(event.startDateTime).dateTime : 'Chưa có ngày'}
                </p>
                <p>
                  {event.endDateTime ? formatDateTime(event.endDateTime).dateTime : 'Chưa có ngày'}
                </p>
              </div>
            </div>

            <div className="p-regular-20 flex items-center gap-3">
              <Image src="/assets/icons/location.svg" alt="location" width={32} height={32} />
              <p className="p-medium-16 lg:p-regular-20">{event.location}</p>
            </div>

            {/* Updated section to display participant limit with new icon */}
            <div className="p-regular-20 flex items-center gap-3">
              <Image src="/assets/icons/participant.svg" alt="participants" width={32} height={32} />
              <p className="p-medium-16 lg:p-regular-20">
                {event.currentParticipants} / {event.participantLimit} người tham dự
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="p-bold-20 text-grey-600">Nội dung:</p>
            <p className="p-medium-16 lg:p-regular-18">{event.description}</p>
            {/* <p className="p-medium-16 lg:p-regular-18 truncate text-primary-500 underline">{event.url}</p> */}
          </div>
        </div>
      </div>
    </section>
    <div className="wrapper my-8">
      <h2 className="h2-bold mb-4">Đánh giá</h2>
      <ReviewList reviews={reviews} />
      {userId && user && (
        <ReviewForm 
          eventId={params.id} 
          userId={userId}
          userFirstName={user.firstName ?? ''}
          userLastName={user.lastName ?? ''}
        />
      )}
    </div>
    {/* EVENTS with the same category */}
    <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
      <h2 className="h2-bold">Sự kiện liên quan</h2>

      <Collection 
          data={relatedEvents?.data}
          emptyTitle="Không có sự kiện liên quan"
          emptyStateSubtext="Hãy quay lại sau"
          collectionType="All_Events"
          limit={3}
          page={searchParams.page as string}
          totalPages={relatedEvents?.totalPages}
        />
    </section>

    
    </>
  )
}

export default EventDetails