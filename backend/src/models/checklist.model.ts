import { Schema, model, Document, Types } from 'mongoose';

export interface IChecklist extends Document {
  cardId: Types.ObjectId;
  text: string;
  completed: boolean;
  position: number;
}

const ChecklistSchema = new Schema<IChecklist>(
  {
    cardId: { type: Schema.Types.ObjectId, ref: 'Card', required: true },
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    position: { type: Number, required: true },
  },
  { timestamps: true }
);

ChecklistSchema.index({ cardId: 1, position: 1 }, { unique: true });

export default model<IChecklist>('ChecklistItem', ChecklistSchema);
