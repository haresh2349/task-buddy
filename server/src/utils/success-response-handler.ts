import { Response } from "express"

export const successResponseHandler = (
    res:Response,
    statusCode:number = 200,
    message:string,
    result:any
):Response => {
    return res.status(statusCode).json({
        message,
        result
    })
}