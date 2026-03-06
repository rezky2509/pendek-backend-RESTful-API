// Migration tools using Mongoose 
// npm install ts-migrate-mongoose

// import type{Config} from 'ts-migrate-mongoose';


import mongoose from 'mongoose';

// import the model 
import UserModel from '../models/Users';
import UrlMapper from '../models/UrlMappers';
import { exit } from 'process';

// <------------ Run This on New Project ----------------->
// The CLI Command is 
// bun run migration

// Import DB Connection
// const connectionToDb = require('./dbConnection.ts')
import dbConnection from './dbConnection';


async function setupCollection(){
    try{
        // run the connection to mongoDB
        // await dbConnection()
        
        // now just use mongoose.connect to connect the mongoDB
        // await mongoose.connect(ENV.MONGODB_COMPASS_URI)
        await dbConnection()
        // console.log("Connected to MongoDB")
        // Run Migration to create collection
        // SyncIndexes means check all index defined is schema is present in collection
        // If an index is defined in your schema but doesn't exist in the database, it will be created. 
        // If an index exists in the database but is not defined in your schema, 
        // it will be dropped (be careful with this in production if you have manually created indexes not reflected in Mongoose).
        // When Mongoose attempts to create an index on a collection that doesn't exist, 
        // MongoDB will implicitly create that collection. So, by ensuring indexes, 
        // you implicitly ensure the collections are created as well.
        // If index does not exists, its create the new index as well the new collection

        // Check index of usermodel and create the collection
        console.log("Checking user index is exists...")
        await UserModel.syncIndexes(); 
        console.log("'users' collection and index has been created")

        // Check index of ContactModel and create the collection
        console.log("Checking url_mapper index is exists...")
        await UrlMapper.syncIndexes();
        console.log("'url_mapper' collection and index has been created")

        console.log('\nAll collections and indexes are set up successfully!');
    }catch(error){
        console.error(`${error}`);
        exit
    }finally{
        // Close connection once migration completed
        await mongoose.disconnect();
        console.log("MongoDB disconnected")
    }
}

// Call this function run these execution
setupCollection()
