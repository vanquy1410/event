import { getBlogList } from '@/lib/actions/blog.actions'
import BlogList from '@/components/blog/BlogList'
import Search from '@/components/shared/Search'

export default async function BlogPage() {
  const { data: blogs } = await getBlogList() || { data: [] }

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">Danh Sách Blog</h3>
          <Search placeholder="Tìm kiếm bài viết..." />
        </div>
      </section>
      
      <section className="wrapper my-8">
        <BlogList data={blogs} />
      </section>
    </>
  )
}
