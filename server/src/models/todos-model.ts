import mongoose, { Schema, Document } from "mongoose";
import { ITodo, TodoStatus } from "../types/todos-types";



const todoSchema: Schema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        maxlength: [100, "Title cannot exceed 100 characters"]
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, "Description cannot exceed 500 characters"]
    },
    dueDate: {
        type: Date,
        validate: {
            validator: function (value: Date) {
                return !value || value > new Date();
            },
            message: "Due date must be in the future"
        }
    },
    status: {
        type: String,
        enum: Object.values(TodoStatus),
        default: TodoStatus.PENDING
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
});

// Index for frequently queried fields
todoSchema.index({ user: 1, status: 1 });
todoSchema.index({ user: 1, dueDate: 1 });

export const TodoModel = mongoose.model<ITodo>("Todo", todoSchema);