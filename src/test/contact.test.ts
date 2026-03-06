import {describe,it,beforeAll,beforeEach,expect, afterEach} from 'bun:test'
import { ContactTest, UserTest } from './test-util'
// import { Hono } from 'hono'
import app from '..'

import { logger } from '../application/logging';
import { Contact } from '../models/Contacts';
import { ObjectId } from 'mongodb';
// const app = new Hono()

describe('POST /api/contacts',()=>{

    // beforeEach(async()=>{
    //     // create user 
    //     await UserTest.create()
    // })

    // afterEach(async()=>{
    //     // delete user 
    //     await UserTest.delete()
    // })
    // PASS 15/01/2026
    it('should be rejected if contact is invalid and token is invalid', async()=>{
        await UserTest.create()
        const response = await app.request('/api/contacts',{
            method: 'POST',
            headers: {
                'Authorization':'wrong'
            },
            body:JSON.stringify({
                firstname: ""
            })
        })
        expect(response.status).toBe(401)

        const body = await response.json()
        console.log(body)

        expect(body.errors).toBeDefined()
        await UserTest.delete()
    })
    
    // PASS 15/01/2026
    it('should be rejected if contact is invalid', async()=>{
        await UserTest.create()
        const response = await app.request('/api/contacts',{
            method: 'POST',
            headers: {
                'Authorization':'test'
            },
            body:JSON.stringify({
                firstname: ""
            })
        })
        expect(response.status).toBe(400)
        logger.debug(response)
        const body = await response.json()
        console.log(body)

        expect(body.errors).toBeDefined()
        await UserTest.delete()
    })

    // PASS 15/01/2026
    it('should be able if contact is valid (firstname only)', async()=>{
        await UserTest.create()
        const response = await app.request('/api/contacts',{
            method: 'POST',
            headers: {
                'Authorization':'test'
            },
            body:JSON.stringify({
                firstname: "kucing"
            })
        })
        expect(response.status).toBe(201)

        const body = await response.json()
        console.log(body)

        expect(body.payload.firstname).toBe('kucing')
        // Mongodb handle data if the key and is not exist 
        // it will return undefined
        // since this project using nosql and using ODM (object data modelling)
        // AND THE SCHEMA DEFINED THAT THE KEY FOR LASTNAME, EMAIL AND PHONE 
        // IS OPTIONAL "undefined" refers to an existing entity that currently lacks an assigned value.
        // compared to ORM (object relational model)
        // the column is exist but the value is null
        expect(body.payload.lastname).toBeUndefined()
        expect(body.payload.email).toBeUndefined()
        expect(body.payload.phone).toBeUndefined()
        await UserTest.delete()
        await ContactTest.delete()
    })

    // PASS 24/11/2025
    it('should be able if contact is valid (all key exist)', async()=>{
        await UserTest.create()
        const response = await app.request('/api/contacts',{
            method: 'POST',
            headers: {
                'Authorization':'test'
            },
            body:JSON.stringify({
                firstname: "kucing",
                lastname:"Satok",
                email:"kenyalang@gmail.com",
                phone:"0152535345"
            })
        })
        expect(response.status).toBe(201)

        const body = await response.json()
        console.log(body)

        expect(body.payload.firstname).toBe('kucing')
        // Mongodb handle data if the key and is not exist 
        // it will return undefined
        // since this project using nosql and using ODM (object data modelling)
        // AND THE SCHEMA DEFINED THAT THE KEY FOR LASTNAME, EMAIL AND PHONE 
        // IS OPTIONAL "undefined" refers to an existing entity that currently lacks an assigned value.
        // compared to ORM (object relational model)
        // the column is exist but the value is null
        expect(body.payload.lastname).toBe('Satok')
        expect(body.payload.email).toBe('kenyalang@gmail.com')
        expect(body.payload.phone).toBe('0152535345')
        await UserTest.delete()
        await ContactTest.delete()
    })
})


