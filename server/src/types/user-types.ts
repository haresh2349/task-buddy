import { Types } from "mongoose";

export interface IUser extends Document {
    _id?:Types.ObjectId
    username:string;
    email:string;
    password:string;
    createdAt?:string;
    updatedAt?:string
}

export interface UserJwtPayload {
    _id:Types.ObjectId;
    email:string;
    username:string;
}