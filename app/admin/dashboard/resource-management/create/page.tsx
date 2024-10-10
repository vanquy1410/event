"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createResource } from '@/lib/actions/resource.actions';

const CreateResourcePage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    url: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createResource(formData);
      router.push('/admin/dashboard/resource-management');
    } catch (error) {
      console.error('Lỗi khi tạo tài nguyên mới:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Thêm tài nguyên mới</h1>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          placeholder="Tên tài nguyên"
          value={formData.name}
          onChange={handleChange}
          className="mb-3"
        />
        <Input
          type="text"
          name="type"
          placeholder="Loại tài nguyên"
          value={formData.type}
          onChange={handleChange}
          className="mb-3"
        />
        <Input
          type="url"
          name="url"
          placeholder="URL tài nguyên"
          value={formData.url}
          onChange={handleChange}
          className="mb-3"
        />
        <Button type="submit">Thêm tài nguyên</Button>
      </form>
    </div>
  );
};

export default CreateResourcePage;
