// This is unit test
// to run bun test 
// bun test <filenameAndLocation>
import {describe, it, expect, afterEach, afterAll, beforeAll, beforeEach} from 'bun:test'


// accessing the routes 
import app from "../index"
// to solve the hanging, try to import the hone as standalone
// and using the standalone db connection 

// Getting the connection 
import dbConnection from '../database/dbConnection';
import disconnectDB from '../database/dbConnection';

// Winston to log debug 
import { logger } from '../application/logging';
import { UserTest } from './test-util';
import  mongoose  from 'mongoose';

import figlet = require('figlet');

// Check any logs from mongoose 
// mongoose.set('debug',true)

// Unit Test Success. 21 November 2025
describe('POST /api/users',()=>{
    // After each is run this callback function 
    // after each request call. 
    // afterEach(async () => {
    //     console.log("Starting afterEach deleting....")
    //     try{
    //         console.log("Atempting usermodel delete....")
    //         await UserTest.delete()
    //         console.log("UserModel.deleteMany completed."); // This log is missing in your output
    //         console.log("deleted [afterEach end]");
    //     }catch(error){
    //         console.log(`Error: ${error}`)
    //     }
    // })

    // beforeAll(async () => {
        // console.log("Connecting to database...");
        // try {  
        //     console.log(`State of the connection ${mongoose.connection.readyState}`)
        //     // Calling the function from file dbConnection
        //     await dbConnection()
        //     console.log('Database connected successfully.');
        // } catch (error) {
        //     console.error('Failed to connect to database:', error);
        //     // Important: If connection fails, throw to stop tests immediately
        //     throw error;
        // }
        // console.log(figlet.textSync('Unit Test User Create'))
    // });
    

    // // Run after each unit test
    // afterEach(async()=>{
    //     try{
    //         console.log(`State of the connection ${mongoose.connection.readyState}`)
    //         console.log("Deleting existing record document. ")
    //         // On test 3, it stuck here
    //         await UserTest.delete()
    //         console.log("Successful deleting existing record document. ")
    //     }catch(error){
    //         logger.error(error)
    //     }
    // })

    // Run after all test subject is done 
    // disconnect the db 
    // Preventing race condition where 
    // where mongoose may disconnect after transaction 
    // afterAll(async()=>{
    //     try{
    //         // console.log(`State of the connection ${mongoose.connection.readyState}`)
    //         // console.log("Disconnect database")
    //         // Ready state is getting know the state of the connection 
    //         // 0 = disconnected 
    //         // 1 = connected 
    //         // 2 = connecting 
    //         // 3 = disconnecting 
    //         // 4 = invalid 
    //         // if(mongoose.connection.readyState === 1 ){
    //         //     disconnectDB()
    //         //     console.log("Disconnected from DB by checking state")
    //         // }
    //         // else {
    //         //     console.log('Disconnected from database')
    //         // }
    //     }catch(error){
    //         logger.error(error)
    //     }
    // })

    
    // This unit test to run if the form is invalid. 
    // such as empty body 
    // Passed 23/11/2025
    it('should reject new user if request is invalid',async()=>{
        // This unit test for invalid or incorrect user input 
        console.log("----------- Test Insert with invalid form -----------------------")
        const response = await app.request('/api/users',{
            method: 'POST',
            body: JSON.stringify({
                name: "",
                password: "",
                username: ""
            })
        })

        // This store the body only
        const bodyResponse:string = await response.json()
        // THis we log the body response 
        logger.debug(bodyResponse)
        // Show the body response
        console.log("Show body response")
        console.log(bodyResponse)

        // response.status is we accessing the header
        expect(response.status).toBe(400)
        // Making sure that the body response is Not undefined. 
        expect(response.body).toBeDefined()
        console.log("----------- Test Insert with invalid form Completed -----------------------")

    });

    // This to test exist same username
    // Passed 23/11/2025
    it('should reject new user if username already exists',async()=>{
        // create the user first 
        await UserTest.create()
        console.log("------------- Creating with EXISTING username ---------------------------------")
        // this usertest class contain the same body. with property name and username 
        // username is unique so it cannot be same
        // await UserTest.create()

        // we create fake API request to 
        // simulate same name and username 
        // this return zod validation. 
        // since user is zod type 
        const response = await app.request('/api/users',{
            method: 'POST',
            body: JSON.stringify({
                name: "test",
                password: "test",
                username: "test"
            })
        })
        const bodyResponse = await response.json()
        logger.debug(bodyResponse.status)

        expect(response.status).toBe(400)
        expect(response).toBeDefined()
        console.log("------------ Create Existing Username Completed ---------------")
        await UserTest.delete()
    });

    // PASSED 23/11/2025
    it('should register new user success', async()=>{
        console.log("------------- Creating with New user  ---------------------------------")
        const response = await app.request('/api/users',{
            method: 'POST',
            body: JSON.stringify({
                name: "KikiLala",
                password: await Bun.password.hash('secretStuff',{
                    algorithm: 'bcrypt',
                    cost: 10
                }),
                username: "kiki12345"
            })
        })

        const bodyResponse = await response.json()
        logger.debug(bodyResponse)
        logger.debug(response.status)
        
        expect(response.status).toBe(201)
        expect(bodyResponse.data.username).toBe('kiki12345')
        expect(bodyResponse.data.name).toBe('KikiLala')
        console.log("------------- Creating with New user  ---------------------------------")
        await UserTest.deleteWithCondition()
    }); 
})



