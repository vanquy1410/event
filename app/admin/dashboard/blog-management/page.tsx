"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button'
import { getAllBlogs, deleteBlog } from '@/lib/actions/blog.actions';
import BlogTable from '../_component/BlogTable';

interface Blog {
  _id: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  createdAt: string;
}

const BlogManagementPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const fetchedBlogs = await getAllBlogs({
          query: query,
          limit: 10,
          page: 1
        });
        setBlogs(fetchedBlogs?.data || []);
      } catch (err) {
        console.error('Lỗi khi tải danh sách blog:', err);
        setError('Không thể tải danh sách blog. Vui lòng thử lại sau.');
      }
    };

    fetchBlogs();
  }, [query]);

  const handleDelete = async (blogId: string) => {
    await deleteBlog({ blogId, path: '/admin/dashboard/blog-management' });
    setBlogs(blogs.filter((blog: any) => blog._id !== blogId));
  };

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className='h3-bold text-center sm:text-left'>Quản lý Blog</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/admin/dashboard/blog-management/create">
              Thêm blog mới
            </Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <BlogTable 
          blogs={blogs} 
          onDelete={handleDelete} 
          onSearch={setQuery}
        />
      </section>
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
};

export default BlogManagementPage;
