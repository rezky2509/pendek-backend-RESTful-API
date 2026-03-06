import type {ObjectId} from "mongodb";
import mongoose, { Schema, model } from "mongoose";


// Create the interface 
export interface Contact {
    _id: ObjectId,
    firstname: string,
    // last name is optional
    lastname?: string,
    email?: string,
    phone?: string
    // Why an array of object id ?
    // because one contact can have many users 
    // one can can hve many 
    user: ObjectId //=> Refer to user id
}

// Following the schema type
const ContactSchema: Schema = new Schema({
    firstname: {type: String},
    lastname: {type: String},
    email: {type: String},
    phone: {type: String},
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const ContactModel = mongoose.model<Contact>('Contact', ContactSchema, 'contacts')

export default ContactModel