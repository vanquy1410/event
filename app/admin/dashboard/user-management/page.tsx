"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button'
import { getAllUsers, IUserItem } from '@/lib/actions/user.actions';
import { Input } from '@/components/ui/input';
import { setRole } from "../_actions";

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<IUserItem[]>([]);
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getAllUsers();
      setUsers(Array.isArray(fetchedUsers) ? fetchedUsers : []);
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(query.toLowerCase()) ||
    user.lastName.toLowerCase().includes(query.toLowerCase()) ||
    user.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className='h3-bold text-center sm:text-left'>Quản lý người dùng</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/admin/dashboard">
              Quay lại Dashboard
            </Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <div className="flex items-center justify-between mb-4">
          <Image src="/assets/icons/search.svg" alt="search" width={20} height={20} />
          <Input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 p-regular-16 border-0 bg-white outline-none placeholder:text-grey-500 focus:ring-0"
          />
        </div>
        <h3 className="text-center text-2xl font-bold mb-4">Danh sách người dùng</h3>

        <div className="overflow-x-auto shadow-lg rounded-lg">
          {filteredUsers.length === 0 ? (
            <p className="text-center py-4">Không tìm thấy người dùng.</p>
          ) : (
            <table className="w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-4 px-6 text-left">Số thứ tự</th>
                  <th className="py-4 px-6 text-left">Hình ảnh</th>
                  <th className="py-4 px-6 text-left">Tên</th>
                  <th className="py-4 px-6 text-left">Họ</th>
                  <th className="py-4 px-6 text-left">Email</th>
                  {/* <th className="py-4 px-6 text-center">Hành động</th> */}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.clerkId} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-4 px-6">{index + 1}</td>
                    <td className="py-4 px-6">
                      <img src={user.photo} alt={`${user.firstName} ${user.lastName}`} className="w-12 h-12 rounded-full object-cover" />
                    </td>
                    <td className="py-4 px-6">{user.firstName}</td>
                    <td className="py-4 px-6">{user.lastName}</td>
                    <td className="py-4 px-6">{user.email}</td>
                    {/* <td className="py-4 px-6 text-center">
                      <Link href={`/users/${user.clerkId}/update`} className="text-blue-600 hover:text-blue-800">
                        <Image src="/assets/icons/edit.svg" alt="edit" width={20} height={20} className="inline-block" />
                      </Link>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </>
  );
};

export default UserManagementPage;
