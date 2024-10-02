"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createEmployee } from '@/lib/actions/employee.actions';

const CreateEmployeePage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    userAccount: '',
    password: '',
    role: '',
    phoneNumber: '',
    address: '',
    email: '',
    position: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      if (!formData[key as keyof typeof formData].trim()) {
        newErrors[key] = 'Trường này là bắt buộc';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      await createEmployee(formData);
      router.push('/admin/dashboard/employee-management');
    } catch (error) {
      console.error('Lỗi khi tạo nhân viên mới:', error);
      setErrors({ submit: 'Có lỗi xảy ra khi tạo nhân viên mới. Vui lòng thử lại.' });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Thêm nhân viên mới</h1>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <div key={key} className="mb-3">
            <Input
              type={key === 'password' ? 'password' : key === 'email' ? 'email' : 'text'}
              name={key}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              value={formData[key as keyof typeof formData]}
              onChange={handleChange}
              className={errors[key] ? 'border-red-500' : ''}
            />
            {errors[key] && <p className="text-red-500 text-sm mt-1">{errors[key]}</p>}
          </div>
        ))}
        {errors.submit && <p className="text-red-500 text-sm mb-3">{errors.submit}</p>}
        <Button type="submit">Thêm nhân viên</Button>
      </form>
    </div>
  );
};

export default CreateEmployeePage;
