import { Blog } from '@/types'
import Image from 'next/image'

type BlogDetailsProps = {
  blog: Blog
}

const BlogDetails = ({ blog }: BlogDetailsProps) => {
  return (
    <div className="flex flex-col gap-5 md:gap-10">
      <Image 
        src={blog.imageUrl}
        alt={blog.title}
        width={1000}
        height={500}
        className="h-full min-h-[300px] w-full object-cover object-center"
      />

      <div className="flex flex-col gap-6">
        <h2 className="h2-bold">{blog.title}</h2>
        <p className="p-regular-20">{blog.description}</p>
        <div className="content">
          {blog.content}
        </div>
        <div className="flex gap-3 items-center">
          <p className="p-medium-16 lg:p-regular-18">
            Ngày đăng: {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default BlogDetails
