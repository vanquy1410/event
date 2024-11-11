"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Slide {
  id: number;
  title: string;
  description: string;
  image: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Sự Kiện Công Nghệ 2024",
    description: "Khám phá những xu hướng công nghệ mới nhất và cơ hội kết nối",
    image: "/assets/images/slider/slide1.jpg"
  },
  {
    id: 2,
    title: "Festival Âm Nhạc Mùa Hè",
    description: "Trải nghiệm những giai điệu tuyệt vời cùng các nghệ sĩ hàng đầu",
    image: "/assets/images/slider/slide2.jpg"
  },
  {
    id: 3,
    title: "Hội Thảo Khởi Nghiệp",
    description: "Gặp gỡ và học hỏi từ những doanh nhân thành công",
    image: "/assets/images/slider/slide3.jpg"
  },
  {
    id: 4,
    title: "Digital Marketing Conference",
    description: "Cập nhật xu hướng marketing mới nhất cùng các chuyên gia từ Google, Meta và TikTok",
    image: "/assets/images/slider/slide4.jpg"
  },
  {
    id: 5,
    title: "Eco Green Exhibition",
    description: "Triển lãm và hội thảo về các giải pháp xanh cho tương lai bền vững",
    image: "/assets/images/slider/slide5.jpg"
  }
  // Thêm các slide khác tại đây
];

const HomeSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Chuyển slide sau mỗi 5 giây

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-xl">
      {/* Slides */}
      <div 
        className="absolute w-full h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="absolute top-0 left-0 w-full h-full"
            style={{ transform: `translateX(${index * 100}%)` }}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-40">
              <div className="absolute bottom-20 left-10 text-white max-w-xl">
                <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
                <p className="text-xl mb-6">{slide.description}</p>
                <Button size="lg" className="bg-primary-500 hover:bg-primary-600" asChild>
                  <Link href="/event-page">Tìm hiểu thêm</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
      >
        ←
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
      >
        →
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              currentSlide === index ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeSlider;
