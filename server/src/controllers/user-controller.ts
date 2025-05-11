import { Request, Response } from "express";
import UserModel from "../models/user-model";
import { CustomError } from "../errors/custom-error";
import * as UserService from "../services/users-service";
import { successResponseHandler } from "../utils/success-response-handler";
export const getUserDetails = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?._id;

  if (!id) {
    throw new CustomError(400, `User's Id can not be empty!`);
  }

  const user = await UserService.getUserDetails(id, userId);
  successResponseHandler(res, 200, "User details fetched successfully", user);
};
