"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { updateBlog, getBlogById } from '@/lib/actions/blog.actions';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { BLOG_TAGS } from '@/constants';
import { BlogFormData } from '@/types';

const UpdateBlogPage = ({ params }: { params: { id: string } }) => {
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
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const fetchedBlog = await getBlogById(params.id);
        
        if (!fetchedBlog) {
          toast.error('Blog không tồn tại');
          router.push('/admin/dashboard/blog-management');
          return;
        }

        setBlogData({
          title: fetchedBlog.title,
          description: fetchedBlog.description,
          content: fetchedBlog.content,
          imageUrl: fetchedBlog.imageUrl,
          tags: fetchedBlog.tags || []
        });
        setTags(fetchedBlog.tags || []);
        setPreviewUrl(fetchedBlog.imageUrl);
      } catch (error) {
        console.error('Error fetching blog:', error);
        toast.error('Có lỗi xảy ra khi tải thông tin blog');
        router.push('/admin/dashboard/blog-management');
      }
    };

    fetchBlog();
  }, [params.id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setBlogData({ ...blogData, [e.target.name]: e.target.value });
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
      const newTags = [...tags, currentTag.trim()];
      setTags(newTags);
      setBlogData({ ...blogData, tags: newTags });
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    setBlogData({ ...blogData, tags: newTags });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

      let imageUrl = blogData.imageUrl;

      if (files.length > 0) {
        const formData = new FormData();
        formData.append('file', files[0]);
        formData.append('type', 'blog');
        formData.append('id', params.id);

        const uploadResponse = await fetch('/api/s3-storage', {
          method: 'POST',
          body: formData
        });

        if (!uploadResponse.ok) {
          throw new Error('Upload ảnh thất bại');
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url || uploadData.fileUrl;
      }

      const updatedBlog = {
        title: blogData.title,
        description: blogData.description,
        content: blogData.content,
        imageUrl,
        tags: tags
      };

      console.log('Updating blog with data:', updatedBlog);

      const result = await updateBlog({
        blogId: params.id,
        blog: updatedBlog,
        path: '/admin/dashboard/blog-management'
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success('Cập nhật blog thành công!');
      router.push('/admin/dashboard/blog-management');
    } catch (error) {
      console.error('Lỗi khi cập nhật blog:', error);
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật blog');
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-5">Cập nhật Blog</h1>
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
            Hình ảnh
          </label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-2"
          />
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
          {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật blog'}
        </Button>
      </form>
    </div>
  );
};

export default UpdateBlogPage;
