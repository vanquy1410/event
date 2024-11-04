import { Schema, model, models } from 'mongoose'

const BlogSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

const Blog = models.Blog || model('Blog', BlogSchema)

export default Blog
