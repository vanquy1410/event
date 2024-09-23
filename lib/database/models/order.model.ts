import { Document, Schema, model, models } from "mongoose";

export interface IOrder extends Document {
  stripeId: string;
  event: Schema.Types.ObjectId;
  buyer: Schema.Types.ObjectId;
  totalAmount: string;
  createdAt: Date;
}

const OrderSchema = new Schema({
  stripeId: { type: String, required: true },
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  totalAmount: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Order = models.Order || model('Order', OrderSchema);

export default Order;