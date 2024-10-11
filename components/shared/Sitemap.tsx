import Link from 'next/link';

const Sitemap = () => {
  return (
    <div className="sitemap grid grid-cols-2 gap-4"> {/* Tạo 2 cột */}
      <h3 className="font-bold col-span-2">Danh mục</h3> {/* Đặt tiêu đề chiếm 2 cột */}
      <ul className="list-disc pl-5 col-span-1"> {/* Cột đầu tiên */}
        <li><Link href="/">Trang chủ</Link></li>
        <li><Link href="/event-page">Danh sách sự kiện</Link></li>
        <li><Link href="/event-calendar">Lịch</Link></li>

      </ul>
      <ul className="list-disc pl-5 col-span-1"> {/* Cột thứ hai */}
        <li><Link href="/profile">Vé của tôi</Link></li>
        <li><Link href="/organizer">Đăng ký ban tổ chức</Link></li>
      </ul>
    </div>
  );
};

export default Sitemap;
