"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button'
import { getAllContactForms, deleteContactForm } from '@/lib/actions/contact.actions';
import ContactFormTable from '../_component/ContactFormTable';

const ContactFormManagementPage: React.FC = () => {
  const [contactForms, setContactForms] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContactForms = async () => {
      try {
        const fetchedContactForms = await getAllContactForms({
          query: query,
          limit: 10,
          page: 1
        });
        setContactForms(fetchedContactForms?.data || []);
      } catch (err) {
        console.error('Lỗi khi tải danh sách form liên hệ:', err);
        setError('Không thể tải danh sách form liên hệ. Vui lòng thử lại sau.');
      }
    };

    fetchContactForms();
  }, [query]);

  const handleDelete = async (contactFormId: string) => {
    await deleteContactForm({ contactFormId, path: '/admin/dashboard/contact-form-management' });
    setContactForms(contactForms.filter((form: any) => form._id !== contactFormId));
  };

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className='h3-bold text-center sm:text-left'>Quản lý form liên hệ</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/admin/dashboard">
              Quay lại Dashboard
            </Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <ContactFormTable 
          contactForms={contactForms} 
          onDelete={handleDelete} 
          onSearch={setQuery}
        />
      </section>
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
};

export default ContactFormManagementPage;
