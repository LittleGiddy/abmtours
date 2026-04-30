import { Schema, model, models } from 'mongoose';

const DestinationImageSchema = new Schema({
  url: { type: String, required: true },      // public URL of the image
  filename: { type: String, required: true },
  alt: { type: String, default: 'Destination image' },
  order: { type: Number, default: 0 },        // for manual sorting
  createdAt: { type: Date, default: Date.now },
});

export default models.DestinationImage || model('DestinationImage', DestinationImageSchema);