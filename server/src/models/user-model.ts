import {Model, Schema,model} from 'mongoose'
import { IUser, IUserMethods, UserDocument } from '../types/user-types';
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

type UserModelType = Model<IUser, {}, IUserMethods>;


const UserSchema = new Schema<IUser, UserModelType, IUserMethods>({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    refreshToken:{
        type:String
    }
},
{
    timestamps:true
})

UserSchema.pre<UserDocument>('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
    next()
})

UserSchema.methods.isPasswordCorrect = async function(password:string):Promise<boolean>{
    return await bcrypt.compare(password,this.password)
}

UserSchema.methods.generateAccessToken = function ():string{
    const user = this as IUser;
    if (!process.env.ACCESS_TOKEN_KEY || !process.env.ACCESS_TOKEN_EXPIRY) {
        console.log(process.env.ACCESS_TOKEN_KEY,process.env.ACCESS_TOKEN_EXPIRY)
        throw new Error('Refresh token key or expiry is not defined in environment variables');
    }
    return jwt.sign(
        {
            _id:user?._id,
            email:user.email,
            username:user.username
        },
        process.env.ACCESS_TOKEN_KEY as string,
        {
           expiresIn: "1h"
        }
    )
}

UserSchema.methods.generateRefreshToken = function() : string {
    const user = this as UserDocument;

    if (!process.env.REFRESH_TOKEN_KEY || !process.env.REFRESH_TOKEN_EXPIRY) {
        throw new Error('Refresh token key or expiry is not defined in environment variables');
    }

    // const options: jwt.SignOptions = {};
    
    // if (process.env.ACCESS_TOKEN_EXPIRY) {
    //     // If it's a numeric string (e.g., "3600"), convert to number
    //     const expiry:string | number = process.env.ACCESS_TOKEN_EXPIRY;
    //     options.expiresIn = expiry
    // }

    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
            username: user.username
        },
        process.env.REFRESH_TOKEN_KEY,
        {
            expiresIn: "7d",
        }
        // options
    )
}

const UserModel = model<IUser, UserModelType>("user",UserSchema);
export default UserModel 