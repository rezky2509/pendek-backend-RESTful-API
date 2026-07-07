import type { ObjectId } from "mongodb";
import mongoose, {Schema} from 'mongoose'

// SOON FEATURES

// This seems the statistics for each short URL 
export interface OverAllStatistics {
    userId: ObjectId,
    totalClicks: number, 
    mostClicks: string, 
    // This will list out the cllck
    graphClicks: Map<string, number>,
    mostDeviceClicks: string,
    // Soon 
    // statisticsDevice : {
    //     android: number,
    //     ios: number,
    //     macOS: number,
    //     windows: number,
    //     linux: number
    // },
    // Hold the data for each statistics 
    // "20 Jun","22"
    clicksStatics: Map<string, number>
    // Key-value tracking: { "MY": 120, "SG": 45 }
    regions: Map<string, number>; 
}