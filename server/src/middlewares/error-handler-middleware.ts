import { ErrorRequestHandler } from "express";
import { CustomError } from "../errors/custom-error";

export const errorHandler:ErrorRequestHandler = (err,req,res,next) => {
    // Handle known errors (like CustomError)
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      message: 'Invalid token.',
    });
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      message: 'Token expired.',
    });
  }

  // Handle unexpected errors
  console.error(err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong.',
  });
}