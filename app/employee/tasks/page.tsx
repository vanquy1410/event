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
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

interface Note {
  id: string;
  content: string;
  date: Date | string;
}

const localizer = momentLocalizer(moment);

const messages = {
  allDay: 'Cả ngày',
  previous: 'Trc',
  next: 'Sau',
  today: 'Hôm nay',
  month: 'Tháng',
  week: 'Tuần',
  day: 'Ngày',
  agenda: 'Lịch công việc',
  date: 'Ngày',
  time: 'Thời gian',
  event: 'S kiện',
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

const eventStyleGetter = (event: any) => {
  let style = {
    backgroundColor: event.resource === 'task' ? '#3174ad' : '#4caf50',
    borderRadius: '5px',
    opacity: 0.8,
    color: 'white',
    border: '0px',
    display: 'block'
  };
  return { style };
};

export default function EmployeeTasksPage() {
  const { user, isLoaded } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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
      if (!response.ok) {
        throw new Error('Lỗi khi tải ghi chú');
      }
      const data = await response.json();
      const formattedNotes = data.notes.map((note: any) => ({
        ...note,
        date: new Date(note.date)
      }));
      setNotes(formattedNotes);
    } catch (error) {
      console.error('Lỗi khi tải ghi chú:', error);
      toast.error('Không thể tải ghi chú');
    }
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewNote(event.target.value);
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
      const newNoteObject = {
        content: newNote,
        date: new Date().toISOString(),
      };

      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: newNoteObject }),
      });

      if (!response.ok) {
        throw new Error('Lỗi khi lưu ghi chú');
      }

      const result = await response.json();
      
      // Cập nhật ID của ghi chú từ server và chuyển đổi date thành đối tượng Date
      const savedNote: Note = {
        ...newNoteObject,
        id: result.noteId,
        date: new Date(newNoteObject.date),
      };

      setNotes([...notes, savedNote]);
      setNewNote('');
      toast.success('Ghi chú đã được lưu thành công');
      
      // Gọi lại fetchNotes để cập nhật danh sách ghi chú từ server
      await fetchNotes();
    } catch (error) {
      console.error('Lỗi khi lưu ghi chú:', error);
      toast.error('Có lỗi xảy ra khi lưu ghi chú');
    }
  };

  const handleToggleDescription = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const handleOpenDescription = (task: Task) => {
    setSelectedTask(task);
  };

  const calendarEvents = [
    ...tasks.map(task => ({
      title: task.title,
      start: new Date(task.startDate),
      end: new Date(task.endDate),
      allDay: false,
      resource: 'task',
    })),
    ...notes.map(note => ({
      title: note.content,
      start: new Date(note.date),
      end: new Date(note.date),
      allDay: true,
      resource: 'note',
    }))
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Công việc của tôi</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['pending', 'in-progress', 'completed'].map((status) => (
          <div key={status} className="border p-4 rounded-lg shadow-md bg-white">
            <h2 className="font-bold mb-2 text-lg text-gray-800">
              {status === 'pending' && 'Chờ xử lý'}
              {status === 'in-progress' && 'Đang thực hiện'}
              {status === 'completed' && 'Hoàn thành'}
            </h2>
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <div key={task._id} className="border-b border-gray-200 p-2 mb-2 rounded bg-gray-50">
                  <h3 className="font-semibold text-gray-700">{task.title}</h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={() => handleOpenDescription(task)}>
                        Xem mô tả
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white rounded-lg shadow-lg">
                      <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Chi tiết công việc</DialogTitle>
                      </DialogHeader>
                      <ReactQuill 
                        value={task.description} 
                        readOnly={true} 
                        theme="bubble" 
                      />
                    </DialogContent>
                  </Dialog>
                  <p className="text-sm text-gray-500">Người được giao: {task.assignedTo || 'Chưa xác định'}</p>
                  <p className="text-sm text-gray-500">Bắt đầu: {new Date(task.startDate).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500">Kết thúc: {new Date(task.endDate).toLocaleDateString()}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <div>
                      {status === 'pending' && (
                        <Button onClick={() => handleStatusChange(task._id, 'in-progress')} className="mr-2 bg-yellow-500 text-white hover:bg-yellow-600">
                          Bắt đầu thực hiện
                        </Button>
                      )}
                      {status === 'in-progress' && (
                        <Button onClick={() => handleStatusChange(task._id, 'completed')} className="mr-2 bg-blue-500 text-white hover:bg-blue-600">
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
          eventPropGetter={eventStyleGetter}
        />
        <div className="mt-4 flex items-center justify-start space-x-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-[#3174ad] mr-2"></div>
            <span>Công việc</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-[#4caf50] mr-2"></div>
            <span>Ghi chú</span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Ghi chú</h2>
        <Textarea
          value={newNote}
          onChange={handleNotesChange}
          rows={5}
          placeholder="Nhập ghi chú mới của bạn ở đây..."
          className="w-full mb-2"
        />
        <Button onClick={handleSaveNotes} className="mb-4">Lưu ghi chú</Button>
        
        <h3 className="text-lg font-semibold mb-2">Danh sách ghi chú:</h3>
        {notes.map((note) => (
          <div key={note.id} className="bg-gray-100 p-2 mb-2 rounded">
            <p>{note.content}</p>
            <small>{new Date(note.date).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
