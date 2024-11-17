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
import HomeSlider from '@/components/shared/HomeSlider';
import RoadTree from '@/components/shared/RoadTree';

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
      <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">Evently - Chắp cánh cho mọi ý tưởng sự kiện</h1>
            <p className="p-regular-20 md:p-regular-24">Từ ý tưởng đến hiện thực, Evently là người bạn đồng hành đáng tin cậy trong mọi sự kiện của bạn.</p>
            <Button size="lg" asChild className="button w-full sm:w-fit">
              <Link href="/event-page">
                Khám phá ngay
              </Link>
            </Button>
          </div>

          <Image 
            src="/assets/images/unnamed.png"
            alt="hero"
            width={1000}
            height={1000}
            className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"
          />
           
        </div>

        <div className="wrapper my-8 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2">
            <Image 
              src="/assets/images/eventimg.jpg"
              alt="event"
              width={1000}
              height={1000}
              className="max-h-[70vh] object-contain object-center"
            />
          </div>
          <div className="md:w-1/2 p-4">
            <p className="p-regular-20 md:p-regular-24 text-justify">
              Trang web sự kiện của chúng tôi là điểm đến hoàn hảo để bạn khám phá và tham gia các sự kiện công nghệ đẳng cấp. Với giao diện thân thiện và thông tin cập nhật liên tục, bạn dễ dàng tìm kiếm những sự kiện phù hợp với sở thích. Đăng ký nhanh chóng, trải nghiệm mượt mà và không bỏ lỡ cơ hội kết nối với những chuyên gia hàng đầu trong ngành. Truy cập ngay để trở thành một phần của những sự kiện công nghệ ấn tượng!
            </p>
          </div>
        </div>
      </section> 
      

      <section className="wrapper my-8">
        <h2 className="h2-bold mb-4">Các chủ đề sự kiện phổ biến</h2>
        <HomeSlider />
      </section>

      <section className="wrapper my-8">
        <h2 className="h2-bold mb-4">Từ khóa tìm kiếm phổ biến</h2>
        <div className="flex flex-wrap gap-4">
          <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full">Sự kiện công nghệ</span>
          <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full">Hội thảo</span>
          <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full">Khóa học</span>
          <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full">Triển lãm</span>
          <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full">Webinar</span>
          <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full">Networking</span>
        </div>
      </section>

      <section className="wrapper my-8 flex flex-col gap-8 md:flex-row">
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
      </section>
      
      <section className="wrapper my-12">
        <h2 className="h2-bold mb-4">Khám Phá Evently</h2>
        <RoadTree />
      </section>
    </>
  )
}