import { checkRole } from "@/utils/roles";
import Sidebar from "../organizer-dashboard/_components/Sidebar";
import { redirect } from "next/navigation";

export default function OrganizerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Kiểm tra quyền admin hoặc organizer
  if (!checkRole(["admin", "organizer"])) {
    return redirect("/");
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-gray-50 p-8">
        {children}
      </main>
    </div>
  );
} 