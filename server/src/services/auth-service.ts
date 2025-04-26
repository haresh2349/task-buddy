import { Types } from "mongoose";
import { UserDocument } from "../types/user-types";
import UserModel from "../models/user-model";
import { CustomError } from "../errors/custom-error";

interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}

interface LoginResponse {
    user: UserDocument;
    accessToken: string;
    refreshToken: string;
}

export const registerUser = async (username: string, email: string, password: string): Promise<UserDocument> => {
    // Check presence of email
    const isEmailExist = await UserModel.findOne({ email });
    if (isEmailExist) {
        throw new CustomError(409, "Email already exists!");
    }

    const newUser = await UserModel.create({
        username,
        email,
        password
    });

    const createdUser = await UserModel.findById(newUser._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new CustomError(500, "Failed to create a user!, try again");
    }

    return createdUser;
};

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
    const user = await UserModel.findOne({ email }) as UserDocument | null;
    
    if (!user || !user?._id) {
        throw new CustomError(401, "Invalid credentials");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new CustomError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessOrRefreshToken(user._id);

    return { user, accessToken, refreshToken };
};

export const generateAccessOrRefreshToken = async (
    userId: Types.ObjectId
): Promise<TokenResponse> => {
    try {
        const user = await UserModel.findById(userId) as UserDocument | null;
        if (!user) {
            return { accessToken: "", refreshToken: "" };
        }
        
        const accessToken = user.generateAccessToken() || "";
        const refreshToken = user.generateRefreshToken() || "";
        
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        
        return { accessToken, refreshToken };
    } catch (error) {
        console.log(error);
        return { accessToken: "", refreshToken: "" };
    }
};