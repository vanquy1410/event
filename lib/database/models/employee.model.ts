import { Schema, model, models } from 'mongoose';

const EmployeeSchema = new Schema({
  userAccount: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
  position: { type: String, required: true },
});

const Employee = models.Employee || model('Employee', EmployeeSchema);

export default Employee;
