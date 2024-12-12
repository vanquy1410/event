import EventForm from "@/components/shared/EventForm"
import { IOrganizer } from "@/types/organizer";
import { auth } from "@clerk/nextjs";

const CreateEvent = async () => {
  const { sessionClaims, getToken } = auth();
  const userId = sessionClaims?.userId as string;
  const baseUrl =  process.env.NEXT_PUBLIC_APP_URL;
  const token = await getToken();
  const response = await fetch(`${baseUrl}/api/organizer`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  const data = await response.json() ?? [];
  // approved events
  const eventsOrganizer = data?.filter((event: IOrganizer) => event?.status === 'approved');

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">Tạo sự kiện</h3>
      </section>

      <div className="wrapper my-8">
        <EventForm userId={userId} type="Create" eventsOrganizer={eventsOrganizer} />
      </div>
    </>
  )
}

export default CreateEvent