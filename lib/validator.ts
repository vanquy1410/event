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
  eventOrganizerId: z.string().min(1, 'Chưa chọn đăng ký sự kiện'),
})

export const organizerFormSchema = z.object({
  name: z.string().min(1, 'Họ và tên là bắt buộc'),
  email: z.string().email('Email không hợp lệ'),
  phoneNumber: z.string().min(1, 'Số điện thoại là bắt buộc'),
  eventTitle: z.string().min(1, 'Tên sự kiện là bắt buộc'),
  eventScale: z.string().min(1, 'Vui lòng chọn quy mô sự kiện'),
  venue: z.string().min(1, 'Vui lòng chọn địa điểm tổ chức'),
  expectedTicketPrice: z.number().min(0, 'Giá vé không được âm'),
  expectedRevenue: z.number().min(0, 'Doanh thu dự kiến không được âm'),
})