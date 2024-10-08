import React from 'react';
import { Button } from '@/components/ui/button';

interface EditOrganizerButtonProps {
  onClick: () => void;
}

const EditOrganizerButton: React.FC<EditOrganizerButtonProps> = ({ onClick }) => {
  return (
    <Button
      type="button"
      className="bg-blue-500 hover:bg-blue-600 text-white"
      onClick={onClick}
    >
      Sửa thông tin ban tổ chức
    </Button>
  );
};

export default EditOrganizerButton;
