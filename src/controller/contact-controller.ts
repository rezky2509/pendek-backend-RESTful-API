import { Hono } from "hono";
import { ApplicationVariables } from "./models/app-models";
import { authMidleware } from "../middleware/auth-middleware";
import { User } from "../models/Users";
import { ContactService } from "../service/contactService";
import { ContactResponse, CreateContactRequest, SearchContactRequest, UpdateContactRequest } from "./models/contact-models";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { HTTPException } from "hono/http-exception";
import { Contact } from "../models/Contacts";
import limiter from "./limiter";


export const contactController = new Hono<{Variables: ApplicationVariables}>()

// First fetch the user data from user collection 
// fetch from the authmiddleware
contactController.use(authMidleware)


contactController.post('/api/contacts', async(c)=>{
    // the c retrieved from the middleware
    const user = c.get('user') as User

    // json return as promise
    // let request = await c.req.json() as CreateContactRequest
    let request = await c.req.json()
    
    // Check whether the request is an array or not
    if(Array.isArray(request.data)){
        console.log('Request is an array')
        request = request.data
    }
    const response = await ContactService.create(user, request)

    return c.json({
        payload: response
    },201)
})

// wildcard named id 
// stored the contact id 
contactController.get('/api/contacts/:id', limiter ,async(c)=>{
    // take the middleware 
    const user = c.get('user') as User

    // get the parameter value 
    // parsed to objectId value 
    // because when the parameter store on the uri, 
    // it considered as string
    // we need to handle as mongodb object id 
    console.log(`Checking parameter -------------------------------------`)
    // Check only on the parameter. 
    // directly check on the database whether the key or id is exist or not. 
    if(!mongoose.isValidObjectId(c.req.param('id'))){
        console.log(`Parameter is ${c.req.param('id')}`)
        throw new HTTPException(404,{
            cause:'Contact not found'
        })
    }else{
        // if exist, then proceed to the service part to fetch the data. 
        const parameterID =  new ObjectId(c.req.param('id') as string) 
        console.log(`Parameter ${parameterID}`)
        const response = await ContactService.get(user, parameterID)

        return c.json({
            payload: response
        },200)
    }

})


contactController.put('api/contacts/:id',async(c)=>{
    const user = c.get('user') as User
    console.log(`Checking parameter -------------------------------------`)
    if(!mongoose.isValidObjectId(c.req.param('id'))){
        console.log(`Parameter is ${c.req.param('id')}`)
        throw new HTTPException(401,{
            cause:'Contact not found'
        })
    }else{
        // Fetch the contact id 
        const parameterID =  new ObjectId(c.req.param('id') as string) 

        let request = await c.req.json() as UpdateContactRequest
        request._id = parameterID

        const response = await ContactService.update(user, request)

        return c.json({
            payload: response
        },200)
    }
})

contactController.delete('api/contacts/:id',async(c)=>{
    const user = c.get('user') as User
    console.log(`Checking parameter -------------------------------------`)
    if(!mongoose.isValidObjectId(c.req.param('id'))){
        console.log(`Parameter is ${c.req.param('id')}`)
        throw new HTTPException(404,{
            message:'Contact not found'
        })
    }else{
        // Fetch the contact id 
        const parameterID =  new ObjectId(c.req.param('id') as string) 

        const response = await ContactService.delete(user, parameterID)

        return c.json({
            payload: response
        },200)
    }
})


contactController.get('api/contacts', limiter ,async(c)=>{
    const user = c.get('user') as User

    // Url Query 
    // it started after the question mark 

    // Set as an empty variable 
    const request: SearchContactRequest = {
        // This directly acess to the body key and value
        name: c.req.query('name'),
        email: c.req.query('email'),
        phone: c.req.query('phone'),
        // since page and phone are optional, then we set the default value to 1 and 10 respectively
        page: c.req.query('page') ? Number(c.req.query('page')): 1,
        size: c.req.query('size') ? Number(c.req.query('size')): 10,
    }
    console.log('Query from URL')
    console.log(request)

    const response = await ContactService.search(user, request)

    return c.json({
        response
    },200)
    
})