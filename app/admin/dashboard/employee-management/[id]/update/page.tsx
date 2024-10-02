"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateEmployee, getAllEmployees } from '@/lib/actions/employee.actions';

const UpdateEmployeePage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    userAccount: '',
    role: '',
    phoneNumber: '',
    address: '',
    email: '',
    position: ''
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      const result = await getAllEmployees({ query: params.id });
      if (result && result.data && result.data.length > 0) {
        const employee = result.data[0];
        setFormData({
          userAccount: employee.userAccount || '',
          role: employee.role || '',
          phoneNumber: employee.phoneNumber || '',
          address: employee.address || '',
          email: employee.email || '',
          position: employee.position || ''
        });
      }
    };
    fetchEmployee();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateEmployee(params.id, formData);
      router.push('/admin/dashboard/employee-management');
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin nhân viên:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Cập nhật thông tin nhân viên</h1>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="userAccount"
          placeholder="Tên tài khoản"
          value={formData.userAccount}
          onChange={handleChange}
          className="mb-3"
        />
        <Input
          type="text"
          name="role"
          placeholder="Vai trò"
          value={formData.role}
          onChange={handleChange}
          className="mb-3"
        />
        <Input
          type="tel"
          name="phoneNumber"
          placeholder="Số điện thoại"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="mb-3"
        />
        <Input
          type="text"
          name="address"
          placeholder="Địa chỉ"
          value={formData.address}
          onChange={handleChange}
          className="mb-3"
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="mb-3"
        />
        <Input
          type="text"
          name="position"
          placeholder="Chức vụ"
          value={formData.position}
          onChange={handleChange}
          className="mb-3"
        />
        <Button type="submit">Cập nhật</Button>
      </form>
    </div>
  );
};

export default UpdateEmployeePage;
