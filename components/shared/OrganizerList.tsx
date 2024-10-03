import React from 'react';
import { IOrganizer } from '@/lib/database/models/organizer.model';

interface OrganizerListProps {
  organizers: IOrganizer[];
}

const OrganizerList: React.FC<OrganizerListProps> = ({ organizers }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Danh sách Ban Tổ Chức</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Tên</th>
            <th className="py-2 px-4 border-b">Sự kiện</th>
            <th className="py-2 px-4 border-b">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {organizers.map((organizer, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
              <td className="py-2 px-4 border-b">{organizer.name}</td>
              <td className="py-2 px-4 border-b">{organizer.eventTitle}</td>
              <td className="py-2 px-4 border-b">{organizer.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrganizerList;
