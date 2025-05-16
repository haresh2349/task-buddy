import { Request, Response } from "express";
import { CustomError } from "../errors/custom-error";
import { successResponseHandler } from "../utils/success-response-handler";
import * as authService from "../services/auth-service";

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new CustomError(400, "All fields are required!");
  }

  let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) {
    throw new CustomError(400, "Invalid email format");
  }

  const createdUser = await authService.registerUser(username, email, password);

  successResponseHandler(res, 201, "User created successfully", {
    id: createdUser?._id,
  });
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError(400, "All fields are required!");
  }

  const { user, accessToken, refreshToken } = await authService.loginUser(
    email,
    password
  );
  setCookies(res, accessToken, refreshToken);
  successResponseHandler(res, 200, "User loggedIn successfully.", {
    id: user._id,
    accessToken,
  });
};

export const loginWithGoogle = async (req: Request, res: Response) => {
  const { name, email, googleId } = req.body;

  if (!googleId || !email || !name) {
    throw new CustomError(400, "Invalid request");
  }
  const { user, accessToken, refreshToken } = await authService.loginWithGoogle(
    name,
    email,
    googleId
  );
  setCookies(res, accessToken, refreshToken);
  successResponseHandler(res, 200, "User loggedIn successfully.", {
    id: user._id,
    accessToken,
  });
};

function setCookies(res: Response, accessToken: string, refreshToken: string) {
  const accessTokenOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 60 * 60 * 1000,
  };

  const refreshTokenOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res.cookie("accessToken", accessToken, accessTokenOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenOptions);
}
