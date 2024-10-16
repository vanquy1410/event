import { redirect } from "next/navigation";
import { checkRole } from "@/utils/roles";

import { setRole } from "./_actions";
import { SearchUsers } from "./_search-users";
import { clerkClient } from "@clerk/nextjs/server";
import Link from "next/link";
import NotificationList from './_component/NotificationList';

// Hàm waitFor để tạo một thời gian chờ
const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default async function AdminDashboard(params: {
  searchParams: { search?: string };
}) {
  if (!checkRole(["admin", "organizer"])) {
    // Hiển thị thông báo không có quyền truy cập
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-20 py-10 rounded-lg relative max-w-md mx-auto">
          <strong className="font-bold">Không có quyền truy cập!<br/></strong>
          <span className="block sm:inline text-center">Bạn cần quyền admin hoặc employee để xem trang này.</span>
          <div className="mt-4">
            <Link href="/" className="inline-block bg-purple-500 text-white py-1 px-2 rounded hover:bg-purple-600 transition-colors duration-200 ease-in-out transform hover:-translate-y-1 hover:scale-110">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }
  const query = params.searchParams.search;

  // Directly assign the result of getUserList to users without accessing .data
  const users = query ? await clerkClient.users.getUserList({ query }) : [];

  return (
    <>
      <h1>Đây là trang admin</h1>
      <br />
      <p>Trang này chỉ dành cho người dùng có quyền admin.</p>

      <SearchUsers />

      <NotificationList />

      {users.map((user) => {
        return (
          <div key={user.id}>
            <div>
              {user.firstName} {user.lastName}
            </div>
            <div>
              {
                user.emailAddresses.find(
                  (email) => email.id === user.primaryEmailAddressId
                )?.emailAddress
              }
            </div>
            <div>{user.publicMetadata.role as string}</div>
            <div>
              <form action={setRole}>
                <input type="hidden" value={user.id} name="id" />
                <input type="hidden" value="admin" name="role" />
                <button type="submit">Make Admin</button>
              </form>
            </div>
            <div>
              <form action={setRole}>
                <input type="hidden" value={user.id} name="id" />
                <input type="hidden" value="moderator" name="role" />
                <button type="submit">Make Moderator</button>
              </form>
            </div>
          </div>
        );
      })}
    </>
  );
}
