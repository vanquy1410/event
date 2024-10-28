declare module 'qrcode.react' {
  import { Component } from 'react';

  interface QRCodeProps {
    value: string;
    size?: number;
    level?: 'L' | 'M' | 'Q' | 'H';
    includeMargin?: boolean;
    renderAs?: 'canvas' | 'svg';
    imageSettings?: {
      src: string;
      x: number;
      y: number;
      height: number;
      width: number;
      excavate?: boolean;
    };
  }

  export default class QRCode extends Component<QRCodeProps> {}
}

