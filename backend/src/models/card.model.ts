import { Schema, model, Document } from 'mongoose';

export interface ICard extends Document {
  columnId: Schema.Types.ObjectId;
  boardId: Schema.Types.ObjectId;
  title: string;
  description?: string;
  position: number;
  dueDate?: Date;
  isCompleted: boolean;
  isArchived: boolean;
  coverColor?: string;
  coverAttachmentId?: Schema.Types.ObjectId;
  createdBy: Schema.Types.ObjectId;
}

const CardSchema = new Schema<ICard>(
  {
    columnId: { type: Schema.Types.ObjectId, ref: 'Column', required: true },
    boardId: { type: Schema.Types.ObjectId, ref: 'Board', required: true },
    title: { type: String, required: true, maxlength: 500 },
    description: { type: String },
    position: { type: Number, required: true },
    dueDate: { type: Date },
    isCompleted: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    coverColor: { type: String, match: /^#[0-9A-F]{6}$/i },
    coverAttachmentId: { type: Schema.Types.ObjectId, ref: 'Attachment' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

CardSchema.index({ columnId: 1, position: 1 }, { unique: true });
CardSchema.index({ boardId: 1, isArchived: 1, position: 1 });
CardSchema.index({ dueDate: 1, isCompleted: 1 });
CardSchema.index({ createdBy: 1 });

export default model<ICard>('Card', CardSchema);
