"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const services = [
  {
    title: "Tổ Chức Sự Kiện",
    description: "Dịch vụ tổ chức sự kiện chuyên nghiệp với đội ngũ có kinh nghiệm",
    image: "/assets/images/services/event-planning.png",
    features: [
      "Lên kế hoạch chi tiết",
      "Quản lý sự kiện",
      "Thiết kế và trang trí",
      "Điều phối nhân sự"
    ],
    hashtags: ["#TổChứcSựKiện", "#ChuyênNghiệp", "#TrọnGói"]
  },
  {
    title: "Quản Lý Vé",
    description: "Hệ thống quản lý vé thông minh, tích hợp công nghệ hiện đại",
    image: "/assets/images/services/ticket-management.png",
    features: [
      "Bán vé online",
      "Quét mã QR",
      "Thống kê real-time",
      "Bảo mật thông tin"
    ],
    hashtags: ["#QuảnLýVé", "#Online", "#ThôngMinh"]
  },
  {
    title: "Marketing Sự Kiện",
    description: "Giải pháp quảng bá sự kiện đa kênh, tiếp cận đúng đối tượng",
    image: "/assets/images/services/event-marketing.png",
    features: [
      "Social Media Marketing",
      "Email Marketing",
      "Content Creation",
      "Influencer Marketing"
    ],
    hashtags: ["#Marketing", "#QuảngBá", "#TruyềnThông"]
  },
  {
    title: "Hỗ Trợ Kỹ Thuật",
    description: "Đội ngũ kỹ thuật chuyên nghiệp, hỗ trợ 24/7",
    image: "/assets/images/services/technical-support.png",
    features: [
      "Hỗ trợ trực tuyến",
      "Giải đáp thắc mắc",
      "Xử lý sự cố",
      "Bảo trì hệ thống"
    ],
    hashtags: ["#HỗTrợ", "#KỹThuật", "#24/7"]
  }
];

const ServicesPage = () => {
  return (
    <div className="min-h-screen">
      <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
        <div className="wrapper">
          <motion.h1 
            className="h1-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Dịch Vụ Của Chúng Tôi
          </motion.h1>
        </div>
      </section>

      <section className="wrapper my-8">
        <div className="grid gap-8">
          {services.map((service, index) => (
            <motion.div 
              key={index}
              className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-xl overflow-hidden shadow-lg"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="relative h-[300px] md:h-[400px]">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">{service.title}</h2>
                <p className="text-gray-600 mb-4">{service.description}</p>
                
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Tính năng chính:</h3>
                  <ul className="grid grid-cols-2 gap-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2">
                  {service.hashtags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="bg-primary-50 text-primary-500 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="wrapper my-8">
        <motion.div 
          className="bg-primary-50 p-8 rounded-xl text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="h2-bold mb-4">Bắt Đầu Với Evently</h2>
          <p className="text-gray-600 mb-6">
            Hãy để chúng tôi giúp bạn tổ chức sự kiện thành công
          </p>
          <Link href="/organizer">
            <motion.button 
              className="bg-primary-500 text-white px-6 py-3 rounded-full hover:bg-primary-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Liên Hệ Ngay
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default ServicesPage; 