import Link from 'next/link';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface Employee {
  _id: string;
  UserAccount: string;
  Role: string;
  PhoneNumber: string;
  Email: string;
  Position: string;
}

interface EmployeeTableProps {
  employees: Employee[];
  onDelete: (id: string) => void;
  onSearch: (query: string) => void;
}

export default function EmployeeTable({ employees, onDelete, onSearch }: EmployeeTableProps) {
  const DeleteConfirmation = ({ employeeId, onDelete }: { employeeId: string, onDelete: (id: string) => void }) => {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" title="Xóa">
            <FaTrash />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Nhân viên này sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(employeeId)}>
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  return (
    <>
      <div className="flex gap-4 mb-4">
        <Input
          type="text"
          placeholder="Tìm kiếm nhân viên..."
          onChange={(e) => onSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">STT</th>
            <th className="py-2 px-4 border-b">Tên tài khoản</th>
            <th className="py-2 px-4 border-b">Vai trò</th>
            <th className="py-2 px-4 border-b">Số điện thoại</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Chức vụ</th>
            <th className="py-2 px-4 border-b">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((employee, index) => (
              <tr key={employee._id}>
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b">{employee.UserAccount}</td>
                <td className="py-2 px-4 border-b">{employee.Role}</td>
                <td className="py-2 px-4 border-b">{employee.PhoneNumber}</td>
                <td className="py-2 px-4 border-b">{employee.Email}</td>
                <td className="py-2 px-4 border-b">{employee.Position}</td>
                <td className="py-2 px-4 border-b">
                  <Link href={`/admin/dashboard/employee-management/${employee._id}/update`}>
                    <Button variant="outline" className="mr-2" title="Sửa">
                      <FaEdit />
                    </Button>
                  </Link>
                  <DeleteConfirmation employeeId={employee._id} onDelete={onDelete} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="py-4 px-6 text-center">
                Không có nhân viên nào. Hãy thêm nhân viên mới.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
