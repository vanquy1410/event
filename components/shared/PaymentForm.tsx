import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import {
  loadStripe,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  organizerId: string;
  eventTitle: string;
  price: number;
  signature: string | null | undefined;
}

const CheckoutForm = ({ 
  organizerId, 
  eventTitle, 
  price,
  signature 
}: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    name: '',
    email: '',
  });

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      toast.error('Stripe chưa được khởi tạo');
      return;
    }

    if (!signature) {
      toast.error('Vui lòng tạo chữ ký số trước khi thanh toán');
      return;
    }

    try {
      setIsProcessing(true);

      // Tạo Payment Intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: price,
          email: paymentInfo.email,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Không thể tạo payment intent');
      }

      const { clientSecret } = data;

      // Xác nhận thanh toán
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              name: paymentInfo.name,
              email: paymentInfo.email,
            },
          },
        }
      );

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      // Lưu thông tin thanh toán
      if (paymentIntent.status === 'succeeded') {
        const savePaymentResponse = await fetch('/api/organizer/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            organizerId,
            eventTitle,
            price,
            signature,
            paymentIntentId: paymentIntent.id,
            email: paymentInfo.email,
          }),
        });

        const data = await savePaymentResponse.json();
        if (!savePaymentResponse.ok) {
          throw new Error(data.error);
        }

        toast.success('Thanh toán thành công!');
        window.location.href = `/organizer/payment/success/${data.paymentId}`;
      }

    } catch (error: any) {
      console.error('Lỗi thanh toán:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi thanh toán');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="mt-6 p-4 border rounded-lg space-y-4">
      <h3 className="text-xl font-semibold mb-4">Thông tin thanh toán</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-gray-600">Tên sự kiện: {eventTitle}</p>
          <p className="text-gray-600">Số tiền: {price.toLocaleString('vi-VN')}đ</p>
        </div>

        <div className="space-y-2">
          <Input
            name="name"
            placeholder="Tên chủ thẻ"
            value={paymentInfo.name}
            onChange={(e) => setPaymentInfo(prev => ({ ...prev, name: e.target.value }))}
            required
          />
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={paymentInfo.email}
            onChange={(e) => setPaymentInfo(prev => ({ ...prev, email: e.target.value }))}
            required
          />
          <div className="border rounded-md p-3">
            <CardElement 
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
                hidePostalCode: true,
              }}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isProcessing || !stripe}
          className="w-full"
        >
          {isProcessing ? 'Đang xử lý...' : 'Thanh toán ngay'}
        </Button>
      </div>
    </form>
  );
};

// Wrapper component
const PaymentForm: React.FC<PaymentFormProps> = (props) => {
  const options: StripeElementsOptions = {
    mode: 'payment',
    currency: 'vnd',
    amount: props.price * 100,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm {...props} />
    </Elements>
  );
};

export default PaymentForm; 