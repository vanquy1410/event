"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createEmployee } from '@/lib/actions/employee.actions';

const CreateEmployeePage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    UserAccount: '',
    Password: '',
    Role: '',
    PhoneNumber: '',
    Address: '',
    Email: '',
    Position: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createEmployee(formData);
      router.push('/admin/dashboard/employee-management');
    } catch (error) {
      console.error('Lỗi khi tạo nhân viên mới:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Thêm nhân viên mới</h1>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="UserAccount"
          placeholder="Tên tài khoản"
          value={formData.UserAccount}
          onChange={handleChange}
          className="mb-3"
        />
        <Input
          type="password"
          name="Password"
          placeholder="Mật khẩu"
          value={formData.Password}
          onChange={handleChange}
          className="mb-3"
        />
        <Input
          type="text"
          name="Role"
          placeholder="Vai trò"
          value={formData.Role}
          onChange={handleChange}
          className="mb-3"
        />
        <Input
          type="tel"
          name="PhoneNumber"
          placeholder="Số điện thoại"
          value={formData.PhoneNumber}
          onChange={handleChange}
          className="mb-3"
        />
        <Input
          type="text"
          name="Address"
          placeholder="Địa chỉ"
          value={formData.Address}
          onChange={handleChange}
          className="mb-3"
        />
        <Input
          type="email"
          name="Email"
          placeholder="Email"
          value={formData.Email}
          onChange={handleChange}
          className="mb-3"
        />
        <Input
          type="text"
          name="Position"
          placeholder="Chức vụ"
          value={formData.Position}
          onChange={handleChange}
          className="mb-3"
        />
        <Button type="submit">Thêm nhân viên</Button>
      </form>
    </div>
  );
};

export default CreateEmployeePage;
