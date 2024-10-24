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

interface Task {
  _id: string;
  title: string;
  description: string;
  assignedTo: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'in-progress' | 'completed';
}

export default function EmployeeTasksPage() {
  const { user, isLoaded } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    console.log("User data:", user);
    if (isLoaded && user) {
      fetchTasks();
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
    </div>
  );
}
