"use client"

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const AdvancedSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [searchValues, setSearchValues] = useState({
    query: searchParams.get('query') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    isFree: searchParams.get('isFree') === 'true',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchValues(prev => ({ ...prev, [name]: value }));
  };

  const handleFreeToggle = () => {
    setSearchValues(prev => ({ ...prev, isFree: !prev.isFree }));
  };

  const handleSearch = () => {
    const queryString = new URLSearchParams();
    Object.entries(searchValues).forEach(([key, value]) => {
      if (value !== '' && value !== false) queryString.append(key, String(value));
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
          value={searchValues.query}
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
              value={searchValues.startDate}
              onChange={handleInputChange}
            />
            <Input
              type="date"
              name="endDate"
              placeholder="Ngày kết thúc"
              value={searchValues.endDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex space-x-2">
            <Input
              type="number"
              name="minPrice"
              placeholder="Giá thấp nhất"
              value={searchValues.minPrice}
              onChange={handleInputChange}
            />
            <Input
              type="number"
              name="maxPrice"
              placeholder="Giá cao nhất"
              value={searchValues.maxPrice}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              onClick={handleFreeToggle}
              variant={searchValues.isFree ? "default" : "outline"}
            >
              {searchValues.isFree ? "Tất cả sự kiện" : "Chỉ sự kiện miễn phí"}
            </Button>
          </div>
          <Button onClick={handleSearch} className="w-full">Tìm kiếm nâng cao</Button>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;