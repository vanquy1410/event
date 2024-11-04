import { getBlogById, getRelatedBlogs } from '@/lib/actions/blog.actions'
import BlogDetails from '@/components/blog/BlogDetails'
import RelatedBlogs from '@/components/blog/BlogList'

type BlogDetailsPageProps = {
  params: {
    id: string
  }
}

export default async function BlogDetailsPage({ params: { id } }: BlogDetailsPageProps) {
  const blog = await getBlogById(id)
  const relatedBlogs = await getRelatedBlogs(id)

  return (
    <>
      <section className="flex justify-center bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper">
          <BlogDetails blog={blog} />
        </div>
      </section>

      <section className="wrapper my-8">
        <h2 className="h2-bold mb-8">Bài Viết Liên Quan</h2>
        <RelatedBlogs data={relatedBlogs} />
      </section>
    </>
  )
}
