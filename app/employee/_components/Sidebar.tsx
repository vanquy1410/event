"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaCalendarAlt, FaClipboardList } from 'react-icons/fa';

const navItems = [
  { href: '/employee', label: 'Trang chủ', icon: FaHome },
  { href: '/employee/events', label: 'Quản lý sự kiện', icon: FaCalendarAlt },
  { href: '/employee/tasks', label: 'Công việc', icon: FaClipboardList },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-2 p-2 rounded-lg transition-colors duration-200 ${
              pathname === item.href
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
