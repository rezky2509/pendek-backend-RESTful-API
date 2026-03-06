// test-db-delete.ts
import mongoose from 'mongoose';
import  UserModel  from '../models/Users'; // Adjust this path if needed
import  {UserTest}  from '../test/test-util';     // Adjust this path if needed
import { ENV } from '../utils/env';

const MONGODB_URI: string = ENV.MONGODB_COMPASS_URI

async function runStandaloneDeleteTest() {
    console.log("--- Starting Standalone DB Delete Test ---");
    try {
        // 1. Connect to MongoDB
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI, {
            // Add explicit timeouts for better debugging if it still hangs
            serverSelectionTimeoutMS: 5000, // Try to connect for 5 seconds
            socketTimeoutMS: 5000,          // Keep socket open for 5 seconds of inactivity
        });
        console.log("MongoDB connected successfully.");
        console.log('Mongoose connection readyState:', mongoose.connection.readyState);

        // 2. Ensure a 'test' user exists to be deleted
        console.log("Creating a 'test' user if it doesn't exist...");
        const existingUser = await UserModel.findOne({ username: "test" });
        if (!existingUser) {
            await UserTest.create(); // Use your UserTest.create to ensure consistency
            console.log("'test' user created for deletion test.");
        } else {
            console.log("'test' user already exists, skipping creation.");
        }

        // 3. Attempt the delete operation using your UserTest.delete() method
        console.log("Attempting to delete the 'test' user via UserTest.delete()...");
        await UserTest.delete(); // This internally calls UserModel.deleteMany({username:"test"})
        console.log("!!! 'test' user DELETED SUCCESSFULLY in standalone test !!!");

    } catch (error) {
        console.error("!!! Standalone DB Delete Test FAILED !!!");
        console.error("Error:", error);
        if (error instanceof Error && error.stack) {
            console.error("Error stack:", error.stack);
        }
    } finally {
        // 4. Disconnect from MongoDB
        console.log("Disconnecting from MongoDB...");
        if (mongoose.connection.readyState === 1) { // Only disconnect if connected
            await mongoose.disconnect();
        }
        console.log("MongoDB disconnected.");
        console.log("--- Standalone DB Delete Test Finished ---");
    }
}

runStandaloneDeleteTest();