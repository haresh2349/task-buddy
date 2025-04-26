import mongoose from "mongoose";

export enum TodoStatus {
    PENDING = "pending",
    COMPLETED = "completed"
}

export interface ITodo extends Document {
    title: string;
    description?: string;
    dueDate?: Date;
    status: TodoStatus;
    user: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}