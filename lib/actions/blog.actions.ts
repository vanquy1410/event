'use server'

import { connectToDatabase } from '@/lib/database'
import Blog from '@/lib/database/models/blog.model'
import { handleError } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

export async function getAllBlogs({
  query,
  limit = 10,
  page = 1,
}: {
  query?: string
  limit?: number
  page: number
}) {
  try {
    await connectToDatabase()

    const conditions = query ? {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    } : {}

    const blogs = await Blog.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip((page - 1) * limit)
      .limit(limit)

    const blogsCount = await Blog.countDocuments(conditions)

    return {
      data: blogs,
      totalPages: Math.ceil(blogsCount / limit)
    }
  } catch (error) {
    handleError(error)
  }
}

export async function createBlog({
  blog,
  path
}: {
  blog: any;
  path: string;
}) {
  try {
    await connectToDatabase();
    const newBlog = await Blog.create(blog);
    revalidatePath(path);
    return newBlog;
  } catch (error) {
    handleError(error);
  }
}

export async function getBlogById(blogId: string) {
  try {
    await connectToDatabase();
    const blog = await Blog.findById(blogId);
    if (!blog) throw new Error('Blog không tồn tại');
    return blog;
  } catch (error) {
    handleError(error);
  }
}

export async function updateBlog({
  blogId,
  blog,
  path
}: {
  blogId: string;
  blog: any;
  path: string;
}) {
  try {
    await connectToDatabase();
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { ...blog },
      { new: true }
    );
    if (!updatedBlog) throw new Error('Blog không tồn tại');
    revalidatePath(path);
    return updatedBlog;
  } catch (error) {
    handleError(error);
  }
}

export async function deleteBlog({
  blogId,
  path
}: {
  blogId: string;
  path: string;
}) {
  try {
    await connectToDatabase();
    const deletedBlog = await Blog.findByIdAndDelete(blogId);
    if (!deletedBlog) throw new Error('Blog không tồn tại');
    revalidatePath(path);
    return deletedBlog;
  } catch (error) {
    handleError(error);
  }
}

export async function getRelatedBlogs(blogId: string) {
  try {
    await connectToDatabase();

    // Lấy blog hiện tại
    const currentBlog = await Blog.findById(blogId);
    if (!currentBlog) throw new Error('Blog không tồn tại');

    // Tìm các blog liên quan dựa trên title tương tự
    // nhưng loại trừ blog hiện tại
    const relatedBlogs = await Blog.find({
      _id: { $ne: blogId },
      title: { 
        $regex: currentBlog.title.split(' ').slice(0, 3).join('|'), 
        $options: 'i' 
      }
    })
    .limit(3)
    .sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(relatedBlogs));
  } catch (error) {
    handleError(error);
  }
}

export async function getBlogList({
  query = '',
  limit = 10,
  page = 1
} = {}) {
  try {
    await connectToDatabase();

    const conditions = query ? {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    } : {};

    const blogs = await Blog.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip((page - 1) * limit)
      .limit(limit);

    const blogsCount = await Blog.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(blogs)),
      totalPages: Math.ceil(blogsCount / limit)
    };
  } catch (error) {
    handleError(error);
  }
}
