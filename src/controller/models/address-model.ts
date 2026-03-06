import { Address } from '../../models/Adresses'
import type {ObjectId} from "mongodb";

// the type of data

// This is the request format from FE

// Endpoint: POST /api/contacts/{contactID}/addresses
// the parameter of contactID is the objectID of the contact collection. 

export type CreateAddressRequest = {
    // according to the API spec, for address document 
    // the endpoint or parameter expecting a id of the contact 
    // so in order to received and store it we need to store 
    // inside the request 

    // currently use type of objectID 
    // since the unique identifier for contact id 
    // the type is object ID
    contact: string,
    // previously it use number as the type. 
    // contact_id: number,
    
    street?: string,
    city?: string,
    province?: string,
    country?: string,
    postal_code?: string,
}

// For update format
export type UpdateAddressRequest = {
    _id: string,
    street?: string,
    city?: string,
    province?: string,
    country?: string,
    postal_code?: string,
    contact: string
}

// This is the BE response format. 
export type AddressResponse = {
    _id: ObjectId,
    street?: string,
    city?: string,
    province?: string,
    country?: string,
    postal_code?: string,
    contact?: string
}

// GET endpoint 
export type GetAddressRequest = {
    contact_id: string
    address_id: string
}

// Delete Endpoint Parameter 
export type DeleteAddressRequest = {
    contact_id: string,
    address_id: string
}

// This is the return type (since Typescript is type safe)
// this the response that will be send back to FE
// the type of address is from the address collection model 
export function toAddressResponse(address: Address): AddressResponse {
    // return as an object 
    // but the type must be as addressresponse
    return {
        _id: address._id,
        street: address.street,
        city: address.city,
        province: address.province,
        country: address.country,
        postal_code: address.postal_code,
        contact: address.contact.toString()
    }
}