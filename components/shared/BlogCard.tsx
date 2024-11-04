import { Blog } from '@/types'
import Image from 'next/image'
import Link from 'next/link'

type BlogCardProps = {
  blog: Blog
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <Link href={`/blog/${blog._id}`}>
      <div className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg">
        <Image 
          src={blog.imageUrl}
          alt={blog.title}
          width={400}
          height={200}
          className="h-[200px] w-full object-cover"
        />
        
        <div className="flex flex-col gap-3 p-5">
          <h3 className="h3-bold line-clamp-2">{blog.title}</h3>
          <p className="p-medium-16 line-clamp-2 text-gray-500">{blog.description}</p>
          <div className="flex-between mt-4 w-full">
            <p className="p-medium-14">
              {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
