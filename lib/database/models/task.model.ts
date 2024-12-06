import { Schema, model, models, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  assignedTo: string; // Clerk User ID
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'in-progress' | 'completed';
  labels: string[];
}

const TaskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  assignedTo: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  labels: [{ type: String }],
}, { timestamps: true });

const Task = models.Task || model<ITask>('Task', TaskSchema);

export default Task;

