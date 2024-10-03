import React from 'react';
import OrganizerEventForm from '@/components/shared/OrganizerEventForm';

const OrganizerPage = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Đăng ký ban tổ chức sự kiện</h1>
      <OrganizerEventForm />
    </div>
  );
};

export default OrganizerPage;
