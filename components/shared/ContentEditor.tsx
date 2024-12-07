"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Khai báo ReactQuill
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Please wait for loading…</p>,
});

interface ContentEditorProps {
  value: string;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ value }) => {
  return (
    <div className="h-72">
      <ReactQuill 
        value={value} 
        readOnly={true}
        theme="bubble"
        placeholder="Nội dung không có sẵn"                
      />
    </div>
  );
};

export default ContentEditor;
