"use client"

import { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface FavoriteButtonProps {
  eventId: string;
  userId: string;
  onFavoriteChange?: () => void;
}

const FavoriteButton = ({ eventId, userId, onFavoriteChange }: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await fetch(`/api/favorites/check?userId=${userId}&eventId=${eventId}`);
        const data = await response.json();
        setIsFavorite(data.isFavorite);
      } catch (error) {
        console.error('Lỗi khi kiểm tra trạng thái yêu thích:', error);
      }
    };

    if (userId) {
      checkFavoriteStatus();
    }
  }, [eventId, userId]);

  const handleToggleFavorite = async () => {
    if (isFavorite) {
      setShowConfirmDialog(true);
    } else {
      await addToFavorites();
    }
  };

  const addToFavorites = async () => {
    try {
      await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, eventId }),
      });
      setIsFavorite(true);
    } catch (error) {
      console.error('Lỗi khi thêm vào yêu thích:', error);
    }
  };

  const removeFromFavorites = async () => {
    try {
      await fetch('/api/favorites', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, eventId }),
      });
      setIsFavorite(false);
      setShowConfirmDialog(false);
      if (onFavoriteChange) {
        onFavoriteChange();
      }
    } catch (error) {
      console.error('Lỗi khi xóa khỏi yêu thích:', error);
    }
  };

  return (
    <>
      <button
        onClick={handleToggleFavorite}
        className="p-2 hover:scale-110 transition-transform"
      >
        <FaStar
          className={`text-2xl ${
            isFavorite ? 'text-yellow-400' : 'text-gray-300'
          }`}
        />
      </button>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận bỏ thích</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn bỏ thích sự kiện này không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={removeFromFavorites}>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FavoriteButton; 