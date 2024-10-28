import Link from 'next/link';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface Resource {
  _id: string;
  name: string;
  type: string;
  url: string;
  createdAt: string;
}

interface ResourceTableProps {
  resources: Resource[];
  onDelete: (id: string) => void;
  onSearch: (query: string) => void;
}

export default function ResourceTable({ resources, onDelete, onSearch }: ResourceTableProps) {
  const DeleteConfirmation = ({ resourceId, onDelete }: { resourceId: string, onDelete: (id: string) => void }) => {
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
              Hành động này không thể hoàn tác. Tài nguyên này sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(resourceId)}>
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
          placeholder="Tìm kiếm tài nguyên..."
          onChange={(e) => onSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">STT</th>
            <th className="py-2 px-4 border-b">Tên</th>
            <th className="py-2 px-4 border-b">Loại</th>
            <th className="py-2 px-4 border-b">URL</th>
            <th className="py-2 px-4 border-b">Ngày tạo</th>
            {/* <th className="py-2 px-4 border-b">Hành động</th> */}
          </tr>
        </thead>
        <tbody>
          {resources.map((resource, index) => (
            <tr key={resource._id}>
              <td className="py-2 px-4 border-b">{index + 1}</td>
              <td className="py-2 px-4 border-b">{resource.name}</td>
              <td className="py-2 px-4 border-b">{resource.type}</td>
              <td className="py-2 px-4 border-b">
                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {resource.url}
                </a>
              </td>
              <td className="py-2 px-4 border-b">{new Date(resource.createdAt).toLocaleString()}</td>
              {/* <td className="py-2 px-4 border-b">
                <Link href={`/admin/dashboard/resource-management/${resource._id}/update`}>
                  <Button variant="outline" className="mr-2" title="Sửa">
                    <FaEdit />
                  </Button>
                </Link>
                <DeleteConfirmation resourceId={resource._id} onDelete={onDelete} />
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
