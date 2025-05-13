import { Types } from "mongoose";
import { TodoStatus } from "../types/todos-types";
import { TodoModel } from "../models/todos-model";
import { CustomError } from "../errors/custom-error";
import UserModel from "../models/user-model";

interface CreateTodoProps {
  title: string;
  description?: string;
  dueDate?: Date;
  status?: TodoStatus;
  userId: Types.ObjectId;
}

// service to create a todo for particular user
export const createTodo = async (newTodo: CreateTodoProps) => {
  try {
    // 1. Create new todo document
    const todo = await TodoModel.create({
      title: newTodo.title,
      description: newTodo.description,
      dueDate: newTodo.dueDate,
      status: newTodo.status || TodoStatus.PENDING,
      user: newTodo.userId,
    });

    // 2. Return the created todo (without sensitive fields)
    return await TodoModel.findById(todo._id).select("-__v -user").lean();
  } catch (error) {
    console.error(error, "error");
  }
};

interface GetUserTodosParams {
  userId: Types.ObjectId;
  status?: TodoStatus;
  search?: string;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
}

// service to get todos of particular user
export const getUserTodos = async (params: GetUserTodosParams) => {
  try {
    // 1. Build the query
    const query: any = { user: params.userId };

    // Status filter
    if (params.status && Object.values(TodoStatus).includes(params.status)) {
      query.status = params.status;
    }

    // Search filter (title or description)
    if (params.search) {
      query.$or = [
        { title: { $regex: params.search, $options: "i" } },
        { description: { $regex: params.search, $options: "i" } },
      ];
    }

    // 2. Build sort options
    const sortOptions: any = {};
    sortOptions[params.sortBy] = params.sortOrder === "desc" ? -1 : 1;

    // 3. Execute queries
    const [todos, totalCount] = await Promise.all([
      TodoModel.find(query)
        .select("-__v -user")
        .sort(sortOptions)
        .skip((params.page - 1) * params.limit)
        .limit(params.limit)
        .lean(),
      TodoModel.countDocuments(query),
    ]);

    return {
      todos,
      totalCount,
    };
  } catch (error) {
    throw new CustomError(500, "Failed to fetch todos");
  }
};

interface DeleteTodosParams {
  userId: Types.ObjectId;
  todoIds: string[]; // Array of todo IDs as strings
}

// service to delete todos of particular user
export const deleteTodos = async ({ userId, todoIds }: DeleteTodosParams) => {
  try {
    // 1. Validate IDs and convert to ObjectId
    const validIds = todoIds.filter((id) => Types.ObjectId.isValid(id));

    if (validIds.length === 0) {
      return { deletedCount: 0 };
    }

    // 2. Perform deletion
    const result = await TodoModel.deleteMany({
      _id: { $in: validIds },
      user: userId, // Ensure user owns these todos
    });

    // 3. Return deletion result
    return {
      deletedCount: result.deletedCount,
    };
  } catch (error) {
    throw new CustomError(500, "Failed to delete todos");
  }
};

interface UpdateTodoParams {
  todoId: string;
  userId: Types.ObjectId;
  updates: {
    title?: string;
    description?: string;
    dueDate?: Date;
    status?: TodoStatus;
  };
}

// service to update a todoItem
export const updateTodoItem = async (params: UpdateTodoParams) => {
  try {
    // 1. Validate todoId
    if (!Types.ObjectId.isValid(params.todoId)) {
      throw new CustomError(400, "Invalid todo ID");
    }

    // 2. Prepare update object with only allowed fields
    const updateObj: any = {};
    if (params.updates.title) updateObj.title = params.updates.title;
    if (params.updates.description !== undefined)
      updateObj.description = params.updates.description;
    if (params.updates.dueDate !== undefined)
      updateObj.dueDate = params.updates.dueDate;
    if (params.updates.status) {
      if (!Object.values(TodoStatus).includes(params.updates.status)) {
        throw new CustomError(400, "Invalid status value");
      }
      updateObj.status = params.updates.status;
    }

    // 3. Perform the update
    const updatedTodo = await TodoModel.findOneAndUpdate(
      {
        _id: params.todoId,
        user: params.userId, // Ensure user owns the todo
      },
      updateObj,
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators on update
      }
    ).select("-__v -user"); // Exclude unnecessary fields

    if (!updatedTodo) {
      throw new CustomError(404, "Todo not found or you don't have permission");
    }

    return updatedTodo;
  } catch (error) {
    if (error instanceof CustomError) throw error;
    throw new CustomError(500, "Failed to update todo");
  }
};

// service to get a single todoItem

export const getSingleTodo = async (todoId: string, userId: string) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new CustomError(401, "UnAuthorized request!");
    }

    const todo = await TodoModel.findOne({ _id: todoId, user: userId });
    if (!todo) {
      throw new CustomError(404, "Invalid task id!");
    }

    return todo;
  } catch (error) {
    throw error;
  }
};
