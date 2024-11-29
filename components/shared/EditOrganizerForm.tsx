"use client"
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-hot-toast';

interface EditOrganizerFormProps {
  initialData: {
    _id: string;
    name: string;
    email: string;
    description: string;
    price: number;
    participantLimit: number;
    startDateTime: Date;
    endDateTime: Date;
    location: string;
    eventTitle: string;
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
  organizerId: string;
}

const EditOrganizerForm = ({ initialData, onSubmit, onCancel, organizerId }: EditOrganizerFormProps) => {
  const [formData, setFormData] = useState({
    ...initialData,
    startDateTime: new Date(initialData.startDateTime),
    endDateTime: new Date(initialData.endDateTime)
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'participantLimit' 
        ? parseFloat(value) 
        : value
    }));
  };

  const handleDateChange = (date: Date, field: 'startDateTime' | 'endDateTime') => {
    setFormData(prev => ({
      ...prev,
      [field]: date
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Chỉnh sửa thông tin ban tổ chức</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Giá vé ($)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Số người tham dự</label>
          <input
            type="number"
            name="participantLimit"
            value={formData.participantLimit}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Thời gian bắt đầu</label>
          <DatePicker
            selected={formData.startDateTime}
            onChange={(date: Date) => handleDateChange(date, 'startDateTime')}
            showTimeSelect
            dateFormat="Pp"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Thời gian kết thúc</label>
          <DatePicker
            selected={formData.endDateTime}
            onChange={(date: Date) => handleDateChange(date, 'endDateTime')}
            showTimeSelect
            dateFormat="Pp"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Mô tả</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Lưu thay đổi
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Hủy
        </button>
      </div>
    </form>
  );
};

export default EditOrganizerForm;
