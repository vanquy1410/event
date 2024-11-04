'use server'

import { connectToDatabase } from '@/lib/database'
import Blog from '@/lib/database/models/blog.model'
import { handleError } from '@/lib/utils'

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

    const titleCondition = query ? { title: { $regex: query, $options: 'i' } } : {}
    const conditions = {
      ...titleCondition,
    }

    const skipAmount = (page - 1) * limit

    const blogs = await Blog.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const blogsCount = await Blog.countDocuments(conditions)

    return {
      data: blogs,
      totalPages: Math.ceil(blogsCount / limit),
    }
  } catch (error) {
    handleError(error)
  }
}

export async function createBlog({ blog, path }: { blog: any, path: string }) {
  try {
    await connectToDatabase()

    const newBlog = await Blog.create({
      ...blog,
      createdAt: new Date(),
    })

    return JSON.parse(JSON.stringify(newBlog))
  } catch (error) {
    handleError(error)
  }
}

export async function updateBlog({ blogId, blog, path }: { blogId: string, blog: any, path: string }) {
  try {
    await connectToDatabase()

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { ...blog },
      { new: true }
    )

    if (!updatedBlog) throw new Error('Blog không tồn tại')
    return JSON.parse(JSON.stringify(updatedBlog))
  } catch (error) {
    handleError(error)
  }
}

export async function deleteBlog({ blogId, path }: { blogId: string, path: string }) {
  try {
    await connectToDatabase()

    const deletedBlog = await Blog.findByIdAndDelete(blogId)
    if (!deletedBlog) throw new Error('Blog không tồn tại')

    return JSON.parse(JSON.stringify(deletedBlog))
  } catch (error) {
    handleError(error)
  }
}
