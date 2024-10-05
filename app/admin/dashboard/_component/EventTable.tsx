import Link from 'next/link';
import Image from 'next/image';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { getAllCategories } from '@/lib/actions/category.actions';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"


interface Event {
  _id: string;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  imageUrl: string;
  category: {
    name: string;
  };
  documentUrl: string;
}

interface EventTableProps {
  events: Event[];
  onDelete: (id: string) => void;
  onSearch: (query: string) => void;
  onCategoryChange: (category: string) => void;
}

export default function EventTable({ events, onDelete, onSearch, onCategoryChange }: EventTableProps) {
  const [categories, setCategories] = useState<{_id: string, name: string}[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoryList = await getAllCategories();
      setCategories(categoryList);
    };
    fetchCategories();
  }, []);

  const DeleteConfirmation = ({ eventId, onDelete }: { eventId: string, onDelete: (id: string) => void }) => {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" title="Delete">
            <FaTrash />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              <b>Hành động này không thể hoàn tác. Sự kiện này sẽ bị xóa vĩnh viễn khỏi hệ thống.</b>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(eventId)}>
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
          placeholder="Tìm kiếm sự kiện..."
          onChange={(e) => onSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select onValueChange={onCategoryChange}>
          <SelectTrigger className="max-w-xs">
            <SelectValue placeholder="Chọn danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Danh Mục</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category._id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">STT</th>
            <th className="py-2 px-4 border-b">Hình ảnh</th>
            <th className="py-2 px-4 border-b">Tiêu đề</th>
            <th className="py-2 px-4 border-b">Mô tả</th>
            <th className="py-2 px-4 border-b">Loại sự kiện</th>
            <th className="py-2 px-4 border-b">Thời gian bắt đầu</th>
            <th className="py-2 px-4 border-b">Thời gian kết thúc</th>
            <th className="py-2 px-4 border-b">Tài liệu</th>
            <th className="py-2 px-4 border-b">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr key={event._id}>
              <td className="py-2 px-4 border-b">{index + 1}</td>
              <td className="py-2 px-4 border-b">
                <Image 
                  src={event.imageUrl} 
                  alt={event.title} 
                  width={50} 
                  height={50} 
                  className="object-cover rounded"
                />
              </td>
              <td className="py-2 px-4 border-b">{event.title}</td>
              <td className="py-2 px-4 border-b">{event.description.substring(0, 50)}...</td>
              <td className="py-2 px-4 border-b">{event.category.name}</td>
              <td className="py-2 px-4 border-b">{new Date(event.startDateTime).toLocaleString()}</td>
              <td className="py-2 px-4 border-b">{new Date(event.endDateTime).toLocaleString()}</td>
              <td className="py-2 px-4 border-b">
                {(event as Event & { url: string }).url ? (
                  <a href={(event as Event & { url: string }).url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Xem tài liệu
                  </a>
                ) : null}
              </td>
              <td className="py-2 px-4 border-b">
                <Link href={`/events/${event._id}/update`}>
                  <Button variant="outline" className="mr-2" title="Edit">
                    <FaEdit />
                  </Button>
                </Link>
                <DeleteConfirmation eventId={event._id} onDelete={onDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}