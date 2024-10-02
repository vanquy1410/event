import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    userName: '',
    phoneNumber: '',
    address: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setFormData({ userName: '', phoneNumber: '', address: '', email: '', message: '' });
      } else {
        alert(data.message || 'Đã xảy ra lỗi khi gửi thông tin liên hệ.');
      }
    } catch (error) {
      console.error('Lỗi:', error);
      alert('Đã xảy ra lỗi khi gửi thông tin liên hệ.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg">
      <Input
        type="text"
        name="userName"
        placeholder="Họ và tên"
        value={formData.userName}
        onChange={handleChange}
        required
        className="bg-gray-100"
      />
      <Input
        type="tel"
        name="phoneNumber"
        placeholder="Số điện thoại"
        value={formData.phoneNumber}
        onChange={handleChange}
        required
        className="bg-gray-100"
      />
      <Input
        type="text"
        name="address"
        placeholder="Địa chỉ"
        value={formData.address}
        onChange={handleChange}
        required
        className="bg-gray-100"
      />
      <Input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="bg-gray-100"
      />
      <Textarea
        name="message"
        placeholder="Nội dung liên hệ"
        value={formData.message}
        onChange={handleChange}
        required
        className="bg-gray-100"
      />
      <Button type="submit" className="w-full">Gửi</Button>
    </form>
  );
};

export default ContactForm;
