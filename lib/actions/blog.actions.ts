'use server'

import { connectToDatabase } from '@/lib/database'
import Blog from '@/lib/database/models/blog.model'
import { handleError } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import { BlogFormData } from '@/types'

export async function getAllBlogs({
  query,
  tag,
  limit = 6,
  page = 1,
}: {
  query?: string | null;
  tag?: string | null;
  limit?: number;
  page: number;
}) {
  try {
    await connectToDatabase();

    let conditions = {};

    if (query) {
      conditions = {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
        ],
      };
    }

    if (tag) {
      conditions = { ...conditions, tags: tag };
    }

    const blogs = await Blog.find(conditions)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const blogsCount = await Blog.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(blogs)),
      totalPages: Math.ceil(blogsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

export async function createBlog({
  blog,
  path
}: {
  blog: BlogFormData;
  path: string;
}) {
  try {
    await connectToDatabase();
    
    console.log('Creating blog with data:', blog);
    console.log('Tags:', blog.tags);
    
    const blogData = {
      title: blog.title,
      description: blog.description,
      content: blog.content,
      imageUrl: blog.imageUrl,
      tags: blog.tags || []
    };

    const newBlog = await Blog.create(blogData);
    
    console.log('Created blog document:', newBlog);
    
    revalidatePath(path);
    return JSON.parse(JSON.stringify(newBlog));
  } catch (error) {
    console.error('Error creating blog:', error);
    handleError(error);
  }
}

export async function getBlogById(blogId: string) {
  try {
    await connectToDatabase();
    
    console.log('Getting blog with ID:', blogId);
    
    const blog = await Blog.findById(blogId);
    
    console.log('Found blog:', blog);
    
    if (!blog) {
      console.log('Blog not found');
      return null;
    }
    
    return JSON.parse(JSON.stringify(blog));
  } catch (error) {
    console.error('Error in getBlogById:', error);
    return null;
  }
}

export async function updateBlog({
  blogId,
  blog,
  path
}: {
  blogId: string;
  blog: BlogFormData;
  path: string;
}) {
  try {
    await connectToDatabase();
    console.log('Blog data before update:', blog);
    
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { 
        $set: blog
      },
      { new: true }
    );
    
    if (!updatedBlog) throw new Error('Blog không tồn tại');
    console.log('Updated blog:', updatedBlog);
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
