import { setRole } from "../_actions";

export default function UserTable({ users }: { users: any[] }) {
  return (
    <table className="min-w-full bg-white border border-gray-300 mt-4">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b">Tên</th>
          <th className="py-2 px-4 border-b">Email</th>
          <th className="py-2 px-4 border-b">Vai trò</th>
          <th className="py-2 px-4 border-b">Hành động</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td className="py-2 px-4 border-b">
              {user.firstName} {user.lastName}
            </td>
            <td className="py-2 px-4 border-b">
              {user.emailAddresses.find(
                (email: any) => email.id === user.primaryEmailAddressId
              )?.emailAddress}
            </td>
            <td className="py-2 px-4 border-b">
              {user.publicMetadata.role as string}
            </td>
            <td className="py-2 px-4 border-b">
              <form action={setRole} className="inline-block mr-2">
                <input type="hidden" value={user.id} name="id" />
                <input type="hidden" value="admin" name="role" />
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
                >
                  Đặt làm Admin
                </button>
              </form>
              <form action={setRole} className="inline-block">
                <input type="hidden" value={user.id} name="id" />
                <input type="hidden" value="moderator" name="role" />
                <button
                  type="submit"
                  className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600"
                >
                  Đặt làm Moderator
                </button>
              </form>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
