import mongoose, { Schema, Model, Document } from "mongoose";

interface IResource extends Document {
  name: string;
  type: string;
  url: string;
  createdAt: Date;
}

const ResourceSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Resource = (mongoose.models?.Resource || mongoose.model<IResource>("Resource", ResourceSchema)) as Model<IResource>;

export default Resource;
