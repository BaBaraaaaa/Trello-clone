import { Schema, model, Document } from 'mongoose';

export interface IWorkspace extends Document {
  name: string;
  description?: string;
  type: 'personal' | 'team' | 'enterprise';
  visibility: 'private' | 'public';
  createdBy: Schema.Types.ObjectId;
}

const WorkspaceSchema = new Schema<IWorkspace>(
  {
    name: { type: String, required: true, maxlength: 255 },
    description: { type: String },
    type: { type: String, enum: ['personal', 'team', 'enterprise'], default: 'personal' },
    visibility: { type: String, enum: ['private', 'public'], default: 'private' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

WorkspaceSchema.index({ createdBy: 1 });
WorkspaceSchema.index({ visibility: 1 });

export default model<IWorkspace>('Workspace', WorkspaceSchema);
