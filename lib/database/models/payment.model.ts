import { Schema, model, models } from 'mongoose';

const PaymentSchema = new Schema({
  organizerId: { type: Schema.Types.ObjectId, ref: 'Organizer', required: true },
  eventTitle: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true },
  paymentDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Payment = models.Payment || model('Payment', PaymentSchema);

export default Payment; 