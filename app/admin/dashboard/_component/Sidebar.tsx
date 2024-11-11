"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaChartBar, FaUsers, FaCalendarAlt, FaShoppingCart, 
         FaUserTie, FaAddressBook, FaSitemap, FaBox, FaBlog, 
         FaBell, FaTasks } from "react-icons/fa";

const navItems = [
  { href: "/", label: "Trang chủ", icon: FaHome },
  { href: "/admin/dashboard", label: "Tổng quan", icon: FaChartBar },
  { href: "/admin/dashboard/statistics", label: "Thống kê", icon: FaChartBar },
  { href: "/admin/dashboard/user-management", label: "Quản lý người dùng", icon: FaUsers },
  { 
    href: "/admin/dashboard/event-management", 
    label: "Quản lý sự kiện",
    icon: FaCalendarAlt,
    subItems: [
      { href: "/admin/dashboard/event-management/ending-soon", label: "Sự kiện sắp kết thúc", icon: FaCalendarAlt },
      { href: "/admin/dashboard/event-management/ended", label: "Sự kiện đã kết thúc", icon: FaCalendarAlt }
    ]
  },
  { href: "/admin/dashboard/order-management", label: "Quản lý đơn hàng", icon: FaShoppingCart },
  { href: "/admin/dashboard/employee-management", label: "Quản lý nhân viên", icon: FaUserTie },
  { href: "/admin/dashboard/contact-form-management", label: "Quản lý form liên hệ", icon: FaAddressBook },
  { href: "/admin/dashboard/organizer-management", label: "Quản lý ban tổ chức", icon: FaSitemap },
  { href: "/admin/dashboard/resource-management", label: "Quản lý tài nguyên", icon: FaBox },
  { href: "/admin/dashboard/blog-management", label: "Quản lý Blog", icon: FaBlog },
  { href: "/admin/dashboard/notifications", label: "Thông báo", icon: FaBell },
  { href: "/admin/dashboard/task-management", label: "Quản lý công việc", icon: FaTasks },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-64 bg-gray-800 text-white h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
        <ul>
          {navItems.map((item) => (
            <li key={item.href} className="mb-2">
              <Link
                href={item.href}
                className={`block p-2 rounded flex items-center ${
                  pathname === item.href ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
              >
                {item.icon && <item.icon className="mr-2 text-lg" />}
                {item.label}
              </Link>
              {item.subItems && (
                <ul className="ml-4 mt-2">
                  {item.subItems.map((subItem) => (
                    <li key={subItem.href}>
                      <Link
                        href={subItem.href}
                        className={`block p-2 rounded flex items-center ${
                          pathname === subItem.href ? "bg-gray-700" : "hover:bg-gray-700"
                        }`}
                      >
                        {subItem.icon && <subItem.icon className="mr-2 text-sm" />}
                        {subItem.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
