export const headerLinks = [
  {
    label: 'Trang chủ',
    route: '/',
  },
  {
    label: 'Lịch',
    route: '/event-calendar',
  },
  // {
  //   label: 'Sự kiện',
  //   route: '/events/create',
  // },
  {
    label: 'Vé của bạn',
    route: '/profile',
  },
  {
    label: 'Đăng ký ban tổ chức',
    route: '/organizer',
  },
  {
    label: 'Dashboard',
    route: '/admin/dashboard',
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
  participantLimit: 1, // Add this line
}
