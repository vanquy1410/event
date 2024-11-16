export const headerLinks = [
  {
    label: 'Trang chủ',
    route: '/',
  },
  {
    label: 'Lịch',
    route: '/event-calendar',
  },
  {
    label: 'Danh sách sự kiện',
    route: '/event-page',
  },
  {
    label: 'Thư viện',
    route: '/favorites',
  },
  {
    label: 'Vé',
    route: '/profile',
  },
  {
    label: 'Đăng ký ban tổ chức',
    route: '/organizer',
  },
  {
    label: 'Blog',
    route: '/blog',
  },
  {
    label: 'Dashboard',
    route: '/admin/dashboard',
  },
  {
    label: 'Nhân viên',
    route: '/employee',
  },
]

export const eventDefaultValues = {
  title: '',
  description: '',
  location: '',
  imageUrl: '',
  startDateTime: new Date(),
  endDateTime: new Date(),
  categoryId: '',
  price: '',
  isFree: false,
  url: '',
  participantLimit: 1,
}

export const BLOG_TAGS = [
  "Du lịch",
  "Công nghệ", 
  "Thời trang",
  "Ẩm thực",
  "Văn hóa",
  "Giải trí"
] as const;
