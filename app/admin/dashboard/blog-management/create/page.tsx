"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { createBlog } from '@/lib/actions/blog.actions';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { BLOG_TAGS } from '@/constants';
import { BlogFormData } from '@/types';

const CreateBlogPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blogData, setBlogData] = useState<BlogFormData>({
    title: '',
    description: '',
    content: '',
    imageUrl: '',
    tags: []
  });
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setBlogData({ ...blogData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles([file]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagClick = (tag: string) => {
    const newTags = tags.includes(tag)
      ? tags.filter(t => t !== tag)
      : [...tags, tag];
    
    setTags(newTags);
    setBlogData(prev => ({
      ...prev,
      tags: newTags
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

      if (!files.length) {
        setErrors({ image: 'Vui lòng chọn hình ảnh cho blog' });
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', files[0]);
      formData.append('type', 'blog');
      formData.append('id', 'new');

      const uploadResponse = await fetch('/api/s3-storage', {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload ảnh thất bại');
      }

      const uploadData = await uploadResponse.json();
      const imageUrl = uploadData.url || uploadData.fileUrl;

      const newBlog = {
        title: blogData.title,
        description: blogData.description,
        content: blogData.content,
        imageUrl,
        tags: blogData.tags
      };

      console.log('Sending blog data:', newBlog);

      const result = await createBlog({
        blog: newBlog,
        path: '/admin/dashboard/blog-management'
      });

      console.log('Create blog result:', result);

      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success('Tạo blog thành công!');
      router.push('/admin/dashboard/blog-management');
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi tạo blog');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-5">Tạo Blog Mới</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Tiêu đề
          </label>
          <Input
            id="title"
            name="title"
            value={blogData.title}
            onChange={handleChange}
            placeholder="Nhập tiêu đề blog"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Mô tả ngắn
          </label>
          <Textarea
            id="description"
            name="description"
            value={blogData.description}
            onChange={handleChange}
            placeholder="Nhập mô tả ngắn về blog"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            Nội dung
          </label>
          <Textarea
            id="content"
            name="content"
            value={blogData.content}
            onChange={handleChange}
            placeholder="Nhập nội dung blog"
            className="min-h-[200px]"
            required
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-1">
            Hình ảnh <span className="text-red-500">*</span>
          </label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-2"
            required
          />
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image}</p>
          )}
          {previewUrl && (
            <div className="mt-2">
              <Image
                src={previewUrl}
                alt="Preview"
                width={200}
                height={200}
                className="object-cover rounded"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {BLOG_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  tags.includes(tag) 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Đang tạo blog...' : 'Tạo blog'}
        </Button>
      </form>
    </div>
  );
};

export default CreateBlogPage;
