import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/custom-error";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken"
export const verifyToken = async (req:Request,res:Response,next:NextFunction) => {
    const token = req.headers.authorization?.replace("Bearer ","");
        if(!token){
            throw new CustomError(401,"UnAuthorized request")
        }
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_KEY as string,
            (err:VerifyErrors | null,decode:JwtPayload | string | undefined) => {
                if(err){
                    if (err.name === 'TokenExpiredError') {
                        throw new CustomError(401, 'Token expired.');
                      } else if (err.name === 'JsonWebTokenError') {
                        throw new CustomError(401, 'Invalid token.');
                      } else {
                        throw new CustomError(401, 'Authentication failed.');
                      }
                }

                if(decode){
                    req.user = decode
                }
                next();
            }
        )
}