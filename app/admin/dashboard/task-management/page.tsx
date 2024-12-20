'use client'

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
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
import { FaTrash, FaEdit } from 'react-icons/fa';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from 'react-hot-toast';
import 'tailwindcss/tailwind.css';
// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Please wait for loading…</p>,
});

interface User {
  id: string;
  username: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  assignedTo: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'in-progress' | 'completed';
}

interface Event {
  _id: string;
  name: string;
}

export default function TaskManagementPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    startDate: new Date(),
    endDate: new Date(),
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        console.error('Invalid data format received from API');
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const formattedUsers = data.map(user => ({
          id: user._id || user.id,
          username: user.username || `${user.firstName} ${user.lastName}`.trim()
        }));
        setUsers(formattedUsers);
      } else {
        console.log('No users found or invalid data format');
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date: Date | null, field: 'startDate' | 'endDate') => {
    const today = new Date();
    if (date && date < today) {
      return;
    }
    setNewTask({ ...newTask, [field]: date });
  };

  const handleDescriptionChange = (value: string) => {
    setNewTask({ ...newTask, description: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    });
    if (response.ok) {
      fetchTasks();
      setNewTask({
        title: '',
        description: '',
        assignedTo: '',
        startDate: new Date(),
        endDate: new Date(),
      });
    } else {
      console.error('Failed to add task');
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
      } else {
        const errorData = await response.json();
        console.error('Failed to update task status:', errorData.message);
        // Hiển thị thông báo lỗi cho người dùng
        // Ví dụ: setError(errorData.message);
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      // Hiển thị thông báo lỗi cho người dùng
      // Ví dụ: setError('Đã xảy ra lỗi khi cập nhật trạng thái công việc');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTasks(tasks.filter(task => task._id !== taskId));
        // Có thể thêm thông báo thành công ở đây
      } else {
        const errorData = await response.json();
        console.error('Failed to delete task:', errorData.message);
        // Hiển thị thông báo lỗi cho người dùng
        // Ví dụ: setError(errorData.message);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      // Hiển thị thông báo lỗi cho người dùng
      // Ví dụ: setError('Đã xảy ra lỗi khi xóa công việc');
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      const response = await fetch(`/api/tasks/${updatedTask._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        const updatedTaskData = await response.json();
        setTasks(tasks.map(task => 
          task._id === updatedTaskData._id ? updatedTaskData : task
        ));
        toast.success('Cập nhật thông tin công việc thành công');
      } else {
        const errorData = await response.json();
        console.error('Failed to update task:', errorData.message);
        toast.error('Cập nhật thông tin công việc thất bại');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Đã xảy ra lỗi khi cập nhật công việc');
    }
  };

  const EditTaskForm = ({ task, onSave, users }: { task: Task, onSave: (updatedTask: Task) => void, users: User[] }) => {
    const [editedTask, setEditedTask] = useState(task);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setEditedTask({ ...editedTask, [e.target.name]: e.target.value });
    };

    const handleDateChange = (date: Date | null, field: 'startDate' | 'endDate') => {
      const today = new Date();
      if (date && date < today) {
        return;
      }
      setEditedTask({ ...editedTask, [field]: date });
    };

    const handleDescriptionChange = (value: string) => {
      setEditedTask({ ...editedTask, description: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(editedTask);
    };

    return (
      <form onSubmit={handleSubmit}>
        <Input
          name="title"
          value={editedTask.title}
          onChange={handleInputChange}
          placeholder="Tiêu đề công việc"
          className="mb-2"
        />
        <ReactQuill
          value={editedTask.description}
          onChange={handleDescriptionChange}
          placeholder="Mô tả công việc"
          className="mb-2"
        />
        <Select
          value={editedTask.assignedTo || "default"}
          onValueChange={(value) => setEditedTask(prevTask => ({ ...prevTask, assignedTo: value }))}
        >
          <SelectTrigger className="mb-2">
            <SelectValue placeholder="Chọn người được giao" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default" disabled>Chọn người được giao</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.username}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2 mb-2">
          <DatePicker
            selected={new Date(editedTask.startDate)}
            onChange={(date) => handleDateChange(date, 'startDate')}
            placeholderText="Ngày bắt đầu"
          />
          <DatePicker
            selected={new Date(editedTask.endDate)}
            onChange={(date) => handleDateChange(date, 'endDate')}
            placeholderText="Ngày kết thúc"
          />
        </div>
        <Button type="submit">Lưu thay đổi</Button>
      </form>
    );
  };

  const getShortDescription = (description: string) => {
    return description.length > 30 ? description.substring(0, 30) + '...' : description;
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">Quản lý công việc</h1>
      
      <Button onClick={() => setShowForm(!showForm)} className="mb-4 bg-blue-500 text-white">
        {showForm ? 'Ẩn form' : 'Thêm công việc mới'}
      </Button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 bg-white p-4 rounded shadow-md">
          <Input
            name="title"
            value={newTask.title}
            onChange={handleInputChange}
            placeholder="Tiêu đề công việc"
            className="mb-2 border border-gray-300 p-2 rounded"
          />
          <ReactQuill
            value={newTask.description}
            onChange={handleDescriptionChange}
            placeholder="Mô tả công việc"
            className="mb-2"
          />
          <div className="mb-2">
            <Select
              value={newTask.assignedTo || "default"}
              onValueChange={(value) => setNewTask(prevTask => ({ ...prevTask, assignedTo: value }))}
            >
              <SelectTrigger className="border border-gray-300 p-2 rounded">
                <SelectValue placeholder="Chọn người được giao" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default" disabled>Chọn người được giao</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.username}>
                    {user.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="border border-gray-300 p-2 rounded">
          Ngày bắt đầu
            <DatePicker
              selected={newTask.startDate}
              onChange={(date) => handleDateChange(date, 'startDate')}
              placeholderText="Ngày bắt đầu"
            />
          </div>
          <div className="border border-gray-300 p-2 rounded">
          Ngày kết thúc
            <DatePicker
              selected={newTask.endDate}
              onChange={(date) => handleDateChange(date, 'endDate')}
              placeholderText="Ngày kết thúc"
            />
          </div>
          <Button type="submit" className="bg-green-500 text-white">Thêm công việc</Button>
        </form>
      )}

      <h2 className="text-3xl font-bold mb-6 text-center text-primary">Danh sách công việc</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['pending', 'in-progress', 'completed'].map((status) => (
          <div key={status} className="border p-4 rounded bg-white shadow-md">
            <h2 className="font-bold mb-2 text-lg">
              {status === 'pending' && 'Chờ xử lý'}
              {status === 'in-progress' && 'Đang thực hiện'}
              {status === 'completed' && 'Hoàn thành'}
            </h2>
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <div key={task._id} className="border p-2 mb-2 rounded bg-gray-50 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold">{task.title}</h3>
                    {status === 'pending' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" className="p-1">
                            <FaEdit />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white rounded-lg shadow-lg">
                          <DialogHeader>
                            <DialogTitle>Chỉnh sửa công việc</DialogTitle>
                          </DialogHeader>
                          <EditTaskForm task={task} onSave={handleUpdateTask} users={users} />
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  {/* <p>{getShortDescription(task.description)}</p> */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="default" className="mt-2">Xem chi tiết công việc</Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white rounded-lg shadow-lg overflow-auto max-h-96">
                      <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Chi tiết công việc</DialogTitle>
                      </DialogHeader>
                      <div dangerouslySetInnerHTML={{ __html: task.description }} />
                    </DialogContent>
                  </Dialog>
                  <p>Người được giao: {task.assignedTo || 'Chưa xác định'}</p>
                  <p>Bắt đầu: {new Date(task.startDate).toLocaleDateString()}</p>
                  <p>Kết thúc: {new Date(task.endDate).toLocaleDateString()}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <div>
                      {status === 'pending' && (
                        <Button onClick={() => handleStatusChange(task._id, 'in-progress')} className="mr-2 bg-yellow-500 text-white">
                          Bắt đầu thực hiện
                        </Button>
                      )}
                      {status === 'in-progress' && (
                        <Button onClick={() => handleStatusChange(task._id, 'completed')} className="mr-2 bg-blue-500 text-white">
                          Hoàn thành
                        </Button>
                      )}
                      {status === 'completed' && (
                        <span className="text-green-600 font-semibold">Đã hoàn thành</span>
                      )}
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" title="Xóa" className="bg-red-500 text-white">
                          <FaTrash />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white rounded-lg shadow-lg">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Hành động này không thể hoàn tác. Công việc này sẽ bị xóa vĩnh viễn khỏi hệ thống.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteTask(task._id)}>
                            Xóa
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}