import {Hono} from 'hono'
import { ApplicationVariables } from './models/app-models'
import { authMidleware } from '../middleware/auth-middleware'
import { User } from '../models/Users'
import { CreateAddressRequest, GetAddressRequest, DeleteAddressRequest, UpdateAddressRequest } from './models/address-model'
import { AddressService } from '../service/AddressService'
import mongoose, { mongo } from "mongoose";
import limiter from './limiter'

// middleware
export const addressController = new Hono<{Variables: ApplicationVariables}>
addressController.use(authMidleware)

// wild card using : (colon)
addressController.post('api/contacts/:id/addresses',async(c)=>{
    console.log('Called')
    // get the current user from the middleware
    const user = c.get('user') as User
    // fetch the id from the parameter URL
    // const contactId = Number(c.req.param("id"))
    // This type or assignment is valid only when using MySQL
    
    // you need to convert from string to objectid
    // this is invalid
    // const contact_ID = new ObjectId(c.req.param('id') as string)
    const contact_ID = c.req.param('id')
    
    // console.log(`User contactID ${contact_ID}`)
    // get the data from the body request
    // with type of create address request
    // need to use await 
    let request = await c.req.json()
    const isRequestAnArray = Array.isArray(request.data)
    const requestIsAnArray = request.data
    if(isRequestAnArray){
        console.log('Altering the request')
        request = requestIsAnArray.map((ob:CreateAddressRequest)=>(
            // need to insert the contact_ID
            // Spread operator ...
            // Insert all the other key and value
            // Insert the contact key to the related contact id 
            {...ob,
                "contact":contact_ID
            }
        ))
    }else{
        // If the data is not an array
        // add new key to the request body 
        // for the contact
        request.contact = contact_ID
    }
    // calling the address service 
    // AddressService.create()
    // two params, 
    // 1. user (current user)
    const response = await AddressService.create(user,request)
    return c.json({
        data:response
    },201)
})

addressController.get('api/contacts/:contactID/addresses/:addressID',limiter,async(c)=>{
    //get the middleware
    const user = c.get('user') as User
    // insert the parameter to the object 
    const addressRequest: GetAddressRequest = {
        contact_id: c.req.param('contactID'),
        address_id: c.req.param('addressID')
    }
    const response = await AddressService.get(user,addressRequest)
    return c.json({
        data: response
    })
})

addressController.put('api/contacts/:contactID/addresses/:addressID',async(c)=>{
    // get the current user from middleware
    const user = c.get('user') as User 

    // Get the parameter from the URL
    const urlRequest: GetAddressRequest = {
        contact_id: c.req.param('contactID'),
        address_id: c.req.param('addressID')
    }
    console.log(`URL Request:`)
    console.log(urlRequest)
    // get the body request
    // match it with the model or type that had been defined
    const requestBody = await c.req.json() as UpdateAddressRequest
    console.log(`Request Body:`)

    requestBody._id = urlRequest.address_id
    requestBody.contact = urlRequest.contact_id
    console.log(requestBody)
    // call the address service update method
    const response = await AddressService.update(user,requestBody,urlRequest.contact_id)
    return c.json({
        data: response
    })
    // return c.json({message: "Not Implemented"})
})


addressController.delete('/api/contacts/:contact_id/addresses/:address_id', async(c)=>{
    const user = c.get('user') as User
    const parameter: DeleteAddressRequest = {
        contact_id: c.req.param('contact_id'),
        address_id: c.req.param('address_id')
    }
    const response = await AddressService.delete(
        user, parameter
    )

    if(response){
        return c.json({
            data: response
        })
    }
    else{
        return c.json({
            data: response
        })
    }
})

addressController.get('/api/contacts/:contact_id/addresses', limiter ,async(c)=>{
    // Get list of all address under one contact
    const user = c.get('user') as User
    const contact_id = c.req.param('contact_id')
    const response = await AddressService.getAllAddressByContactID(user, contact_id)
    return c.json({
        data: response
    })
})
