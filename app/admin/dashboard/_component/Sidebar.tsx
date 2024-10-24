"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome } from "react-icons/fa"; // Thêm import này

const navItems = [
  { href: "/", label: "Trang chủ", icon: FaHome }, // Thêm mục này
  { href: "/admin/dashboard", label: "Tổng quan" },
  { href: "/admin/dashboard/statistics", label: "Thống kê" },
  { href: "/admin/dashboard/user-management", label: "Quản lý người dùng" },
  { 
    href: "/admin/dashboard/event-management", 
    label: "Quản lý sự kiện",
    subItems: [
      { href: "/admin/dashboard/event-management/ending-soon", label: "Sự kiện sắp kết thúc" },
      { href: "/admin/dashboard/event-management/ended", label: "Sự kiện đã kết thúc" }
    ]
  },
  { href: "/admin/dashboard/order-management", label: "Quản lý đơn hàng" },
  { href: "/admin/dashboard/employee-management", label: "Quản lý nhân viên" },
  { href: "/admin/dashboard/contact-form-management", label: "Quản lý form liên hệ" },
  { href: "/admin/dashboard/organizer-management", label: "Quản lý ban tổ chức" },
  { href: "/admin/dashboard/resource-management", label: "Quản lý tài nguyên" },
  { href: "/admin/dashboard/notifications", label: "Thông báo" },
  { href: "/admin/dashboard/task-management", label: "Quản lý công việc" },
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
                {item.icon && <item.icon className="mr-2" />}
                {item.label}
              </Link>
              {item.subItems && (
                <ul className="ml-4 mt-2">
                  {item.subItems.map((subItem) => (
                    <li key={subItem.href}>
                      <Link
                        href={subItem.href}
                        className={`block p-2 rounded ${
                          pathname === subItem.href ? "bg-gray-700" : "hover:bg-gray-700"
                        }`}
                      >
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
