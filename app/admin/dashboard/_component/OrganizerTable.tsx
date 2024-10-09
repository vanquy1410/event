import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface Organizer {
  _id: string;
  name: string;
  eventTitle: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
}

interface OrganizerTableProps {
  organizers: Organizer[];
  onStatusUpdate: (id: string, status: 'approved' | 'rejected') => void;
  onSearch: (query: string) => void;
}

export default function OrganizerTable({ organizers, onStatusUpdate, onSearch }: OrganizerTableProps) {
  const StatusUpdateConfirmation = ({ organizerId, status, onConfirm }: { organizerId: string, status: 'approved' | 'rejected', onConfirm: () => void }) => {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant={status === 'approved' ? 'default' : 'destructive'}>
            {status === 'approved' ? 'Chấp nhận' : 'Từ chối'}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận thay đổi trạng thái</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn {status === 'approved' ? 'chấp nhận' : 'từ chối'} ban tổ chức này?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>
              Xác nhận
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
          placeholder="Tìm kiếm ban tổ chức..."
          onChange={(e) => onSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">STT</th>
            <th className="py-2 px-4 border-b">Tên</th>
            <th className="py-2 px-4 border-b">Tên sự kiện</th>
            <th className="py-2 px-4 border-b">Mô tả</th>
            <th className="py-2 px-4 border-b">Trạng thái</th>
            <th className="py-2 px-4 border-b">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {organizers.map((organizer, index) => (
            <tr key={organizer._id}>
              <td className="py-2 px-4 border-b">{index + 1}</td>
              <td className="py-2 px-4 border-b">{organizer.name}</td>
              <td className="py-2 px-4 border-b">{organizer.eventTitle}</td>
              <td className="py-2 px-4 border-b">{organizer.description.substring(0, 50)}...</td>
              <td className="py-2 px-4 border-b">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  organizer.status === 'approved' ? 'bg-green-200 text-green-800' :
                  organizer.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                  'bg-red-200 text-red-800'
                }`}>
                  {organizer.status === 'approved' ? 'Đã duyệt' :
                   organizer.status === 'pending' ? 'Chờ duyệt' :
                   'Từ chối'}
                </span>
              </td>
              <td className="py-2 px-4 border-b">
                {organizer.status === 'pending' && (
                  <>
                    <div className="flex space-x-4">
                      <StatusUpdateConfirmation 
                        organizerId={organizer._id} 
                        status="approved" 
                        onConfirm={() => onStatusUpdate(organizer._id, 'approved')} 
                      />
                      <StatusUpdateConfirmation 
                        organizerId={organizer._id} 
                        status="rejected" 
                        onConfirm={() => onStatusUpdate(organizer._id, 'rejected')} 
                      />
                    </div>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
