"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaHome, FaChartBar, FaUsers, FaCalendarAlt, FaShoppingCart, 
         FaUserTie, FaAddressBook, FaSitemap, FaBox, FaBlog, 
         FaBell, FaTasks, FaChevronLeft, FaChevronRight, FaTicketAlt } from "react-icons/fa";

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
  { href: "/admin/dashboard/organizer-management", label: "Quản lý tổ chức sự kiện", icon: FaSitemap },
  { href: "/admin/dashboard/resource-management", label: "Quản lý tài nguyên", icon: FaBox },
  { href: "/admin/dashboard/blog-management", label: "Quản lý Blog", icon: FaBlog },
  { 
    href: "/admin/dashboard/notifications", 
    label: "Thông báo", 
    icon: FaBell, 
    subItems: [
      { 
        href: "/admin/dashboard/notifications/all", 
        label: "Tất cả thông báo", 
        icon: FaBell 
      },
      { 
        href: "/admin/dashboard/notifications/canceled-tickets", 
        label: "Thông báo vé hủy", 
        icon: FaTicketAlt 
      }
    ]
  },
  { href: "/admin/dashboard/task-management", label: "Quản lý công việc", icon: FaTasks },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <nav className={`bg-gray-800 text-white min-h-screen flex flex-col ${
      isCollapsed ? 'w-16' : 'w-64'
    } transition-all duration-300`}>
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        {!isCollapsed && <h2 className="text-xl font-bold">Dashboard</h2>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded hover:bg-gray-700"
        >
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <ul className="p-4 space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center p-2 rounded ${
                  pathname === item.href ? 'bg-gray-700' : 'hover:bg-gray-700'
                }`}
              >
                <item.icon className={`text-lg ${isCollapsed ? 'mx-auto' : 'mr-2'}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
              {!isCollapsed && item.subItems && (
                <ul className="ml-4 mt-2 space-y-2">
                  {item.subItems.map((subItem) => (
                    <li key={subItem.href}>
                      <Link
                        href={subItem.href}
                        className={`flex items-center p-2 rounded ${
                          pathname === subItem.href ? 'bg-gray-700' : 'hover:bg-gray-700'
                        }`}
                      >
                        <subItem.icon className="mr-2 text-sm" />
                        <span>{subItem.label}</span>
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
