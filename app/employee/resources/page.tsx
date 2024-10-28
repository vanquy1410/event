"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button'
import { getAllResources, deleteResource } from '@/lib/actions/resource.actions';
import ResourceTable from '../_components/ResourceTable';

const ResourceManagementPage: React.FC = () => {
  const [resources, setResources] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const fetchedResources = await getAllResources({
          query: query,
          limit: 10,
          page: 1
        });
        setResources(fetchedResources?.data || []);
      } catch (err) {
        console.error('Lỗi khi tải danh sách tài nguyên:', err);
        setError('Không thể tải danh sách tài nguyên. Vui lòng thử lại sau.');
      }
    };

    fetchResources();
  }, [query]);

  const handleDelete = async (resourceId: string) => {
    await deleteResource({ resourceId });
    setResources(resources.filter((resource: any) => resource._id !== resourceId));
  };

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className='h3-bold text-center sm:text-left'>Quản lý tài nguyên</h3>
          {/* <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/admin/dashboard/resource-management/create">
              Thêm tài nguyên mới
            </Link>
          </Button> */}
        </div>
      </section>

      <section className="wrapper my-8">
        <ResourceTable 
          resources={resources} 
          onDelete={handleDelete} 
          onSearch={setQuery}
        />
      </section>
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
};

export default ResourceManagementPage;
