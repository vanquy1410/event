import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { FaUpload, FaEye } from 'react-icons/fa';
import UploadDocumentModal from './UploadDocumentModal';
import ViewDocumentsModal from './ViewDocumentsModal';
import { useState } from 'react';
import { IOrganizer } from '@/types/organizer';

interface OrganizerTableProps {
  organizers: IOrganizer[];
  onStatusUpdate: (id: string, status: 'approved' | 'rejected') => void;
  onSearch: (query: string) => void;
  onDocumentUpdate: (organizerId: string, newDocument: string) => void;
}

export default function OrganizerTable({ organizers, onStatusUpdate, onSearch, onDocumentUpdate }: OrganizerTableProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOrganizerId, setSelectedOrganizerId] = useState<string | null>(null);

  const StatusUpdateConfirmation = ({ organizerId, status, onConfirm }: { organizerId: string, status: 'approved' | 'rejected', onConfirm: () => void }) => {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant={status === 'approved' ? 'default' : 'destructive'}>
            {status === 'approved' ? 'Chấp nhận' : 'Từ chối'}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-white rounded-lg shadow-lg">
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

  const handleUploadClick = (organizerId: string) => {
    setSelectedOrganizerId(organizerId);
    setIsUploadModalOpen(true);
  };

  const handleViewDocuments = (organizerId: string) => {
    setSelectedOrganizerId(organizerId);
    setIsViewModalOpen(true);
  };

  const handleUploadSuccess = async (fileUrl: string) => {
    if (selectedOrganizerId) {
      try {
        // Gọi API để cập nhật thông tin tài liệu trong database
        const response = await fetch('/api/update-organizer-document', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ organizerId: selectedOrganizerId, documentUrl: fileUrl }),
        });

        if (!response.ok) {
          throw new Error('Không thể cập nhật thông tin tài liệu');
        }

        // Cập nhật state local
        onDocumentUpdate(selectedOrganizerId, fileUrl);
      } catch (error) {
        console.error('Lỗi khi cập nhật thông tin tài liệu:', error);
        // Hiển thị thông báo lỗi cho người dùng
      }
    }
    setIsUploadModalOpen(false);
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
            <th className="py-2 px-4 border-b">Tài liệu</th>
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
                {organizer.status === 'approved' && (
                  <div className="flex space-x-2">
                    <Button onClick={() => handleUploadClick(organizer._id)} title="Upload tài liệu">
                      <FaUpload />
                    </Button>
                    <Button onClick={() => handleViewDocuments(organizer._id)} title="Xem tài liệu">
                      <FaEye />
                    </Button>
                  </div>
                )}
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
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        organizerId={selectedOrganizerId}
      />
      <ViewDocumentsModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        organizerId={selectedOrganizerId}
        documents={organizers.find(org => org._id === selectedOrganizerId)?.documents || []}
      />
    </>
  );
}
