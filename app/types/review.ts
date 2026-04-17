import { ObjectId } from 'mongodb';

export interface IReview {
  _id?: ObjectId;
  name: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
  tripType?: string;
  destination?: string;
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReviewInput {
  name: string;
  rating: number;
  text: string;
  date: string;
  verified?: boolean;
  tripType?: string;
  destination?: string;
}

export type CreateReviewInput = Omit<IReview, '_id' | 'createdAt' | 'updatedAt' | 'helpful'>;
export type UpdateReviewInput = Partial<CreateReviewInput>;