describe('POST /api/users/login', ()=>{
    // beforeEach(async()=>{
    //     await UserTest.create();
    // })

    // afterEach(async()=>{
    //     console.log('Deleting.....')
    //     await UserTest.delete();
    //     console.log('Deleted.....')
    // })

    // Successful Login
    // PASS 23/11/2025
    it('should be able to login', async ()=>{
        await UserTest.create()

        // Something not right here
        
        // The request is specifically designed for testing 
        // POST method
        console.log("Creating an API Call")
        const response = await app.request('/api/users/login',{
            method: 'POST',
            body: JSON.stringify({
                username: "test",
                password: "secretStuff"
            }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        })
        console.log("Creating an API Call Completed")


        const bodyResponse = await response.json()
        logger.debug(bodyResponse)
        logger.debug(bodyResponse.token)
        logger.debug(response.status)

        expect(response.status).toBe(200)
        expect(bodyResponse.data.username).toBe('test')
        expect(bodyResponse.data.token).toBeDefined()

        await UserTest.delete()
    })

    // Failed login where username invalid
    // PASS 23/11/2025
    it('should be rejected if username invalid', async ()=>{
        await UserTest.create()
        console.log("Creating an API Call")
        const response = await app.request('/api/users/login',{
            method: 'POST',
            body: JSON.stringify({
                username: "testss",
                password: "secretStuff"
            })
        })
        console.log("Sucess API Call")

        const bodyResponse = await response.json()
        logger.debug(bodyResponse)
        logger.debug(response.status)
        
        expect(response.status).toBe(401)
        // The body response only send http response code. Need to revision the response 
        // if the user does not exist. 
        // expect(bodyResponse.data.message).toBe('Username or password is invalid')
        // expect(bodyResponse.errors).toBeDefined()
        await UserTest.delete()
    })

    // Failed login where password is invalid
    // PASS 23/11/2025
    it('should be rejected if password invalid', async ()=>{
        await UserTest.create()
        console.log("Creating an API Call")
        const response = await app.request('/api/users/login',{
            method: 'POST',
            body: JSON.stringify({
                username: "test",
                password: "taktaulah"
            })
        })
        console.log("Sucess API Call")


        const bodyResponse = await response.json()
        logger.debug(bodyResponse)
        logger.debug(response.status)
        
        expect(response.status).toBe(401)
        // The body response only send http response code. Need to revision the response 
        // if the user does not exist. 

        // expect(bodyResponse.data.message).toBe('Username or password is invalid')
        // expect(bodyResponse.errors).toBeDefined()
        // await UserTest.deleteEntireDocument()
        await UserTest.delete()
    })
    
})



// Passed Unit Test 30 July 2025
describe('PATCH /api/users/current', ()=>{
    
    // beforeEach(async()=>{
    //     await UserTest.create()
    // })

    // afterEach(async()=>{
    //     await UserTest.delete()
    // })

    // PASS 23/11/2025
    it('should be able to get user',async()=>{
        await UserTest.create()
        const response = await app.request('/api/users/current',{
            method: 'GET',
            headers: {
                'Authorization':'test'
            }
        })
        expect(response.status).toBe(200)

        const body = await response.json()
        console.log(body)

        // expect(body.payload.username).toBeDefined()
        expect(body.payload.username).toBe('test')
        await UserTest.delete()
    })

    // PASS 23/11/2025
    it('should not be able to get user if token is invalid',async()=>{
        await UserTest.create()
        const response = await app.request('/api/users/current',{
            method: 'GET',
            headers: {
                'Authorization': "t"
            }
        })

        expect(response.status).toBe(401)

        const body = await response.json()
        // Body no response. Need to revise this response part. 
        logger.debug(body)
        // expect(body.errors).toBeDefined()
        await UserTest.delete()
    })

    // PASS 23/11/2025
    it('should not be able to get user if there is no authorization header',async()=>{
        await UserTest.create()
        const response = await app.request('/api/users/current',{
            method: 'GET'
        })

        expect(response.status).toBe(401)

        const body = await response.json()
        // Body no response. Need to revise this response part. 
        // expect(body.errors).toBeDefined()
        await UserTest.delete()
    })
})