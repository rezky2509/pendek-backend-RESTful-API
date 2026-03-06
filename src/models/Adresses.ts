import type {ObjectId} from "mongodb";
import mongoose, { Schema, model } from "mongoose";


// Create the interface 
export interface Address {
    _id: ObjectId,
    street?: string, 
    city?: string, 
    province?: string,
    country?: string, 
    postal_code?: string, 
    contact: ObjectId //<= Refer to single contact document
} 

// Following the schema type
const AddressSchema = new Schema({
    street: {type: String},
    city:{type: String},
    country:{type: String},
    province: {type: String},
    postal_code:{type: String},
    // Here how to make relation to other collection document 
    // refer to objectID, refer to contact collection, and required
    contact:{type: Schema.Types.ObjectId, ref:'Contact', required: true}
})

// The reference to contact document (relation)
// always use an array with type: Schema.Types.ObjectId

// Create Model 
const AddressModel = mongoose.model<Address>('Address',AddressSchema,'addresses')
export default AddressModel


// const UserAddressModel = model('user-address',Address)
// export default UserAddressModel