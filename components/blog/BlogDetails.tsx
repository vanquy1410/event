import Image from 'next/image'
import Link from 'next/link'
import { Blog } from '@/types'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

type BlogDetailsProps = {
  blog: Blog
}

const BlogDetails = ({ blog }: BlogDetailsProps) => {
  return (
    <div className="flex flex-col items-center max-w-5xl mx-auto">
      {/* Nút trở về */}
      <div className="w-full mb-8">
        <Link href="/blog">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft size={20} />
            Trở về danh sách blog
          </Button>
        </Link>
      </div>

      {/* Nội dung */}
      <div className="w-full space-y-8 mb-8">
        <h1 className="h1-bold text-center">{blog.title}</h1>
        
        <div className="flex justify-center text-gray-500">
          <p>{new Date(blog.createdAt).toLocaleDateString('vi-VN')}</p>
        </div>

        <div className="prose max-w-none">
          <p className="text-lg leading-relaxed">{blog.description}</p>
          <div className="mt-8 text-base leading-relaxed">
            {blog.content}
          </div>
        </div>
      </div>

      {/* Ảnh */}
      <div className="w-full max-w-2xl">
        <Image
          src={blog.imageUrl}
          alt={blog.title}
          width={600}
          height={300}
          className="w-full h-[250px] object-cover rounded-lg"
          priority
        />
      </div>
    </div>
  )
}

export default BlogDetails 