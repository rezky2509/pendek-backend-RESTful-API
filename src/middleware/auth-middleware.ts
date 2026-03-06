import { MiddlewareHandler } from "hono";
import { userService } from "../service/userService";

// This store the user data (user collection data)
// auth midlleware, so verified user data will be hold here

export const authMidleware: MiddlewareHandler = async (c,next) =>{
    // Take the token 
    const token = c.req.header('Authorization')
    // Here validate the token 
    console.log(`User Token ${token}`)
    const user = await userService.get(token)

    // This set a application variables 
    // where this user key can be reuse and hold the entire data of the
    // current user. 
    c.set('user', user)
    console.log(user)
    // The next means, go to the next code. 
    await next()
}