describe('GET /api/contacts/{id}', ()=>{

    // PASS 15/01/2026
    it('should get 404 if contact is not found ',async()=>{
        await UserTest.create()
        await ContactTest.create()
        const contact = await ContactTest.get() as Contact
         
        const response = await app.request('/api/contacts/412414',{
            method: 'GET',
            headers: {
                'Authorization':'test'
            }
        })

        expect(response.status).toBe(404)
        const body = await response.json()
        expect(body.errors).toBeDefined()

        await UserTest.delete()
        await ContactTest.delete()
    })  

    // PASS 15/01/2026
    it('should success contact detail if exist ',async()=>{

        await UserTest.create()
        await ContactTest.create()
        const contact = await ContactTest.get()
        logger.debug(contact)
         
        const response = await app.request('/api/contacts/'+contact._id,{
            method: 'GET',
            headers: {
                'Authorization':'test'
            }
        })
        
        expect(response.status).toBe(200)
        const body = await response.json()
        expect(body.payload.firstname).toBe('kucing')
        expect(body.payload.lastname).toBe('Satok')
        expect(body.payload.email).toBe('kenyalang@gmail.com')
        expect(body.payload.phone).toBe('0152535345')

        await UserTest.delete()
        await ContactTest.delete()

    })

})


describe('PUT /api/contacts/:id',()=>{

    // PASS 15/01/2026
    it('should reject if input/firstname is empty', async()=>{
        await UserTest.create()
        await ContactTest.create()
        const contact = await ContactTest.get()
        
        const response = await app.request('/api/contacts/'+contact._id,{
            method:'PUT',
            headers:{
                'Authorization':'test'
            },
            body: JSON.stringify({
                firstname:""
            })
        })
        expect(response.status).toBe(404)
        await UserTest.delete()
        await ContactTest.delete()
    })

    // PASS 15/01/2026
    it('should reject if contact id is invalid or not found', async()=>{
        await UserTest.create()
        await ContactTest.create()

        const contact = await ContactTest.get()
        logger.debug(contact)
        const response = await app.request('/api/contacts/',{
            method: 'PUT',
            headers: {
                'Authorization':'test'
            }
        })
        const body = await response.body
        logger.debug(body)
        expect(response.status).toBe(404)
        expect(response).toBeDefined()

        await UserTest.delete()
        await ContactTest.delete()
    })

    // PASS 15/01/2026
    it('should success if request is valid', async()=>{
        await UserTest.create()
        await ContactTest.create()
        const contact = await ContactTest.get()
        
        const response = await app.request('/api/contacts/'+contact._id,{
            method:'PUT',
            headers:{
                'Authorization':'test'
            },
            body: JSON.stringify({
                firstname:"kucing"
            })
        })
        expect(response.status).toBe(200)
        const body = await response.json()
        expect(body.payload.firstname).toBe('kucing')
        await UserTest.delete()
        await ContactTest.delete()
    })

})


describe('DELETE /api/contacts/:id',()=>{

    // PASS 15/01/2026
    it('should reject if parameter is invalid',async()=>{
        await UserTest.create()
        await ContactTest.create()

        const response = await app.request('/api/contacts/',{
            method:'DELETE',
            headers:{
                'Authorization':'test'
            }
        })
        expect(response.status).toBe(404)
        await UserTest.delete()
        await ContactTest.delete()
    })

    // PASS 15/01/2026
    it('should success if parameter is valid',async()=>{
        await UserTest.create()
        await ContactTest.create()
        const contact = await ContactTest.get()
        const response = await app.request('/api/contacts/'+contact._id,{
            method:'DELETE',
            headers:{
                'Authorization':'test'
            }
        })
        expect(response.status).toBe(200)
        const body = await response.json()
        expect(body.payload).toBe(true)
        await UserTest.delete()
        await ContactTest.delete()
    })

    // PASS 15/01/2026
    it('should show user id object', async()=>{

        // // Connecting to Db 
        // await dbConnection()

        console.log("Creating New User")
        await UserTest.create()
        console.log("New user created")
        // await ContactTest.create()  

        console.log('Fetching user id on users collection')
        // var type objectid from mongodb object or class. 
        const user_id:ObjectId = await UserTest.getID() as ObjectId
        logger.debug(user_id)
        expect(user_id).toBeDefined()

        await UserTest.delete()
        await ContactTest.delete()
    })
})

