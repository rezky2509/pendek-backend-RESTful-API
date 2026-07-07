import { ObjectId } from "mongoose";
import { User } from "../models/Users";
import UrlStatisticModel from "../models/Statistics";


export class UrlStatistic {
    static async updateUrlStatistic(urlID:ObjectId, userID: User){
        // Step 1, 
        // Check date is it 
        // Change to check if the date is the same store to 
        // existing row
        const now: Date = new Date()
        // const nowTime = currentDateTime.toLocaleTimeString('en-GB',{
        //         hour: '2-digit',
        //         minute: '2-digit',
        //         second: '2-digit',
        // });
        const getCurrentDate = now.toLocaleDateString('en-GB')

        // Take the current record from the database (or cache)
        // const currentRecord = await UrlStatisctic.findOne('url_id')
        const currentRecord = await UrlStatisticModel.find({'user_id':userID}).exec()
    
        // Step 1.1
        // If no data yet, add new row 
        // Then record it 
        if(!currentRecord){
            
        }
        // await UrlStatistic.insert(datagohere)


        // Step 1.2
        // If data exist and date is the same as current 
        // then record to the existing url id 
        // await UrlStatitstic.updateOne()
        

        // Step 1.3
        // If data exist and date is not the same as current
        // Record to new data . 
        // await UrlStatistic.insertOne()



    }
}