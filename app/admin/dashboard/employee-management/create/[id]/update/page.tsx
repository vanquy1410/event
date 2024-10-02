"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateEmployee, getAllEmployees } from '@/lib/actions/employee.actions';

const UpdateEmployeePage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    UserAccount: '',
    Role: '',
    PhoneNumber: '',
    Address: '',
    Email: '',
    Position: ''
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      const result = await getAllEmployees({ query: params.id });
      if (result && result.data && result.data.length > 0) {
        const employee = result.data[0];
        setFormData({
          UserAccount: employee.UserAccount,
          Role: employee.Role,
          PhoneNumber: employee.PhoneNumber,
          Address: employee.Address,
          Email: employee.Email,
          Position: employee.Position
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
          name="UserAccount"
          placeholder="Tên tài khoản"
          value={formData.UserAccount}
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
        <Button type="submit">Cập nhật</Button>
      </form>
    </div>
  );
};

export default UpdateEmployeePage;