describe('GET /api/contacts', ()=>{

    // PASS 15/01/2026
    it('should be able to search contact without parameter',async()=>{
        await UserTest.create()
        await ContactTest.create()

        // Create an API request 
        const response = await app.request('/api/contacts',{
            method:'GET',
            headers:{
                Authorization: 'test'
            }
        })

        let payload = await response.json()
        payload = payload.response.data
        logger.info(payload)

        expect(response.status).toBe(200)

        await UserTest.delete()
        await ContactTest.delete()
   })
   
    //PASS 15/01/2026
    it('should be able to search contact using name',async()=>{
        await UserTest.create()
        await ContactTest.create()

        const response = await app.request('/api/contacts?name=kucing',{
            method:'GET',
            headers:{
                Authorization: 'test'
            }
        })

        expect(response.status).toBe(200)

        let payload = await response.json()
        // payload = payload.response
        console.log("Response from API ")
        logger.info(payload.response.data)
        
        // since the response is return as an array, you need to add 
        // [0] which means access to the first element 
        expect(payload.response.data[0].firstname).toBe('kucing')
        expect(payload.response.data[0].lastname).toBe('Satok')
        expect(payload.response.data[0].email).toBe('kenyalang@gmail.com')
        expect(payload.response.data[0].phone).toBe('0152535345')

        await UserTest.delete()
        await ContactTest.delete()
    })

    // PASS 15/01/2026
    it('should be able to search contact using email',async()=>{
        await UserTest.create()
        await ContactTest.create()

        const response = await app.request('/api/contacts?email=kenyalang@gmail.com',{
            method:'GET',
            headers:{
                Authorization: 'test'
            }
        })

        expect(response.status).toBe(200)

        let payload = await response.json()
        // payload = payload.response
        console.log("Response from API ")
        logger.info(payload.response.data)
        
        // since the response is return as an array, you need to add 
        // [0] which means access to the first element 
        expect(payload.response.data[0].firstname).toBe('kucing')
        expect(payload.response.data[0].lastname).toBe('Satok')
        expect(payload.response.data[0].email).toBe('kenyalang@gmail.com')
        expect(payload.response.data[0].phone).toBe('0152535345')

        await UserTest.delete()
        await ContactTest.delete()
    })

    // PASS 15/01/2026
    it('should be able to search contact using phone',async()=>{
        await UserTest.create()
        await ContactTest.create()

        const response = await app.request('/api/contacts?phone=0152535345',{
            method:'GET',
            headers:{
                Authorization: 'test'
            }
        })

        expect(response.status).toBe(200)

        let payload = await response.json()
        // payload = payload.response
        console.log("Response from API ")
        logger.info(payload.response.data)
        
        // since the response is return as an array, you need to add 
        // [0] which means access to the first element 
        expect(payload.response.data[0].firstname).toBe('kucing')
        expect(payload.response.data[0].lastname).toBe('Satok')
        expect(payload.response.data[0].email).toBe('kenyalang@gmail.com')
        expect(payload.response.data[0].phone).toBe('0152535345')

        await UserTest.delete()
        await ContactTest.delete()
    })

    // PASS 15/01/2026
    it('should be able to search without result',async()=>{
        // should return empty if data is not found 
        await UserTest.create()
        await ContactTest.create()

        const response = await app.request('/api/contacts?phone=05324',{
            method:'GET',
            headers:{
                Authorization: 'test'
            }
        })

        expect(response.status).toBe(200)

        let payload = await response.json()
        // payload = payload.response
        console.log("Response from API ")
        logger.info(payload.response.data)
        
        // since the response is return as an array, you need to add 
        // [0] which means access to the first element 
        expect(payload.response.data[0]).toBeUndefined()

        await UserTest.delete()
        await ContactTest.delete()
    })
})