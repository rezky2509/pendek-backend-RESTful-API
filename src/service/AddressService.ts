// Middleware (store the current user)
import { HTTPException } from "hono/http-exception";
import { AddressResponse, CreateAddressRequest, GetAddressRequest, toAddressResponse, UpdateAddressRequest, DeleteAddressRequest } from "../controller/models/address-model";
import AddressModel, { Address } from "../models/Adresses";
import { Contact } from "../models/Contacts";
import { User } from "../models/Users";
import { AddressValidation } from "../validation/AddressValidation";
import { ContactService } from "./contactService";
import mongoose, { Mongoose } from "mongoose";

export class AddressService {
   static async create(user: User, request: CreateAddressRequest| CreateAddressRequest[]): Promise<AddressResponse | AddressResponse[]>{
    // Checking the address response payload format 
   console.log(`Checking payload`)
   // let validation = AddressValidation.CREATE.safeParse(request)
   // console.log(validation)

   // (Loop for every data)
   // Check every array data format
   if(Array.isArray(request)){
      // if the data is an array
      console.log('Data is an array')
      for(let a = 0; a<request.length; a++){
         let validation = AddressValidation.CREATE.safeParse(request[a])
         if(validation.success == false){
            throw new HTTPException(400,{
               cause: 'Invalid Input'
            })
         }

         // 2. Check the contact id is valid 
         console.log(`Checking contact ID format from parameter`)
         const idIsValid: boolean = mongoose.Types.ObjectId.isValid(request[a].contact)
         if(!idIsValid){
            throw new HTTPException(404,{
               cause:"Contact not found"
            })
         }

         // 3. Check if the contact is exist when the id is valid ()input must be a 24 character hex string, 12 byte Uint8Array, or an integer
         console.log(`Checking does the contact is exist`)
         const contactIsExist = await ContactService.contactMustExists(user, new mongoose.Types.ObjectId(request[a].contact)) 
         if(!contactIsExist){
            throw new HTTPException(404,{
               cause:"Contact not found"
            })
         }
      }
      // Insert Many
      // 4. If all condition is meet, insert the contact to database
      // insert to mongodb
      console.log('Inserting data to db')
      //  error here 
      const address = await AddressModel.create(request)
      // return as toAddressResponse Model 
      // return toAddressResponse(address) 
      return address.map((a:Address)=>(
         toAddressResponse(a)
      ))
      
   }else{
      console.log('Data is not an array')
      const validation = AddressValidation.CREATE.safeParse(request)
      // If the data is not an array
      // Refactor 
      // 1. Check the payload. 
      console.log(request)
      console.log(validation.error)
      if(validation.success===false){
         console.log(`Payload is invalid.`)
         throw new HTTPException(400,{
            cause: 'Invalid Input'
         })
      }
      // 2. Check the contact id is valid 
      console.log(`Checking contact ID format from parameter`)
      const idIsValid: boolean = mongoose.Types.ObjectId.isValid(request.contact)
      if(!idIsValid){
         throw new HTTPException(404,{
            cause:"Contact not found"
         })
      }
      // 3. Check if the contact is exist when the id is valid ()input must be a 24 character hex string, 12 byte Uint8Array, or an integer
      console.log(`Checking does the contact is exist`)
      const contactIsExist = await ContactService.contactMustExists(user, new mongoose.Types.ObjectId(request.contact)) 
      if(!contactIsExist){
         throw new HTTPException(404,{
            cause:"Contact not found"
         })
      }
      // 4. If all condition is meet, insert the contact to database
      // insert to mongodb
      console.log('Inserting data to db')
      //  error here 
      const address = await AddressModel.create(request)

      // return as toAddressResponse Model 
      return toAddressResponse(address)
   }



   }

   static async get(user: User, request: GetAddressRequest) {
      console.log('Address Get Service called')
      const validation = AddressValidation.GET.safeParse(request)

      // Check user request format
      console.log('Checking request format')
      console.log(validation)
      if(validation.success == false){
         throw new HTTPException(400,{
            cause: 'Invalid Request'
         })
      }
      // Check the address id format
      console.log('Checking address ID format')
      const addressIDIsValid = mongoose.Types.ObjectId.isValid(request.address_id)  
      if(!addressIDIsValid){
         throw new HTTPException(404,{
            cause: 'Address and Contact Not Found'
         })
      }

      // Check if the contact that the user request is exist
      const checkContactIsExist = await ContactService.contactMustExists(user,new mongoose.Types.ObjectId(request.contact_id))
      if(!checkContactIsExist){
         throw new HTTPException(404,{
            cause: 'Not Found'
         })
      }

      // Check the contact details
      const getContactDetails = await AddressModel.findById(new mongoose.Types.ObjectId(request.address_id)).exec()
      // if the contact details is does not exist
      if(!getContactDetails){
         throw new HTTPException(404,{
            cause: 'Not Found'
         })
      }
      console.log(`Result from database`)
      // Return if the contact details is exist
      return toAddressResponse(getContactDetails)
   }

