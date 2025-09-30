import { Schema, model, Document } from 'mongoose';

export interface ILabel extends Document {
  boardId: Schema.Types.ObjectId;
  name: string;
  color: string;
}

const LabelSchema = new Schema<ILabel>(
  {
    boardId: { type: Schema.Types.ObjectId, ref: 'Board', required: true },
    name: { type: String, required: true, maxlength: 100, trim: true },
    color: { type: String, required: true, match: /^#[0-9A-F]{6}$/i },
  },
  { timestamps: true }
);

LabelSchema.index({ boardId: 1, name: 1 }, { unique: true });
LabelSchema.index({ boardId: 1, color: 1 });

export default model<ILabel>('Label', LabelSchema);
