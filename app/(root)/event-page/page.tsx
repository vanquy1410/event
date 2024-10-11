import CategoryFilter from '@/components/shared/CategoryFilter';
import Collection from '@/components/shared/Collection'
import { Button } from '@/components/ui/button'
import { getAllEvents } from '@/lib/actions/event.actions';
import { SearchParamProps } from '@/types';
import Image from 'next/image'
import Link from 'next/link'
import AdvancedSearch from '@/components/shared/AdvancedSearch';
import UpcomingEvents from '@/components/shared/UpcomingEvents';
import { getUpcomingEvents } from '@/lib/actions/event.actions';
// import ChatbotScript from '@/components/shared/Chatbot';


export default async function Home({ searchParams }: SearchParamProps) {
  const page = Number(searchParams?.page) || 1;
  const searchText = (searchParams?.query as string) || '';
  const category = (searchParams?.category as string) || '';
  const startDate = searchParams?.startDate as string;
  const endDate = searchParams?.endDate as string;
  const minPrice = searchParams?.minPrice ? Number(searchParams.minPrice) : undefined;
  const maxPrice = searchParams?.maxPrice ? Number(searchParams.maxPrice) : undefined;
  const isFree = searchParams?.isFree === 'true'; // Thêm dòng này

  const events = await getAllEvents({
    query: searchText,
    category,
    page,
    limit: 6,
    startDate,
    endDate,
    minPrice,
    maxPrice,
    isFree // Thêm tham số này
  })

  const upcomingEvents = await getUpcomingEvents(5);

  return (
    <>
      {/* <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">Evently - Chắp cánh cho mọi ý tưởng sự kiện</h1>
            <p className="p-regular-20 md:p-regular-24">Từ ý tưởng đến hiện thực, Evently là người bạn đồng hành đáng tin cậy trong mọi sự kiện của bạn.</p>
            <Button size="lg" asChild className="button w-full sm:w-fit">
              <Link href="#events">
                Khám phá ngay
              </Link>
            </Button>
          </div>

          <Image 
            src="/assets/images/hero.png"
            alt="hero"
            width={1000}
            height={1000}
            className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"
          />
        </div>
      </section>  */}

      <section id="events" className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <h2 className="h2-bold">Khám phá Sự kiện</h2>

        <div className="flex w-full flex-col gap-5 md:flex-row">
          <div className="flex-1 w-full md:w-1/2">
            <AdvancedSearch />
          </div>
          <div className="flex-1 w-full md:w-1/2">
            <CategoryFilter />
          </div>
        </div>

        <Collection 
          data={events?.data}
          emptyTitle="Không tìm thấy sự kiện nào"
          emptyStateSubtext="Hãy thử tìm kiếm khác"
          collectionType="All_Events"
          limit={6}
          page={page}
          totalPages={events?.totalPages}
        />
      </section>

      {/* <section className="wrapper my-8 flex flex-col gap-8 md:flex-row">
        <div className="flex-1">
          <Collection 
            data={events?.data}
            emptyTitle="Không tìm thấy sự kiện nào"
            emptyStateSubtext="Hãy thử tìm kiếm khác"
            collectionType="All_Events"
            limit={6}
            page={page}
            totalPages={events?.totalPages}
          />
        </div>
        <div className="w-full md:w-1/3">
          <UpcomingEvents events={upcomingEvents} />
        </div>
      </section> */}
    </>
  )
}