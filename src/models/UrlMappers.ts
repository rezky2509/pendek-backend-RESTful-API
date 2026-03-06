import { ObjectId } from "mongodb";
import mongoose, {Schema} from 'mongoose';

// TYPE DEFINITON
export interface UrlMapper {
    _id: ObjectId,
    user_id: ObjectId,
    long_url: string, 
    short_url: string,
    description?: string | undefined, 
    total_click: number,
    created_at: string, 
    is_active: boolean
}


// SCHEMA DEFINITION 
const UrlMapperSchema: Schema = new mongoose.Schema({
    user_id :{
        type: ObjectId,
        unique: false
    },
    long_url : {
        type: String
    },
    short_url : {
        type: String
    },
    description : {
        type: String
    },
    total_click: {
        type: Number
    },
    // converted to iso STRING format 
    created_at : {
        type: String
    },
    is_active : {
        type: Boolean
    }
})

const URL_MAPPER_MODEL = mongoose.model<UrlMapper>('URLMapper',UrlMapperSchema)

// Set as default for type definition
export default URL_MAPPER_MODEL
