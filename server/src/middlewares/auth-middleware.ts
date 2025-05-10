import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/custom-error";
import jwt from "jsonwebtoken"
import { UserJwtPayload } from "../types/user-types";
export const verifyToken = async (req:Request,res:Response,next:NextFunction) => {
    const token = req.cookies.accessToken;
        if(!token){
            throw new CustomError(401,"UnAuthorized request!")
        }
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY as string) as UserJwtPayload;
        
            req.user = decoded;
            next();
          } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
              throw new CustomError(401, "Token expired.");
            } else if (err instanceof jwt.JsonWebTokenError) {
              throw new CustomError(401, "Invalid token.");
            } else {
              throw new CustomError(401, "Authentication failed.");
            }
          }
}