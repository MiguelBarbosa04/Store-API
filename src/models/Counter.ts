import mongoose, { Schema, Document } from "mongoose";

export interface ICounter extends Document {
  name: string;
  value: number;
}

const CounterSchema = new Schema<ICounter>({
  name: { type: String, required: true, unique: true },
  value: { type: Number, default: 0 },
});

export const Counter = mongoose.models.Counter as mongoose.Model<ICounter> || mongoose.model<ICounter>("Counter", CounterSchema);
