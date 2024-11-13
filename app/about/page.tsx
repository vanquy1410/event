"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

const AboutPage = () => {
  const visionItems = [
    {
      number: "1",
      title: "Kết nối và Đổi mới",
      description: "Chúng tôi kết nối mọi ý tưởng sáng tạo trong lĩnh vực sự kiện, từ những buổi hội thảo chuyên nghiệp đến các sự kiện giải trí đa dạng, mang đến trải nghiệm độc đáo cho người tham gia.",
      image: "/assets/images/vision-1.jpg"
    },
    {
      number: "2",
      title: "Giá trị bền vững",
      description: "Chúng tôi tạo ra giá trị mới cho các đối tác bằng cách cung cấp nền tảng chuyên nghiệp, hiện đại và đáng tin cậy trong việc tổ chức và quản lý sự kiện.",
      image: "/assets/images/vision-2.jpg"
    },
    {
      number: "3",
      title: "Hệ sinh thái toàn diện",
      description: "Chúng tôi xây dựng một hệ sinh thái sự kiện toàn diện, nơi kết nối ban tổ chức, người tham gia và các đối tác, tạo nên một cộng đồng sự kiện sôi động và phát triển.",
      image: "/assets/images/vision-3.jpg"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0,
      y: 50
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const numberVariants = {
    hidden: { 
      scale: 0,
      opacity: 0
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "backOut"
      }
    }
  };

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
            Về Chúng Tôi
          </motion.h1>
        </div>
      </section>

      <section className="wrapper my-8">
        <div className="flex flex-col gap-8 md:gap-12">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="h2-bold mb-4">TẦM NHÌN</h2>
            <motion.div 
              className="w-full h-0.5 bg-blue-500 max-w-[200px] mx-auto"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.3 }}
            ></motion.div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {visionItems.map((item, index) => (
              <motion.div 
                key={index} 
                className="relative group"
                variants={itemVariants}
              >
                <div className="relative h-[300px] overflow-hidden rounded-xl">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <motion.div 
                    className="absolute inset-0 bg-black/50 flex items-center justify-center"
                    variants={numberVariants}
                  >
                    <motion.span 
                      className="text-white text-6xl font-bold"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, ease: "backOut" }}
                    >
                      {item.number}
                    </motion.span>
                  </motion.div>
                </div>
                <div className="mt-4 p-4 bg-white rounded-xl shadow-md">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="wrapper my-8">
        <div className="flex flex-col gap-8 md:gap-12">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Image
                src="/assets/images/mission.jpg"
                alt="Mission"
                width={500}
                height={500}
                className="rounded-lg object-cover shadow-lg"
              />
            </motion.div>

            <motion.div 
              className="flex-1 space-y-4"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h2 
                className="h2-bold"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Sứ Mệnh
              </motion.h2>
              <motion.div 
                className="w-20 h-1 bg-blue-500"
                initial={{ width: 0 }}
                whileInView={{ width: 80 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              ></motion.div>
              <motion.p 
                className="p-regular-20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Chúng tôi cam kết mang đến giải pháp toàn diện trong việc tổ chức sự kiện, 
                giúp các đối tác và khách hàng dễ dàng tạo ra những sự kiện chuyên nghiệp, 
                hiệu quả và đầy cảm hứng.
              </motion.p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary-50 p-6 rounded-xl">
              <h3 className="font-bold text-xl mb-2">Sáng Tạo</h3>
              <p>Luôn đổi mới và tìm kiếm những giải pháp độc đáo cho mỗi sự kiện</p>
            </div>
            <div className="bg-primary-50 p-6 rounded-xl">
              <h3 className="font-bold text-xl mb-2">Chất Lượng</h3>
              <p>Cam kết mang đến dịch vụ chuyên nghiệp và trải nghiệm tốt nhất</p>
            </div>
            <div className="bg-primary-50 p-6 rounded-xl">
              <h3 className="font-bold text-xl mb-2">Đồng Hành</h3>
              <p>Luôn sát cánh cùng khách hàng trong mọi giai đoạn của sự kiện</p>
            </div>
          </div>
        </div>
      </section>

      <section className="wrapper my-8">
        <motion.div 
          className="flex flex-col gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h2 
            className="h2-bold text-center"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            TÍNH NĂNG
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Feature 1 */}
            <motion.div 
              className="flex gap-8 items-center"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative w-[200px] h-[200px] rounded-lg overflow-hidden">
                <Image
                  src="/assets/images/feature-1.jpg"
                  alt="Ứng dụng"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Image
                    src="/assets/icons/mobile.svg"
                    alt="Mobile icon"
                    width={24}
                    height={24}
                    className="text-blue-500"
                  />
                  <h3 className="text-xl font-bold text-blue-500">Ứng Dụng</h3>
                </div>
                <p className="text-gray-600">
                  Trải nghiệm của khách hàng sẽ được mang vào ứng dụng dành riêng cho di động
                </p>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              className="flex gap-8 items-center"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Image
                    src="/assets/icons/settings.svg"
                    alt="Settings icon"
                    width={24}
                    height={24}
                    className="text-blue-500"
                  />
                  <h3 className="text-xl font-bold text-blue-500">Công Cụ Quản Lý Và Kiểm Soát</h3>
                </div>
                <p className="text-gray-600">
                  Hệ điều hành có khả năng tích hợp để quản lý và kiểm soát
                </p>
              </div>
              <div className="relative w-[200px] h-[200px] rounded-lg overflow-hidden">
                <Image
                  src="/assets/images/feature-2.jpg"
                  alt="Quản lý"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              className="flex gap-8 items-center"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="relative w-[200px] h-[200px] rounded-lg overflow-hidden">
                <Image
                  src="/assets/images/feature-3.jpg"
                  alt="Phân tích"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Image
                    src="/assets/icons/chart.svg"
                    alt="Chart icon"
                    width={24}
                    height={24}
                    className="text-blue-500"
                  />
                  <h3 className="text-xl font-bold text-blue-500">Phân Tích Thời Gian Thực</h3>
                </div>
                <p className="text-gray-600">
                  Cân bằng cung cầu bằng việc phân tích thời gian thực của nhiều đối tượng khách hàng
                </p>
              </div>
            </motion.div>

            {/* Feature 4 */}
            <motion.div 
              className="flex gap-8 items-center"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Image
                    src="/assets/icons/optimize.svg"
                    alt="Optimize icon"
                    width={24}
                    height={24}
                    className="text-blue-500"
                  />
                  <h3 className="text-xl font-bold text-blue-500">Vận Hành Và Tối Ưu Hóa</h3>
                </div>
                <p className="text-gray-600">
                  Giải pháp vận hành và tích hợp hệ thống dựa trên yêu cầu của khách hàng
                </p>
              </div>
              <div className="relative w-[200px] h-[200px] rounded-lg overflow-hidden">
                <Image
                  src="/assets/images/feature-4.jpg"
                  alt="Tối ưu"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutPage;
