import { Schema, model, Document } from 'mongoose';

export interface ICardLabel extends Document {
  cardId: Schema.Types.ObjectId;
  labelId: Schema.Types.ObjectId;
}

const CardLabelSchema = new Schema<ICardLabel>(
  {
    cardId: { type: Schema.Types.ObjectId, ref: 'Card', required: true },
    labelId: { type: Schema.Types.ObjectId, ref: 'Label', required: true },
  },
  { timestamps: true }
);

CardLabelSchema.index({ cardId: 1, labelId: 1 }, { unique: true });
CardLabelSchema.index({ labelId: 1 });

export default model<ICardLabel>('CardLabel', CardLabelSchema);
