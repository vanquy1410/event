"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button'
import { getAllEmployees, deleteEmployee } from '@/lib/actions/employee.actions';
import EmployeeTable from '../_component/EmployeeTable';

const EmployeeManagementPage: React.FC = () => {
  const [employees, setEmployees] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const fetchedEmployees = await getAllEmployees({
          query: query,
          limit: 10,
          page: 1
        });
        console.log('Fetched employees:', fetchedEmployees);
        setEmployees(fetchedEmployees?.data || []);
      } catch (err) {
        console.error('Lỗi khi tải danh sách nhân viên:', err);
        setError('Không thể tải danh sách nhân viên. Vui lòng thử lại sau.');
      }
    };

    fetchEmployees();
  }, [query]);

  const handleDelete = async (employeeId: string) => {
    await deleteEmployee({ employeeId, path: '/admin/dashboard/employee-management' });
    setEmployees(employees.filter((employee: any) => employee._id !== employeeId));
  };

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className='h3-bold text-center sm:text-left'>Quản lý nhân viên</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/admin/dashboard/employee-management/create">
              Thêm nhân viên mới
            </Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <EmployeeTable 
          employees={employees} 
          onDelete={handleDelete} 
          onSearch={setQuery}
        />
      </section>
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
};

export default EmployeeManagementPage;
