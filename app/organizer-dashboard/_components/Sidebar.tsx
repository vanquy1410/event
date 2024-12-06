"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaClipboard, FaFileInvoiceDollar, FaHome, FaArrowLeft } from "react-icons/fa";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    label: "Trang chủ",
    icon: FaHome,
    href: "/organizer-dashboard"
  },
  {
    label: "Quản lý đăng ký sự kiện",
    icon: FaClipboard, 
    href: "/organizer-dashboard/event-registration-info"
  },
  {
    label: "Hóa đơn thanh toán",
    icon: FaFileInvoiceDollar,
    href: "/organizer-dashboard/payments"
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r h-full flex flex-col">
      <div className="p-4">
        <h2 className="text-xl font-bold text-purple-600">Dashboard BTC</h2>
      </div>
      
      <nav className="mt-4 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-4 py-3 hover:bg-purple-50 ${
              pathname === item.href ? "bg-purple-100 text-purple-600" : ""
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Button quay về */}
      <div className="p-4 border-t">
        <Button 
          asChild 
          variant="outline" 
          className="w-full flex items-center gap-2 text-purple-600 hover:text-purple-700"
        >
          <Link href="/organizer">
            <FaArrowLeft className="w-4 h-4" />
            Quay về trang đăng ký
          </Link>
        </Button>
      </div>
    </div>
  );
} 