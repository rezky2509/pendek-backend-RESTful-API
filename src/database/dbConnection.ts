// Setup Connection to Mongodb
// these are module from monogodb
// const { MongoClient, ServerApiVersion } = require('mongodb')

// // require('dotenv').config({path: ".env"});


// // Establish Connection to Mongodb
// const client = new MongoClient(process.env.ATLAS_URI,{
//     serverAPI:{
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });

// // Conect to database variable 
// let database:any

// module.exports = {
//     // This function callback run when use
//     connectToServer: async()=>{
//         // Connecting to mongodb
//         // inside the argument is the collection/database name 
//         database = await client.db('usercontactmanagement')
//         // return new Response(database)
//         console.log('connected to mongoDB')
//     },
//     // retrieve data from mongodb
//     getDb: ()=>{
//         return database
//     }
    
// }

import {ENV} from '../utils/env'

import figlet = require('figlet');
import { MongoClient, ServerApiVersion } from 'mongodb';
import mongoose, { mongo } from "mongoose";

// Use the env utils that had been defined
// access to specific variable named .ATLAS_URI
// const DB_URI:string = ENV.ATLAS_URI
const DB_URI:string = ENV.MONGODB_COMPASS_URI

// Defined the mongolcient for stable API versioning
// This is using native mongoclient API
const clientConnectionDB = new MongoClient(DB_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
})

// Using options with Mogoose 
// const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

// Why make two function to handle connection of connected and disconnected ?
// "Making the connection separated from each other making connection easier to handle and controlled connection."

async function dbConnection(){
    try {
        console.log("Connecting to mongoDB..... ")
        // console.log(`${DB_URI}`);
        // Connecting to the mongodb server
        // DNS Error
        // using client connection 
        // const startingPinging:number = Bun.nanoseconds()
        const startingPinging:number = performance.now()

        // await clientConnectionDB.connect();
        // 1. Connecting to MongoDB using mongoose
        // using mongoose to connect to the db instead of mongoclient
        // Here we are ACCESSING to SPECIFIC DB inside the cluster
        await mongoose.connect(DB_URI,{
            serverApi: {
                version: '1',
                strict: true,
                deprecationErrors: true
            },
            socketTimeoutMS: 60000, // Give it a full minute
            connectTimeoutMS: 30000,
            serverSelectionTimeoutMS: 30000,
            bufferCommands: true, // Keep this
        })
        // await clientConnectionDB.db('contactManagement')
        // await mongoose.connect(DB_URI)
        // const endpinging:number = Bun.nanoseconds()
        const endpinging:number = performance.now()
        // await clientConnectionDB.once('open',()=>{
        //     console.log("Connection now is now open")
        // })


        // 2. Setup an event listener to open event listener 
        // setup a path to the db connection is established
        // Mongoose has successfully opened a connection to the MongoDB cluster.
        // creating a path to the mongodb connection
        // this to ensure, it doesnt need to do .connect anytime to create 
        // query to the mongodb. It's act as an event listener. 
        // mongoose.connection.once('open',()=>{
        //     // here you can initialize migration that need to happen once 
        //     // after connect
        //     console.log('Moongose connection to mongoDB is establised')
        // })

        mongoose.connection.on('connected',()=>{
             console.log("MongoDB connection established!", DB_URI);
        })

        // 3. Listen to error event listener
        mongoose.connection.on('error',(error)=>{
            console.log(`Connection Error : ${error}`)
        })

        // 4. Disconnect event listener 
        mongoose.connection.on('disconnected',()=>{
            console.log('Mongoose is disconnected from mongodb')
        })

        mongoose.connection.on('reconnected', () => {
            console.log('Mongoose RECONNECTED!');
        });

        const inMiliseconds:number = (endpinging-startingPinging)
        console.log(`Connected to MongoDB :) ${inMiliseconds} miliseconds`)
        // Try to ping to server 
        // console.log(`Pinging to MongoDB........`)
        // await clientConnectionDB.db('contactManagement').command({ping:1});
        // await mongoose.connection.db?.admin().ping();
        // console.log(`Ping received back from server.`)
    } catch (error) {
        mongoose.connection.on('disconnected',()=>{
            console.log('Mongoose is disconnected from mongodb')
        })
        console.log(`${error}`)
    } 
}

export async function disconnectDB(){
    if(mongoose.connection.readyState === 1){
        try{
            console.log("Disconnecting DB...")
            await mongoose.disconnect()
            console.log('Disconnected')
        }catch(error){
            console.warn(error)
        }
    }else{
        console.log(`Disconnected DB State: ${mongoose.connection.readyState}`)
    }

}

export default dbConnection


// const dbConnect = async() => {
//     try {
//         // Establish First Connection
//         await mongoose.connect(DB_URI)
//         console.log("Monogodb connected")
//         // console.log(figlet.textSync('MongoDB Connected'))
//     } catch (error) {
//         console.log(`Not Connected to MongoDB ${error}`)
//     }
// }
// // Since we are using Bun, you cannot use module.exports
// export default dbConnect
