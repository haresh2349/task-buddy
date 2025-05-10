import { Request, Response } from "express";
import { successResponseHandler } from "../utils/success-response-handler";
import { CustomError } from "../errors/custom-error";
import { TodoStatus } from "../types/todos-types";
import * as todoService from "../services/todos-service"

// controller to create a todo for particular user
export const createTodo = async (req: Request, res: Response) => {
        // 1. Validate input
        const { title, description, dueDate, status } = req.body;
        if (!req?.user) {
            throw new CustomError(401, "UnAuthorized request!");
        }

        const userId = req?.user?._id; // From auth middleware
        
        if(!userId){
            throw new CustomError(401, "UnAuthorized request!") 
        }
        if (!title) {
            throw new CustomError(400, "Title is required");
        }
        if (!dueDate) {
            throw new CustomError(400, "Due date is required");
        }

        const date = new Date(dueDate);
        const isDueDateValid = !isNaN(date.getTime()) && date.toISOString().startsWith(dueDate)
        if(!isDueDateValid){
            throw new CustomError(400,'Invalid Due Date')
        }

        // 2. Validate status if provided
        if (status && !Object.values(TodoStatus).includes(status)) {
            throw new CustomError(400, "Invalid status value");
        }

        // 3. Call service layer
        const todo = await todoService.createTodo({
            title,
            description,
            dueDate,
            status,
            userId
        });

        // 4. Return success response
        successResponseHandler(
            res, 
            201, 
            "Task created successfully", 
            {
                id: todo?._id,
            }
        );
};

// controller to get todos of particular user
export const getUserTodos = async (req: Request, res: Response) => {
    try {
        // 1. Get authenticated user
        if (!req.user) {
            throw new CustomError(401, "Authentication required");
        }
        const userId = req.user._id;

        // 2. Get query parameters
        const status = req.query.status as TodoStatus | undefined;
        const search = req.query.search as string | undefined;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const sortBy = req.query.sortBy as string || "createdAt";
        const sortOrder = req.query.sortOrder as string || "desc";

        // 3. Call service layer
        const { todos, totalCount } = await todoService.getUserTodos({
            userId,
            status,
            search,
            page,
            limit,
            sortBy,
            sortOrder
        });

        // 4. Return paginated response
        successResponseHandler(
            res,
            200,
            "Todos retrieved successfully",
            {
                todos,
                pagination: {
                    total: totalCount,
                    page,
                    limit,
                    totalPages: Math.ceil(totalCount / limit),
                    hasNextPage: page * limit < totalCount
                }
            }
        );

    } catch (error) {
        throw error;
    }
};

// controller to delete todos of particular user : This manage multi delete
export const deleteTodos = async (req:Request,res:Response) => {
    try {
        const {todoIds} = req.body;
        const userId = req?.user?._id;
        if(!userId) {
            throw new CustomError(401,"UnAuthorized request!")
        }
        if (!todoIds || !Array.isArray(todoIds)) {
            throw new CustomError(400, "Invalid todo IDs provided");
        }
        
        if(!todoIds?.length){
            successResponseHandler(res, 200, "No todos were deleted",{deletedCount:0});
        }

        const result = await todoService.deleteTodos({userId,todoIds})
        if (result.deletedCount === 0) {
            successResponseHandler(res, 200, "No todos were deleted",{deletedCount:0});
        } else {
            successResponseHandler(
                res,
                200,
                `${result.deletedCount} todos deleted successfully`,
                { deletedCount: result.deletedCount }
            );
        }

    } catch (error) {
        throw error
    }
}

// controller to update a todo
export const updateTodo = async (req: Request, res: Response) => {
    try {
        // 1. Get authenticated user
        if (!req.user) {
            throw new CustomError(401, "Authentication required");
        }
        const userId = req.user._id;

        // 2. Get todo ID from params and updates from body
        const todoId = req.params.id;
        const updates = req.body;

        // 3. Validate at least one field is being updated
        if (Object.keys(updates).length === 0) {
            throw new CustomError(400, "At least one field must be updated");
        }

        // 4. Call service layer
        const updatedTodo = await todoService.updateTodoItem({
            todoId,
            userId,
            updates
        });

        // 5. Return success response
        successResponseHandler(
            res,
            200,
            "Task updated successfully",
            {
                id:todoId
            }
        );

    } catch (error) {
        throw error;
    }
};

export const getSingleTodo = async (req:Request,res:Response) => {
    try {
        const {id} = req.params;
        const userId = req?.user?._id;
        if(!id){
            throw new CustomError(400,"task id can not be empty!")
        }
        const todo = await todoService.getSingleTodo(id,userId);

        successResponseHandler(
            res,
            200,
            "Task fetched successfully.",
            todo
        )
    } catch (error) {
        console.log(error,"erer")
        throw error
    }
}