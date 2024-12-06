import { Schema, model, models, Document } from 'mongoose';

export interface IPayment extends Document {
  _id: string;
  organizerId: string;
  eventTitle: string;
  amount: number;
  status: 'success' | 'failed';
  paymentMethod: string;
  paymentDate: Date;
  createdAt: Date;
  digitalSignature?: string;
}

const paymentSchema = new Schema({
  organizerId: {
    type: String,
    required: true,
  },
  eventTitle: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['success', 'failed'],
    default: 'success'
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  digitalSignature: {
    type: String
  }
});

const Payment = models.Payment || model('Payment', paymentSchema);

export default Payment; 