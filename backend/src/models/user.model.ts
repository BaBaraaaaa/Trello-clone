import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  fullName: string;
  avatarUrl?: string;
  initials: string;
  isActive: boolean;
  lastLoginAt?: Date;
  refreshTokens: string[];
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, maxlength: 50, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    fullName: { type: String, required: true, maxlength: 100 },
    avatarUrl: { type: String },
    initials: {
      type: String,
      required: true,
      maxlength: 2,
      default: function (this: IUser) {
        const parts = this.fullName.trim().split(/\s+/);
        return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
      },
    },
    isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date },
  refreshTokens: { type: [String], default: [] },
  },
  { timestamps: true }
);


export default model<IUser>('User', UserSchema);
