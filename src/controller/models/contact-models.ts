// Here we defined the request and response of the contact collections

import { ObjectId } from "mongodb"
import { Contact } from "../../models/Contacts"

export type CreateContactRequest = {
    firstname: string,
    lastname?: string,
    email?: string, 
    phone?: string
}

export type ContactResponse = {
    _id: ObjectId
    firstname: string,
    lastname?: string,
    email?: string, 
    phone?: string,
    user: ObjectId
}

export type UpdateContactRequest = {
    _id: ObjectId,
    firstname: string,
    lastname?: string,
    email?: string, 
    phone?: string
}

export type SearchContactRequest = {
    name?: string,
    phone?: string,
    email?: string,
    page: number,
    size: number
}

// expecting the argument to recieve Contact schema 
// return type is expecting to be contact response 
export function toContactResponse(contact: Contact): ContactResponse {
    return {
        _id: contact._id,
        firstname: contact.firstname,
        lastname: contact.lastname,
        email: contact.email,
        phone: contact.phone,
        user: contact.user
    }
}