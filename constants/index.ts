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
    label: 'Sự kiện',
    route: '/events/create',
  },
  {
    label: 'Hồ sơ',
    route: '/profile',
  },
  {
    label: 'Đăng ký BTC',
    route: '/organizer',
  },
  {
    label: 'Dash Board',
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
