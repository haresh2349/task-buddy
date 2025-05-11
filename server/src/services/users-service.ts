import { CustomError } from "../errors/custom-error";
import UserModel from "../models/user-model";
import { IUser } from "../types/user-types";

export const getUserDetails = async (
  id: string,
  userId: string
): Promise<IUser> => {
  try {
    const authUser = await UserModel.findById(userId);
    if (!authUser) {
      throw new CustomError(401, "Unauthorized request!");
    }

    const requestedUser = await UserModel.findById(id).select(
      "-password -__v -refreshToken"
    );

    if (!requestedUser) {
      throw new CustomError(404, "User not found");
    }
    return requestedUser;
  } catch (error) {
    throw error;
  }
};
