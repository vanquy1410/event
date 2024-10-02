import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { FaTrash } from 'react-icons/fa';

interface ContactForm {
  _id: string;
  userName: string;
  phoneNumber: string;
  email: string;
  message: string;
  createdAt: string;
}

interface ContactFormTableProps {
  contactForms: ContactForm[];
  onDelete: (id: string) => void;
  onSearch: (query: string) => void;
}

export default function ContactFormTable({ contactForms, onDelete, onSearch }: ContactFormTableProps) {
  const DeleteConfirmation = ({ contactFormId, onDelete }: { contactFormId: string, onDelete: (id: string) => void }) => {
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
              Hành động này không thể hoàn tác. Form liên hệ này sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(contactFormId)}>
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
          placeholder="Tìm kiếm form liên hệ..."
          onChange={(e) => onSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">STT</th>
            <th className="py-2 px-4 border-b">Tên người dùng</th>
            <th className="py-2 px-4 border-b">Số điện thoại</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Nội dung</th>
            <th className="py-2 px-4 border-b">Ngày tạo</th>
            <th className="py-2 px-4 border-b">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {contactForms.map((form, index) => (
            <tr key={form._id}>
              <td className="py-2 px-4 border-b">{index + 1}</td>
              <td className="py-2 px-4 border-b">{form.userName}</td>
              <td className="py-2 px-4 border-b">{form.phoneNumber}</td>
              <td className="py-2 px-4 border-b">{form.email}</td>
              <td className="py-2 px-4 border-b">{form.message.substring(0, 50)}...</td>
              <td className="py-2 px-4 border-b">{new Date(form.createdAt).toLocaleString()}</td>
              <td className="py-2 px-4 border-b">
                <DeleteConfirmation contactFormId={form._id} onDelete={onDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
