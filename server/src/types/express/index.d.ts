import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { UserJwtPayload } from "./user-types";

declare module 'express-serve-static-core' {
  export interface Request {
    user: UserJwtPayload
  }
}
import { UserJwtPayload } from "../user-types";
