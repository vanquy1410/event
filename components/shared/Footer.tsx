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

const Footer = () => {
  const [showContactForm, setShowContactForm] = useState(false)

  return (
    <footer className="border-t py-8">
      <div className="wrapper flex flex-col items-center gap-8 p-6 text-center sm:flex-row sm:justify-between">
        <div className="flex flex-col items-center gap-4 sm:items-start">
          <Link href='/'>
            <Image 
              src="/assets/images/logo.svg"
              alt="logo"
              width={128}
              height={38}
            />
          </Link>
          <p className="mt-4">Số điện thoại liên hệ: 0816977958</p>
          <p>Zalo: 0816977958</p>
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
        <p>Star Event Website by VanQuy.</p>
      </div>
    </footer>
  )
}

export default Footer