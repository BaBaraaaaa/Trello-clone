import { Schema, model, Document } from 'mongoose';

export interface IBoardMember extends Document {
  boardId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  role: 'owner' | 'admin' | 'member' | 'observer';
  isStarred: boolean;
  joinedAt: Date;
}

const BoardMemberSchema = new Schema<IBoardMember>(
  {
    boardId: { type: Schema.Types.ObjectId, ref: 'Board', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: {
      type: String,
      enum: ['owner', 'admin', 'member', 'observer'],
      default: 'member',
    },
    isStarred: { type: Boolean, default: false },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

BoardMemberSchema.index({ boardId: 1, userId: 1 }, { unique: true });

export default model<IBoardMember>('BoardMember', BoardMemberSchema);
