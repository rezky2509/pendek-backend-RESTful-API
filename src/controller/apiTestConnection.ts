import { Hono } from "hono";
import { ApplicationVariables } from "./models/app-models";
import limiter from "./limiter";

const hono = new Hono;

// Application variable is the logger
export const apiTestConnectionController = new Hono

apiTestConnectionController.get('*', async(c)=>{
    // return c.json({
    //     status: 'Connected'
    // })
    // c.header('Access-Control-Allow-Origin','*')
    return c.json({
        status: 'Connected'
    })
})