import type { ObjectId } from "mongodb";
import mongoose, {Schema} from 'mongoose'

// The Algorithm
// Before end of day, it will record as one day. 

export interface Statistic {
    url_id: ObjectId,
    deviceType : {
        android: number,
        ios: number,
        macOS: number,
        windows: number,
        linux: number
    },
    region: string | string[],

}