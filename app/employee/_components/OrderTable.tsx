import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { FaTrash } from 'react-icons/fa';

interface Order {
  _id: string;
  eventTitle: string;
  buyerName: string;
  username: string;
  createdAt: string;
  totalAmount: number;
}

interface OrderTableProps {
  orders: Order[];
  onDelete: (id: string) => void;
  onSearch: (query: string) => void;
}

export default function OrderTable({ orders, onDelete, onSearch }: OrderTableProps) {
  const DeleteConfirmation = ({ orderId, onDelete }: { orderId: string, onDelete: (id: string) => void }) => {
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
              Hành động này không thể hoàn tác. Đơn hàng này sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(orderId)}>
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
          placeholder="Tìm kiếm đơn hàng..."
          onChange={(e) => onSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">STT</th>
            <th className="py-2 px-4 border-b">Mã đơn hàng</th>
            <th className="py-2 px-4 border-b">Tên sự kiện</th>
            <th className="py-2 px-4 border-b">Người mua</th>
            <th className="py-2 px-4 border-b">Ngày tạo</th>
            <th className="py-2 px-4 border-b">Tổng tiền</th>
            <th className="py-2 px-4 border-b">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order._id}>
              <td className="py-2 px-4 border-b">{index + 1}</td>
              <td className="py-2 px-4 border-b">{order._id}</td>
              <td className="py-2 px-4 border-b">{order.eventTitle}</td>
              <td className="py-2 px-4 border-b">{order.username}</td>
              <td className="py-2 px-4 border-b">{new Date(order.createdAt).toLocaleString()}</td>
              <td className="py-2 px-4 border-b">{order.totalAmount.toLocaleString()} đ</td>
              <td className="py-2 px-4 border-b">
                <DeleteConfirmation orderId={order._id} onDelete={onDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
