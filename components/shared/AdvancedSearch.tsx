"use client"

import React, { useState, useEffect, useRef } from 'react';
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
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Tham chiếu đến dropdown

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const history = localStorage.getItem('searchHistory');
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchValues(prev => ({ ...prev, [name]: value }));
    setShowHistory(true); // Hiển thị lịch sử ngay khi nhấp vào ô tìm kiếm
  };

  const handleFreeToggle = () => {
    setSearchValues(prev => ({ ...prev, isFree: !prev.isFree }));
  };

  const handleSearch = () => {
    const newHistory = [...searchHistory, searchValues.query];

    // Giới hạn lịch sử tìm kiếm tối đa 5 từ khóa
    const uniqueHistory = Array.from(new Set(newHistory)); // Loại bỏ từ khóa trùng lặp
    const limitedHistory = uniqueHistory.slice(-5); // Giữ lại 5 từ khóa gần nhất

    setSearchHistory(limitedHistory);
    if (typeof window !== 'undefined') {
      localStorage.setItem('searchHistory', JSON.stringify(limitedHistory));
    }
    const queryString = new URLSearchParams();
    Object.entries(searchValues).forEach(([key, value]) => {
      if (value !== '' && value !== false) queryString.append(key, String(value));
    });
    router.push(`/event-page?${queryString.toString()}`);
  };

  const handleHistoryClick = (query: string) => {
    setSearchValues(prev => ({ ...prev, query }));
    setShowHistory(false);
    router.push(`/event-page?query=${query}`);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowHistory(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full max-w-3xl mx-auto">
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
      {showHistory && (
        <div ref={dropdownRef} className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1">
          {searchHistory.map((item, index) => (
            <div
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleHistoryClick(item)}
            >
              {item}
            </div>
          ))}
        </div>
      )}
      {/* <div>
        <p className="p-regular-20 md:p-regular-24">Lịch sử tìm kiếm:</p>
        <ul>
          {searchHistory.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div> */}
    </div>
  );
};

export default AdvancedSearch;