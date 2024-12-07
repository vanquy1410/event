"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ContactForm from "./ContactForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Sitemap from "./Sitemap";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  const [showContactForm, setShowContactForm] = useState(false);

  return (
    <footer className="bg-violet-400 text-dark py-8">
      <div className="container mx-auto px-4">
        {/* Top Section: Logo, Contact Info, Social Media */}
        <div className="flex flex-wrap justify-between items-start gap-8">
          {/* Logo and Contact Information */}
          <div className="flex flex-col items-center sm:items-start">
            <Link href="/">
              <Image
                src="/assets/images/logo1.svg"
                alt="logo"
                width={128}
                height={38}
                className="transition-all duration-300 ease-in-out transform hover:scale-105 hover:brightness-110"
              />
            </Link>
            <p className="mt-4 text-lg">Số điện thoại liên hệ: 0816977958</p>
            <p className="text-lg">Zalo: 0816977958</p>
            <div className="flex gap-4 mt-4">
              <Link
                href="https://www.facebook.com/profile.php?id=100014191996311"
                target="_blank"
                aria-label="Facebook"
              >
                <FaFacebook size={24} className="text-blue-600 hover:text-blue-800" />
              </Link>
              <Link
                href="https://www.instagram.com/quyvan"
                target="_blank"
                aria-label="Instagram"
              >
                <FaInstagram size={24} className="text-pink-500 hover:text-pink-700" />
              </Link>
              <Link href="https://www.twitter.com" target="_blank" aria-label="Twitter">
                <FaTwitter size={24} className="text-blue-400 hover:text-blue-600" />
              </Link>
              <Link href="https://www.youtube.com" target="_blank" aria-label="YouTube">
                <FaYoutube size={24} className="text-red-600 hover:text-red-800" />
              </Link>
            </div>
            <Dialog open={showContactForm} onOpenChange={setShowContactForm}>
              <DialogTrigger asChild>
                <button className="mt-4 text-primary-500 hover:underline text-lg">
                  Liên hệ
                </button>
              </DialogTrigger>
              <DialogContent className="bg-secondary">
                <DialogHeader>
                  <DialogTitle>Liên hệ với chúng tôi</DialogTitle>
                  <DialogDescription>
                    Vui lòng điền thông tin liên hệ của bạn
                  </DialogDescription>
                </DialogHeader>
                <ContactForm />
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-col items-center gap-4 sm:items-start sm:text-left w-full sm:w-1/3">
            <h4 className="text-2xl font-bold">Giới thiệu</h4>
            <p className="text-base text-white-700">
              Star Event là nền tảng tổ chức sự kiện giúp bạn dễ dàng đăng ký và quản lý các sự kiện lớn nhỏ. Chúng tôi luôn mang đến những trải nghiệm tuyệt vời cho khách hàng.
            </p>
          </div>

          {/* Sitemap */}
          <div className="w-full sm:w-1/3">
            <Sitemap />
          </div>
        </div>

        {/* Bottom Section: OpenStreetMap */}
        <div className="mt-8 text-center">
          <iframe
            width="100%"
            height="200"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src="https://www.openstreetmap.org/export/embed.html?bbox=106.660172%2C10.762622%2C106.660172%2C10.762622&layer=mapnik"
            style={{ border: 0 }}
            allowFullScreen
          ></iframe>
        </div>

        {/* Footer Text */}
        <div className="mt-6 text-center text-white py-8">
          <p className="text-lg">Star Event Website by VanQuy & AnhQuan.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
