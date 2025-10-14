import mongoose,{Schema, Document} from "mongoose";
import { Message, MessageSchema } from "./message.model";

export interface User extends Document{
    username:string;
    email:string;
    password:string;
    verifyCode:string;
    VerifyCodeExpiry:Date;
    isVerified:boolean;
    isAcceptingMessage:boolean;
    message: Message[]
}

const UserSchema: Schema<User> = new Schema({
    username:{
        type:String,
        required:[true, "username is required"],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true, "email is required"],
        unique:true,
        match:[/.+\@.+\..+/,'please use a valid email address']
    },
    password:{
        type:String,
        required:[true, "password is required"]
    },
    verifyCode:{
        type:String,
        required:[true, "verifyCode is required"]
    },
    VerifyCodeExpiry:{
        type:Date,
        required:[true, "verifyCodeExpiry is required"]
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    message:[MessageSchema]
})

const UserModel =(mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema);
export default UserModel;
