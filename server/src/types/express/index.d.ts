import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { UserJwtPayload } from "./user-types";

declare global {
  namespace Express {
    interface Request {
     user: UserJwtPayload
   }
  }
}
import { UserJwtPayload } from "../user-types";
