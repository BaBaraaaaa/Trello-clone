import { Schema, model, Document, Types } from 'mongoose';

export interface IColumn extends Document {
  boardId: Types.ObjectId;
  title: string;
  position: number;
  isArchived: boolean;
}

const ColumnSchema = new Schema<IColumn>(
  {
    boardId: { type: Schema.Types.ObjectId, ref: 'Board', required: true },
    title: { type: String, required: true, maxlength: 255 },
    position: { type: Number, required: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ColumnSchema.index({ boardId: 1, position: 1 }, { unique: true });
ColumnSchema.index({ boardId: 1, isArchived: 1 });

export default model<IColumn>('Column', ColumnSchema);
