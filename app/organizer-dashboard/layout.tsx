import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Sidebar from "../organizer-dashboard/_components/Sidebar";
import { Toaster } from 'react-hot-toast';

export default function OrganizerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessionClaims } = auth();
  const userRole = sessionClaims?.metadata.role as string;

  if (userRole !== 'admin' && userRole !== 'organizer') {
    return redirect("/");
  }

  return (
    <>
      <Toaster />
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-gray-50 p-8">
          {children}
        </main>
      </div>
    </>
  );
} 