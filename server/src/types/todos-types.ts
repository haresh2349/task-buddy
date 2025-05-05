import mongoose from "mongoose";

export enum TodoStatus {
    TODO='todo',
    PENDING = "inprogress",
    COMPLETED = "done"
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