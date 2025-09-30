import { Schema, model, Document } from 'mongoose';

export interface IBoard extends Document {
  title: string;
  description?: string;
  background: {
    type: 'color' | 'gradient' | 'image';
    value: string;
  };
  visibility: 'private' | 'workspace' | 'public';
  isClosed: boolean;
  createdBy: Schema.Types.ObjectId;
  workspaceId?: Schema.Types.ObjectId;
}

const BoardSchema = new Schema<IBoard>(
  {
    title: { type: String, required: true, maxlength: 255 },
    description: { type: String },
    background: {
      type: {
        type: String,
        enum: ['color', 'gradient', 'image'],
        default: 'gradient',
      },
      value: {
        type: String,
        default: 'linear-gradient(135deg, #026AA7 0%, #4A90C2 50%, #5AAC44 100%)',
      },
    },
    visibility: { type: String, enum: ['private', 'workspace', 'public'], default: 'private' },
    isClosed: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace' },
  },
  { timestamps: true }
);

BoardSchema.index({ createdBy: 1 });
BoardSchema.index({ workspaceId: 1 });
BoardSchema.index({ visibility: 1, isClosed: 1 });

export default model<IBoard>('Board', BoardSchema);
