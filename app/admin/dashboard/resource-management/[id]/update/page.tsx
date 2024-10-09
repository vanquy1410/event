"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateResource, getAllResources } from '@/lib/actions/resource.actions';

const UpdateResourcePage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    url: ''
  });

  useEffect(() => {
    const fetchResource = async () => {
      const result = await getAllResources({ query: params.id });
      if (result && result.data && result.data.length > 0) {
        const resource = result.data[0];
        setFormData({
          name: resource.name || '',
          type: resource.type || '',
          url: resource.url || ''
        });
      }
    };
    fetchResource();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateResource(params.id, formData);
      router.push('/admin/dashboard/resource-management');
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin tài nguyên:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Cập nhật thông tin tài nguyên</h1>
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
        <Button type="submit">Cập nhật</Button>
      </form>
    </div>
  );
};

export default UpdateResourcePage;
