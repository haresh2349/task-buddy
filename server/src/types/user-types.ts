import { Document, Types } from "mongoose";

export interface IUser {
  _id?: Types.ObjectId;
  googleId?: string;
  username: string;
  email: string;
  password: string;
  refreshToken: string;
  createdAt?: string;
  updatedAt?: string;
  authMethod: "local" | "google";
  isVerified: boolean;
}

export interface IUserMethods {
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export type UserDocument = Document & IUser & IUserMethods;

export interface UserJwtPayload {
  _id: Types.ObjectId;
  email: string;
  username: string;
}

export interface IGetUserAuthInfoRequest extends Request {
  user: string; // or any other type
}
