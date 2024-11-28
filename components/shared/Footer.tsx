"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from 'react'
import ContactForm from './ContactForm'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Sitemap from './Sitemap'
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'

const Footer = () => {
  const [showContactForm, setShowContactForm] = useState(false)

  return (
    <footer className="border-t py-8">
      <div className="wrapper flex flex-col items-center gap-8 p-6 text-center">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between w-full">
          <div className="flex flex-col items-center gap-4 sm:items-start">
            <Link href='/'>
              <Image 
                src="/assets/images/logo1.svg"
                alt="logo"
                width={128}
                height={38}
              />
            </Link>
            <p className="mt-4">Số điện thoại liên hệ: 0816977958</p>
            <p>Zalo: 0816977958</p>
            <div className="flex gap-4 mt-2">
              <Link href="https://www.facebook.com" target="_blank" aria-label="Facebook">
                <FaFacebook size={24} className="text-blue-600 hover:text-blue-800" />
              </Link>
              <Link href="https://www.instagram.com" target="_blank" aria-label="Instagram">
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
                <button className="mt-4 text-primary-500 hover:underline">Liên hệ</button>
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
          <Sitemap />
        </div>
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
        <p>Star Event Website by VanQuy & AnhQuan.</p>
      </div>
    </footer>
  )
}

export default Footer