   static async update(user: User, request: UpdateAddressRequest, contact_id: string): Promise<AddressResponse>{
      console.log('Address Update Service called') 
      console.log('Checking request format')
      // console.log(request)

      const validationRequest = AddressValidation.UPDATE.safeParse(request)
      if(validationRequest.success == false){
         throw new HTTPException(400,{
            cause: 'Invalid Request'
         })
      }
      // Check the address id format
      console.log('Checking address ID format')
      const addressIDIsValid = mongoose.Types.ObjectId.isValid(request._id)
      if(!addressIDIsValid){
         throw new HTTPException(404,{
            cause: 'Address Not Found'
         })
      }
      
      // Check if the contact that the user request is exist
      console.log('Checking Contact is exist') 
      if(!mongoose.Types.ObjectId.isValid(contact_id)){
         console.log('Contact ID received is invalid')
         throw new HTTPException(404,{
            cause: 'Contact Not Found'
         })
      }
      const contactIsExist = await ContactService.contactMustExists(user, new mongoose.Types.ObjectId(contact_id))
      console.log(`Contact after called from service ${contactIsExist}`)
      if(!contactIsExist){
         console.log('Contact not found')
         throw new HTTPException(404,{ 
            cause: 'Contact Not Found'
         })
      }

      // Check if the address is exist
      console.log('Checking Address is exist')
      const checkAddressIsExist = await AddressModel.findById(new mongoose.Types.ObjectId(request._id)).exec()   
      if(!checkAddressIsExist){
         throw new HTTPException(404,{
            cause: 'Address Not Found'
         })
      }  

      // Update the address
      console.log('Updating address data')
      // findbyidandupdate need tow params   
      // 1. the ID of the document to update
      // 2. the updated data 
      // 3. exec() is to execute the data
      // the {new: true} is expecting the updated document to be returned. 
      const updatedAddress = await AddressModel.findByIdAndUpdate(
         new mongoose.Types.ObjectId(request._id),
         request,
         {new: true}
      ).exec()

      // if the update failed
      if(!updatedAddress){
         throw new HTTPException(500,{
            cause: 'Failed to update address. Please try again later.'
         })
      }

      return toAddressResponse(updatedAddress)
   }

   // Still error here
   static async delete(user: User, parameter: DeleteAddressRequest): Promise<String | boolean>{
      console.log('Checking parameter request')
      // const coversion = new mongoose.Types.ObjectId(addressID) as ObjectId
      const validateContact_ID = mongoose.Types.ObjectId.isValid(parameter.contact_id)
      const validateAddress_ID = mongoose.Types.ObjectId.isValid(parameter.address_id)
      if(!validateAddress_ID || !validateContact_ID){
         throw new HTTPException(404,{
            cause: 'Contact or Address not found'
         })
      }
      
      // Check if contact id is exist 
      // contactService does not need to store, 
      // it will automatically check if the contact does not exist 
      // it will throw HTTP Error 404. 
      // the implementaion is there. 
      await ContactService.contactMustExists(user, new mongoose.Types.ObjectId(parameter.contact_id))

      // check if the address_id is exist or not 
      const addressIsExist = await AddressModel.findById(new mongoose.Types.ObjectId(parameter.address_id))
      if(!addressIsExist){
         throw new HTTPException(404,{
            cause: 'Contact or Address not found'
         })
      }

      // Deleting the address
      console.log('Deleting the address')
      // Using delete one because need the boolean result
      const result = await AddressModel.deleteOne({_id: new mongoose.Types.ObjectId(parameter.address_id)}).exec()
      if(result.deletedCount == 1){
         return 'Delete Success'
      }else{
         return 'Delete Failed'
      }
   }

   // List address  
   static async getAllAddressByContactID(user: User, contactID: string): Promise<AddressResponse[]>{
      console.log('Get all address by contact ID service called')
      // Validate contact ID format
      const contactIDIsValid = mongoose.Types.ObjectId.isValid(contactID) 
      if(!contactIDIsValid){
         throw new HTTPException(404,{
            cause: 'Contact Not Found'
         })
      }
      // Check if contact is exist
      await ContactService.contactMustExists(user, new mongoose.Types.ObjectId(contactID))
      // Check if address is exist
      // the address must exist need to use two params. 
      // await this.addressMustExist(contactID)
      // Get all address by contact ID from database
      const addressList = await AddressModel.find({contact: contactID}).exec()
      // Map the result to AddressResponse model
      // Mapping is to map with the addressresponse type
      const responseList: AddressResponse[] = addressList.map((address)=>{
         return toAddressResponse(address)
      })
      return responseList
   }

   // Checking if address is exist 
   static async addressMustExist(contact_id: string, address_id: string): Promise<Address[]>{
      // since the return is Address type, it only expecting one document not an array
      // Check the parameter id 
      const contactIDIsValid = mongoose.Types.ObjectId.isValid(contact_id)
      const addressIDIsValid = mongoose.Types.ObjectId.isValid(address_id)
      if(!contactIDIsValid||!addressIDIsValid){
         throw new HTTPException(404,{
            cause: 'Address or Contact is not found'
         })
      }

      console.log('Checking DB')
      // Or can use the 
      // await AddressModel.findOne().exec()
      const responseDB = await AddressModel.find({contact: contact_id, _id: address_id}).exec()
      // if the response does not exist or return null. 
      if(!responseDB||responseDB.length<=0){
         throw new HTTPException(404,{
            cause:"Address does not exist"
         })
      }
      return responseDB
      
   }
}  