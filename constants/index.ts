export const headerLinks = [
  {
    label: 'Trang chủ',
    route: '/',
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
    label: 'Danh sách người dùng',
    route: '/users',
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
}
