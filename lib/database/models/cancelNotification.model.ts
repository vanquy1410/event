import { Schema, model, models } from 'mongoose'

const CancelNotificationSchema = new Schema({
  orderId: { type: String, required: true },
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  eventTitle: { type: String, required: true },
  ticketPrice: { type: Number, required: true },
  cancelDate: { type: Date, default: Date.now },
  message: { type: String, required: true }
})

const CancelNotification = models.CancelNotification || model('CancelNotification', CancelNotificationSchema)

export default CancelNotification 