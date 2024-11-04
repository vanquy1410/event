import BlogCard from '@/components/shared/BlogCard'

type BlogListProps = {
  data: any[]
  emptyTitle?: string
  emptyStateSubtext?: string
  limit?: number
  page?: number
  totalPages?: number
}

const BlogList = ({
  data,
  emptyTitle = 'Không tìm thấy blog nào',
  emptyStateSubtext = 'Hãy quay lại sau',
  limit,
  page,
  totalPages,
}: BlogListProps) => {
  return (
    <>
      {data.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-[14px] bg-grey-50 py-28 text-center">
          <h3 className="p-bold-20 md:h5-bold">{emptyTitle}</h3>
          <p className="p-regular-14">{emptyStateSubtext}</p>
        </div>
      )}
    </>
  )
}

export default BlogList 