import React from 'react';
import QRCode from 'qrcode.react';

interface QRCodeComponentProps {
  orderId: string; // ID của đơn hàng
  eventTitle: string; // Tiêu đề sự kiện
  buyerName: string; // Tên người mua
}

const QRCodeComponent: React.FC<QRCodeComponentProps> = ({ orderId, eventTitle, buyerName }) => {
  // Tạo chuỗi dữ liệu cho QR Code
  const qrData = JSON.stringify({
    orderId,
    eventTitle,
    buyerName,
  });

  return (
    <div className="mt-2">
      <QRCode value={qrData} />
    </div>
  );
};

export default QRCodeComponent;

