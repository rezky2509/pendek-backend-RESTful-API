import { Hono } from "hono";
import { LoginUserRequest, RegisterUserRequest, UpdateUserRequest } from "./models/user-models";
import { userService } from "../service/userService";
import { ApplicationVariables } from "./models/app-models";

// Hono middleware
import { bearerAuth } from 'hono/bearer-auth'
import { toUserResponse, User } from "../models/Users";
import { authMidleware } from "../middleware/auth-middleware";
import limiter from "./limiter";
// Best practice to instantiatee object
// Dont create class for controller <-- best practice for hono
// always use hono 

// Definition here causes it to hang

// RPC implementation
// This hono can expect a generics type. Just assigned the type
// this let hono use the middleware to hold the current user data (user collection)
export const userController = new Hono<{Variables: ApplicationVariables}>();

userController.post('users', async(c)=>{
    // store the request as json with type of RegisterUserRequest Type
    // With type assertion, we tell TypeScript that request is a RegisterUserRequest 
    const request = await c.req.json() as RegisterUserRequest
    console.log(request)
    // const request = await c.req.json() as RegisterUserRequest //<--- something wrong here 
    // // Send to Service File
    const response = await userService.register(request)
    // // send back to client 
    // return as succesful API response of 201 created. 
    return c.json({
        data: response
    },201)
    // return as json with status of 201(success with response or created)
    // return c.json({data:response})
})

userController.post('users/login', async(c)=>{
    const requestLogin = await c.req.json() as LoginUserRequest;
    const response = await userService.login(requestLogin)

    return c.json({
        data:response
    },200)
})

userController.post('users/delete', async(c)=>{
    const requestLogin = await c.req.json() as LoginUserRequest;
    const response = await userService.deleteUser(requestLogin)

    return c.json({
        data:response
    },200)
})

// Middleware
// Middleware is authenticate the API TOKEN request
// Verifies that the user is allowed to access the resource
// we can just import the file that contained the logic 
// of the middleware. 
userController.use(authMidleware)


// middleware
// const token = await 
// bearerAuth argument need specific variable name token 
// means that to access every endpoint after users/current
// need to go here first 
// userController.use('/api/*', ))

// These method specify which route or endpoint that need to have the 
// token verified
userController.get('users/current', limiter ,async (c)=>{
    // take user
    // const userToken = c.req.header('Authorization')?.substring(7)
    // const validateToken = await userService.get(userToken)
    // return c.json({
    //     payload:validateToken
    // })
    // The c now return as a key and valu pair 
    // so this we dont need to call the userservice file
    const user = c.get('user') as User
    console.log(user)

    return c.json({
        // here the toUserResponse will fill in automatically 
        // to the corresponding user key and value
        payload:toUserResponse(user)
    },200)
})


userController.patch('users/current', async(c)=>{
    const user = c.get('user') as User
    const request = await c.req.json() as UpdateUserRequest

    const response = await userService.update(user,request)

    return c.json({
        payload: response
    })
})


// Logout Request 
userController.delete('users/current', async(c)=>{
    const user = c.get('user') as User

    const response = await userService.logout(user)

    return c.json({
        payload: response
    })
})