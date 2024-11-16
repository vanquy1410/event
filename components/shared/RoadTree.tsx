import Image from 'next/image';
import Link from 'next/link';

const RoadTree = () => {
  const roadItems = [
    {
      icon: "/assets/icons/calendar.svg",
      title: "Lịch Sự Kiện",
      description: "Xem lịch các sự kiện sắp diễn ra",
      link: "/event-calendar",
      color: "bg-blue-50"
    },
    {
      icon: "/assets/icons/ticket.svg",
      title: "Vé Của Tôi",
      description: "Quản lý vé đã đặt và theo dõi sự kiện",
      link: "/profile",
      color: "bg-green-50"
    },
    {
      icon: "/assets/icons/organize.svg",
      title: "Tổ Chức Sự Kiện",
      description: "Đăng ký trở thành ban tổ chức sự kiện",
      link: "/organizer",
      color: "bg-purple-50"
    },
    {
      icon: "/assets/icons/blog.svg",
      title: "Blog & Tin Tức",
      description: "Cập nhật thông tin mới nhất về sự kiện",
      link: "/blog",
      color: "bg-orange-50"
    },
    {
      icon: "/assets/icons/star.svg",
      title: "Sự Kiện Yêu Thích",
      description: "Xem các sự kiện yêu thích",
      link: "/favorites",
      color: "bg-pink-50"
    },
    {
      icon: "/assets/icons/chart.svg",
      title: "Thống Kê & Phân Tích",
      description: "Xem thống kê và phân tích",
      link: "/analytics",
      color: "bg-cyan-50"
    },
    {
      icon: "/assets/icons/info.svg",
      title: "Về Chúng Tôi",
      description: "Tìm hiểu thêm về Evently",
      link: "/about",
      color: "bg-yellow-50"
    },
    {
      icon: "/assets/icons/services.svg",
      title: "Dịch Vụ",
      description: "Khám phá dịch vụ của Evently",
      link: "/services",
      color: "bg-indigo-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {roadItems.map((item, index) => (
        <Link href={item.link} key={index}>
          <div className={`${item.color} p-6 rounded-xl hover:shadow-lg transition-all group`}>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-4 relative group-hover:scale-110 transition-transform">
                <Image
                  src={item.icon}
                  alt={item.title}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="font-bold text-xl mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RoadTree;
