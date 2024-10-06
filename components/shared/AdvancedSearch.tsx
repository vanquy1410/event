"use client"

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const AdvancedSearch = () => {
  const router = useRouter();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [searchParams, setSearchParams] = useState({
    query: '',
    startDate: '',
    endDate: '',
    minPrice: '',
    maxPrice: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    const queryString = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) queryString.append(key, value);
    });
    router.push(`/?${queryString.toString()}`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          name="query"
          placeholder="Tìm kiếm sự kiện..."
          value={searchParams.query}
          onChange={handleInputChange}
          className="flex-grow"
        />
        <Button onClick={handleSearch}>Tìm kiếm</Button>
        <Button 
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          variant="outline"
        >
          {isAdvancedOpen ? <FaChevronUp /> : <FaChevronDown />}
        </Button>
      </div>
      
      {isAdvancedOpen && (
        <div className="mt-4 space-y-4">
          <div className="flex space-x-2">
            <Input
              type="date"
              name="startDate"
              placeholder="Ngày bắt đầu"
              value={searchParams.startDate}
              onChange={handleInputChange}
            />
            <Input
              type="date"
              name="endDate"
              placeholder="Ngày kết thúc"
              value={searchParams.endDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex space-x-2">
            <Input
              type="number"
              name="minPrice"
              placeholder="Giá thấp nhất"
              value={searchParams.minPrice}
              onChange={handleInputChange}
            />
            <Input
              type="number"
              name="maxPrice"
              placeholder="Giá cao nhất"
              value={searchParams.maxPrice}
              onChange={handleInputChange}
            />
          </div>
          <Button onClick={handleSearch} className="w-full">Tìm kiếm nâng cao</Button>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;