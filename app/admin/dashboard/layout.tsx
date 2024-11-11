import { checkRole } from "@/utils/roles";
import Sidebar from "./_component/Sidebar";
import Link from "next/link";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!checkRole("admin") && !checkRole("organizer")) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-20 py-10 rounded-lg relative max-w-md mx-auto">
          <strong className="font-bold">Không có quyền truy cập!<br/></strong>
          <span className="block sm:inline text-center">Bạn cần quyền admin hoặc organizer để xem trang này.</span>
          <div className="mt-4">
            <Link href="/" className="inline-block bg-purple-500 text-white py-1 px-2 rounded hover:bg-purple-600">
              Quay về Trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[hsl(192.9,82.3%,31%)]">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto bg-white m-4 rounded-xl shadow-lg">
        {children}
      </main>
    </div>
  );
}
