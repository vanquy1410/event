"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import BlogList from '@/components/blog/BlogList'
import BlogTags from '@/components/blog/BlogTags'
import Search from '@/components/shared/Search'
import { getAllBlogs } from '@/lib/actions/blog.actions'
import Link from 'next/link'

const tags = [
  "Du lịch",
  "Công nghệ",
  "Thời trang",
  "Ẩm thực",
  "Văn hóa",
  "Giải trí"
]

export default function BlogPage() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  
  const query = searchParams.get('query')
  const tag = searchParams.get('tag')

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)
        const response = await getAllBlogs({
          query,
          tag,
          limit: 10,
          page: 1
        })
        setBlogs(response?.data || [])
      } catch (error) {
        console.error('Error fetching blogs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [query, tag])

  return (
    <div className="wrapper">
      <div className="flex-between mb-8">
        <h1 className="h1-bold">Danh Sách Blog</h1>
        <Search placeholder="Tìm kiếm bài viết..." />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/blog"
          className={`px-4 py-2 rounded-full text-sm transition-colors ${
            !tag ? 'bg-primary-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Tất cả
        </Link>
        {tags.map((t) => (
          <Link
            key={t}
            href={`/blog?tag=${t}`}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              tag === t ? 'bg-primary-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {t}
          </Link>
        ))}
      </div>

      {loading ? (
        <div className="flex-center min-h-[200px]">
          <p>Đang tải...</p>
        </div>
      ) : (
        <BlogList 
          data={blogs}
          emptyTitle="Không tìm thấy bài viết"
          emptyStateSubtext="Hãy thử tìm kiếm với từ khóa khác"
        />
      )}
    </div>
  )
}
