import Link from 'next/link';
import Image from 'next/image';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface Blog {
  _id: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  createdAt: string;
}

interface BlogTableProps {
  blogs: Blog[];
  onDelete: (id: string) => void;
  onSearch: (query: string) => void;
}

export default function BlogTable({ blogs, onDelete, onSearch }: BlogTableProps) {
  const DeleteConfirmation = ({ blogId, onDelete }: { blogId: string, onDelete: (id: string) => void }) => {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" title="Xóa">
            <FaTrash />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-white rounded-lg shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Blog này sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(blogId)}>
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
          placeholder="Tìm kiếm blog..."
          onChange={(e) => onSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">STT</th>
            <th className="py-2 px-4 border-b">Hình ảnh</th>
            <th className="py-2 px-4 border-b">Tiêu đề</th>
            <th className="py-2 px-4 border-b">Mô tả</th>
            <th className="py-2 px-4 border-b">Ngày tạo</th>
            <th className="py-2 px-4 border-b">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog, index) => (
            <tr key={blog._id}>
              <td className="py-2 px-4 border-b">{index + 1}</td>
              <td className="py-2 px-4 border-b">
                <Image 
                  src={blog.imageUrl} 
                  alt={blog.title} 
                  width={50} 
                  height={50} 
                  className="object-cover rounded"
                />
              </td>
              <td className="py-2 px-4 border-b">{blog.title}</td>
              <td className="py-2 px-4 border-b">{blog.description.substring(0, 100)}...</td>
              <td className="py-2 px-4 border-b">{new Date(blog.createdAt).toLocaleString()}</td>
              <td className="py-2 px-4 border-b">
                <Link href={`/admin/dashboard/blog-management/${blog._id}/update`}>
                  <Button variant="outline" className="mr-2" title="Sửa">
                    <FaEdit />
                  </Button>
                </Link>
                <DeleteConfirmation blogId={blog._id} onDelete={onDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
