import type {ObjectId} from "mongodb";
import mongoose, { Schema } from "mongoose";

import {UserResponse, RegisterUserRequest} from '../controller/models/user-models'

// Create the interface 
export interface User {
    _id: ObjectId,
    username: string,
    password: string,
    name: string,
    token?: string
}

export interface URL_detail {
    id_: ObjectId,
    long_url: string,
    short_url: string,
    created_at: string,
    is_active: boolean
}

const UserSchema: Schema = new mongoose.Schema({
    username:{
        type:String,
        unique: true
    },
    password:{
        type:String,
    },
    name:{
        type:String,
    },
    token:{
        type:String,
    },
},{
    autoCreate: false,
    autoIndex: false
})


// Create return function as an object type userResponse
export function toUserResponse(user:RegisterUserRequest) :UserResponse {
    return {
        name: user.name,
        username: user.username,
        token: user.token!
    }
}

// Create the Mongoose Model 
// <>specify the interface type
// (ModelName,Schema,collectionName)
const UserModel = mongoose.model<User>('User',UserSchema);

export default UserModel