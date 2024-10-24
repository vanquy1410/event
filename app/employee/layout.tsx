import { checkRole } from "@/utils/roles";
import Link from "next/link";
import Sidebar from "./_components/Sidebar";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!checkRole(["employee", "admin"])) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-20 py-10 rounded-lg relative max-w-md mx-auto">
          <strong className="font-bold">Không có quyền truy cập!<br/></strong>
          <span className="block sm:inline text-center">Bạn cần quyền employee để xem trang này.</span>
          <div className="mt-4">
            <Link href="/" className="inline-block bg-purple-500 text-white py-1 px-2 rounded hover:bg-purple-600 transition-colors duration-200 ease-in-out transform hover:-translate-y-1 hover:scale-110">Quay về Trang chủ</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
