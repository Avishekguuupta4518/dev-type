import mongoose, { Schema, model, models } from 'mongoose';

export interface IScore {
  _id: string;
  userId: mongoose.Types.ObjectId;
  wpm: number;
  accuracy: number;
  language: string;
  duration: number;
  timestamp: Date;
}

const ScoreSchema = new Schema<IScore>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  wpm: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  language: { type: String, required: true },
  duration: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

// Index for leaderboard queries
ScoreSchema.index({ wpm: -1, timestamp: -1 });
ScoreSchema.index({ userId: 1, timestamp: -1 });

export const Score = models.Score || model<IScore>('Score', ScoreSchema);
