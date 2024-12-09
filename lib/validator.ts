import * as z from "zod"

export const eventFormSchema = z.object({
  title: z.string().min(3, 'Tiêu đề phải có ít nhất 3 kí tự'),
  description: z.string().min(20, 'Mô tả phải có ít nhất 20 ký tự'),
  location: z.string().min(3, 'Địa điểm phải có ít nhất 3 kí tự'),
  imageUrl: z.string().min(1, 'Phải có hình ảnh'),
  startDateTime: z.date(),
  endDateTime: z.date(),
  categoryId: z.string(),
  price: z.string(),
  isFree: z.boolean(),
  url: z.string(),
  participantLimit: z.number().min(1, 'Người tham gia ít nhất phải là 1'),
})