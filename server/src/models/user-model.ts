import {Schema,Document,model} from 'mongoose'
import { IUser } from '../types/user-types';
import bcrypt from "bcrypt"
import jwt,{ Secret } from "jsonwebtoken"
const UserSchema = new Schema<IUser>({
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
    }
},
{
    timestamps:true
})

UserSchema.pre('save',async function(next){
    if(!this.isModified(this.password)) return next();
    this.password = await bcrypt.hash(this.password,10)
})

UserSchema.methods.isPasswordCorrect = async function(password:string):Promise<boolean>{
    return await bcrypt.compare(password,this.password)
}

UserSchema.methods.generateAccessToken = function ():string{
    const user = this as IUser;
    if (!process.env.ACCESS_TOKEN_KEY || !process.env.ACESS_TOKEN_EXPIRY) {
        throw new Error('Refresh token key or expiry is not defined in environment variables');
    }
    return jwt.sign(
        {
            _id:user?._id,
            email:user.email,
            username:user.username
        },
        process.env.ACCESS_TOKEN_KEY,
        {
            expiresIn:process.env.ACESS_TOKEN_EXPIRY
        }
    )
}

UserSchema.methods.generateRefreshToken = function() : string {
    const user = this as IUser;

    if (!process.env.REFRESH_TOKEN_KEY || !process.env.REFRESH_TOKEN_EXPIRY) {
        throw new Error('Refresh token key or expiry is not defined in environment variables');
    }

    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
            userName: user.username
        },
        process.env.REFRESH_TOKEN_KEY,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}

const UserModel = model<IUser>("user",UserSchema);
export default UserModel 