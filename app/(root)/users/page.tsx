"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { getAllUsers } from '@/lib/actions/user.actions';
import { IUserItem } from '@/lib/database/models/user.model';
import { DeleteUser } from '@/components/shared/DeleteUser';
import { Input } from '@/components/ui/input';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<IUserItem[]>([]);
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getAllUsers();
      setUsers(Array.isArray(fetchedUsers) ? fetchedUsers : []); // Ensure fetchedUsers is an array
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
      <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
        <div className="wrapper flex items-center justify-between mb-4">
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

        <div className="table-container overflow-x-auto shadow-lg rounded-lg">
          {filteredUsers.length === 0 ? (
            <p className="text-center">Không tìm thấy người dùng.</p>
          ) : (
            <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 border-b border-gray-300">Số thứ tự</th>
                  <th className="py-3 px-4 border-b border-gray-300">Hình ảnh</th>
                  <th className="py-3 px-4 border-b border-gray-300">Tên</th>
                  <th className="py-3 px-4 border-b border-gray-300">Họ</th>
                  <th className="py-3 px-4 border-b border-gray-300">Email</th>
                  <th className="py-3 px-4 border-b border-gray-300"></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.clerkId} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-4 px-4 border-b border-gray-300 text-center">{index + 1}</td>
                    <td className="py-4 px-4 border-b border-gray-300" style={{ width: '80px', textAlign: 'center' }}>
                      <img src={user.photo} alt={`${user.firstName} ${user.lastName}`} className="w-10 h-10 rounded-full object-cover" />
                    </td>
                    <td className="py-4 px-4 border-b border-gray-300">{user.firstName}</td>
                    <td className="py-4 px-4 border-b border-gray-300">{user.lastName}</td>
                    <td className="py-4 px-4 border-b border-gray-300">{user.email}</td>
                    <td className="py-4 px-4 border-b border-gray-300 flex items-center justify-center gap-2">
                      <Link href={`/users/${user.clerkId}/update`}>
                        <Image src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
                      </Link>
                      <DeleteUser userId={user.clerkId} />
                    </td>
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

export default UserList;
