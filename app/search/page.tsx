import { Suspense } from 'react';
import AdvancedSearch from '@/components/shared/AdvancedSearch';
import Collection from '@/components/shared/Collection';
import { getAllEvents } from '@/lib/actions/event.actions';

export default async function SearchPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const page = Number(searchParams?.page) || 1;
  const events = await getAllEvents({
    query: searchParams.query as string,
    category: searchParams.category as string,
    page,
    limit: 6
  });

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h1 className="wrapper h1-bold text-center sm:text-left">Kết quả tìm kiếm</h1>
      </section>

      <section className="wrapper my-8">
        <AdvancedSearch />

        <Suspense fallback={<div>Đang tải...</div>}>
          <Collection 
            data={events?.data}
            emptyTitle="Không tìm thấy sự kiện nào"
            emptyStateSubtext="Hãy thử tìm kiếm khác"
            collectionType="All_Events"
            limit={6}
            page={page}
            totalPages={events?.totalPages}
          />
        </Suspense>
      </section>
    </>
  );
}
