import { ObjectId } from "mongodb";
import mongoose, {Schema} from 'mongoose'

// The Algorithm
// Before end of day, it will record as one day. 

// Use Record For FE

// This hold statistic for each url 
export interface UrlStatistics {
    user_id: ObjectId,
    url_id: ObjectId,
    date_capture: string,
    total_clicks: number,
    // Hold hourly data
    // soon feature for realtime view statitsic
    // statistic: Map<string, number>, //<=- ??
    deviceType : {
        android: number,
        ios: number,
        macOS: number,
        windows: number,
        linux: number
    },
    // Key-value tracking: { "MY": 120, "SG": 45 }
    regions: Record<string, number>; 
}


// Schema Definition 
const SchemaURLStatistics: Schema = new mongoose.Schema({
    user_id: {
        type: ObjectId,
        unique: false
    },
    // This is the URL ID not the unique id to be redirect
    url_id: {
        type: ObjectId,
        unique: false
    },
    date_capture: {
        type: String, 
        required: true,
    },
    total_clicks:{
        type: Number,
        required: true
    },
    deviceType:{
        android: {
            type: Number, default: 0,
        },
        ios: {
            type: Number, default: 0
        },
        macOs: {
            type: Number, default: 0
        },
        windows:{
            type: Number, default: 0
        },
        linux: {
            type: Number, default: 0
        }
    },
    regions:{
        required: false,
        type: Map,
        // of means the type of or the type that can be store 
        // Refer to the type definition not schema
        // "MY":"22"
        of: Number,
        // Default set as an empty object
        default:{}
    }
})

// Ensuring ONE document can exists per URL 
// This is enabling indexing (for top level (such as the url id ))
// Making one url id can only be 1 and it's date capture unique
// https://mongoosejs.com/docs/guide.html#indexes
SchemaURLStatistics.index({url_id: 1, date_capture: 1},{unique: true})

const UrlStatisticModel = mongoose.model<UrlStatistics>('UrlStatistic',SchemaURLStatistics)

export default UrlStatisticModel