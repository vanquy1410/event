'use client'

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';

interface Task {
  _id: string;
  title: string;
  description: string;
  assignedTo: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'in-progress' | 'completed';
}

export default function TaskManagementPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    startDate: new Date(),
    endDate: new Date(),
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await fetch('/api/tasks');
    const data = await response.json();
    setTasks(data);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date: Date | null, field: 'startDate' | 'endDate') => {
    if (date) {
      setNewTask({ ...newTask, [field]: date });
    }
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
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId) return;

    const updatedTasks = Array.from(tasks);
    const [reorderedItem] = updatedTasks.splice(source.index, 1);
    updatedTasks.splice(destination.index, 0, reorderedItem);

    setTasks(updatedTasks);

    // Cập nhật trạng thái công việc trong database
    await fetch(`/api/tasks/${draggableId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: destination.droppableId }),
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý công việc</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <Input
          name="title"
          value={newTask.title}
          onChange={handleInputChange}
          placeholder="Tiêu đề công việc"
          className="mb-2"
        />
        <Textarea
          name="description"
          value={newTask.description}
          onChange={handleInputChange}
          placeholder="Mô tả công việc"
          className="mb-2"
        />
        <Input
          name="assignedTo"
          value={newTask.assignedTo}
          onChange={handleInputChange}
          placeholder="ID người được giao (Clerk User ID)"
          className="mb-2"
        />
        <div className="flex gap-2 mb-2">
          <DatePicker
            selected={newTask.startDate}
            onChange={(date) => handleDateChange(date, 'startDate')}
            placeholderText="Ngày bắt đầu"
          />
          <DatePicker
            selected={newTask.endDate}
            onChange={(date) => handleDateChange(date, 'endDate')}
            placeholderText="Ngày kết thúc"
          />
        </div>
        <Button type="submit">Thêm công việc</Button>
      </form>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['pending', 'in-progress', 'completed'].map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="border p-4 rounded"
                >
                  <h2 className="font-bold mb-2">
                    {status === 'pending' && 'Chờ xử lý'}
                    {status === 'in-progress' && 'Đang thực hiện'}
                    {status === 'completed' && 'Hoàn thành'}
                  </h2>
                  {tasks
                    .filter((task) => task.status === status)
                    .map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="border p-2 mb-2 rounded bg-white"
                          >
                            <h3 className="font-bold">{task.title}</h3>
                            <p>{task.description}</p>
                            <p>Người được giao: {task.assignedTo}</p>
                            <p>Bắt đầu: {new Date(task.startDate).toLocaleDateString()}</p>
                            <p>Kết thúc: {new Date(task.endDate).toLocaleDateString()}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
