'use client'

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Textarea } from '@/components/ui/textarea';

moment.locale('vi');

interface Task {
  _id: string;
  title: string;
  description: string;
  assignedTo: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'in-progress' | 'completed';
}

const localizer = momentLocalizer(moment);

const messages = {
  allDay: 'Cả ngày',
  previous: 'Trước',
  next: 'Sau',
  today: 'Hôm nay',
  month: 'Tháng',
  week: 'Tuần',
  day: 'Ngày',
  agenda: 'Lịch công việc',
  date: 'Ngày',
  time: 'Thời gian',
  event: 'Sự kiện',
  noEventsInRange: 'Không có sự kiện nào trong khoảng thời gian này.',
  showMore: (total: number) => `+ Xem thêm (${total})`,
  sunday: 'Chủ Nhật',
  monday: 'Thứ Hai',
  tuesday: 'Thứ Ba',
  wednesday: 'Thứ Tư',
  thursday: 'Thứ Năm',
  friday: 'Thứ Sáu',
  saturday: 'Thứ Bảy',
};

export default function EmployeeTasksPage() {
  const { user, isLoaded } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isLoaded && user) {
      fetchTasks();
      fetchNotes();
    }
  }, [user, isLoaded]);

  const fetchTasks = async () => {
    if (!user?.username) {
      console.error('Username không có sẵn');
      return;
    }
    try {
      console.log('Fetching tasks for user:', user.username);
      const response = await fetch(`/api/tasks?assignedTo=${user.username}`);
      const data = await response.json();
      console.log('API Response:', data);
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        console.error('Định dạng dữ liệu không hợp lệ từ API');
        setTasks([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách công việc:', error);
      setTasks([]);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes');
      const data = await response.json();
      setNotes(data.notes || '');
    } catch (error) {
      console.error('Lỗi khi tải ghi chú:', error);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: 'pending' | 'in-progress' | 'completed') => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(tasks.map(task => 
          task._id === taskId ? { ...task, status: updatedTask.status } : task
        ));
        toast.success('Cập nhật trạng thái công việc thành công');
      } else {
        const errorData = await response.json();
        console.error('Lỗi khi cập nhật trạng thái công việc:', errorData.message);
        toast.error('Không thể cập nhật trạng thái công việc');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái công việc:', error);
      toast.error('Đã xảy ra lỗi khi cập nhật trạng thái công việc');
    }
  };

  const handleSaveNotes = async () => {
    try {
      // Gọi API để lưu ghi chú
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });

      if (response.ok) {
        toast.success('Ghi chú đã được lưu thành công');
      } else {
        toast.error('Có lỗi xảy ra khi lưu ghi chú');
      }
    } catch (error) {
      console.error('Lỗi khi lưu ghi chú:', error);
      toast.error('Có lỗi xảy ra khi lưu ghi chú');
    }
  };

  const calendarEvents = tasks.map(task => ({
    title: task.title,
    start: new Date(task.startDate),
    end: new Date(task.endDate),
    allDay: false,
  }));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Công việc của tôi</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['pending', 'in-progress', 'completed'].map((status) => (
          <div key={status} className="border p-4 rounded">
            <h2 className="font-bold mb-2">
              {status === 'pending' && 'Chờ xử lý'}
              {status === 'in-progress' && 'Đang thực hiện'}
              {status === 'completed' && 'Hoàn thành'}
            </h2>
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <div key={task._id} className="border p-2 mb-2 rounded bg-white">
                  <h3 className="font-bold">{task.title}</h3>
                  <p>{task.description}</p>
                  <p>Người được giao: {task.assignedTo || 'Chưa xác định'}</p>
                  <p>Bắt đầu: {new Date(task.startDate).toLocaleDateString()}</p>
                  <p>Kết thúc: {new Date(task.endDate).toLocaleDateString()}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <div>
                      {status === 'pending' && (
                        <Button onClick={() => handleStatusChange(task._id, 'in-progress')} className="mr-2">
                          Bắt đầu thực hiện
                        </Button>
                      )}
                      {status === 'in-progress' && (
                        <Button onClick={() => handleStatusChange(task._id, 'completed')} className="mr-2">
                          Hoàn thành
                        </Button>
                      )}
                      {status === 'completed' && (
                        <span className="text-green-600 font-semibold">Đã hoàn thành</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Lịch công việc</h2>
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          messages={messages}
          formats={{
            monthHeaderFormat: (date: Date) => moment(date).format('MMMM YYYY'),
            dayFormat: (date: Date, culture: string, localizer: any) =>
              localizer.format(date, 'dddd', culture),
            dayHeaderFormat: (date: Date) => moment(date).format('dddd DD/MM'),
            dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
              `${moment(start).format('D MMMM')} - ${moment(end).format('D MMMM YYYY')}`,
          }}
          views={['month', 'week', 'day', 'agenda']}
        />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Ghi chú công việc</h2>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Nhập ghi chú của bạn ở đây..."
          className="w-full h-32"
        />
        <Button onClick={handleSaveNotes} className="mt-2">Lưu ghi chú</Button>
      </div>
    </div>
  );
}
