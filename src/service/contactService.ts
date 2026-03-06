import { HTTPException } from "hono/http-exception";
import { ContactResponse, CreateContactRequest, SearchContactRequest, toContactResponse, UpdateContactRequest } from "../controller/models/contact-models";
import UserModel, { User } from "../models/Users";
import { ContactValidation } from "../validation/contactValidation";
import ContactModel, { Contact } from "../models/Contacts";
import { ObjectId } from "mongodb";
import { Pageable } from "../controller/models/page-models";
import { object } from "zod";

export class ContactService {
    // the argument expect who the user that 
    // request to create the contact
    // second argument is the request body 
    // return type is the contactResponse inside the models 
    static async create(user: User, request: CreateContactRequest | CreateContactRequest[]): Promise<ContactResponse | ContactResponse[]>{

        // Use definite assignment
        // Definite assignment is ensuring that 
        // this variable will be assigned. 
        // Why definite assignment not working?
        // Why initializing empty array work?
        const contactResponse: ContactResponse[] = []

        // If the request is an array   
        if(Array.isArray(request)){
            for(let a = 0; a<request.length; a++){
                console.log('Validating request')
                const validateRequest = ContactValidation.CREATE.safeParse(request[a])
                console.log('Validate Request result')
                console.log(validateRequest)
                console.log('Request ')
                console.log(request)

                if(validateRequest.error){
                    throw new HTTPException(400,{
                        cause: "Invalid Input. First name is required"
                    })
                }

                console.log('Storing data to collection of contact')
                // Sending data to DB
                const responseDB = await ContactModel.create({
                    firstname: request[a].firstname,
                    lastname: request[a].lastname,
                    email: request[a].email,
                    phone: request[a].phone,
                    user: user._id
                }) as Contact
                console.log('Result from database')
                console.log(responseDB)
                contactResponse.push(toContactResponse(responseDB))
                
                console.log("Stored to contact collection ")
                console.log('Attempting to store at user collection')
                // $set is used for non array object assigment
                // $push: Use when you want to add a new element to an existing array.
                // $set: Use when you want to replace the value of a field, 
                // or update a specific field within an object (including objects within arrays using the positional operator .$).
                await UserModel.findOneAndUpdate(
                    {_id:user._id},
                    {
                        $push:
                        {
                        contactsDetails: {
                                firstname: request[a].firstname,
                                lastname: request[a].lastname,
                                email: request[a].email,
                                phone: request[a].phone,
                                }
                        }
                    }
                )
                console.log("Stored to user collection ")
            }
            return contactResponse
        } else{
            // If the request is not an array
            console.log('Validating request')
            const validateRequest = ContactValidation.CREATE.safeParse(request)
            console.log('Validate Request result')
            console.log(validateRequest)
            console.log('Request ')
            console.log(request)

            if(validateRequest.error){
                throw new HTTPException(400,{
                    cause: "Invalid Input. First name is required"
                })
            }

            console.log('Storing data to DBs')
            // Sending data to DB
            const responseDB = await ContactModel.create({
                firstname: request.firstname,
                lastname: request.lastname,
                email: request.email,
                phone: request.phone,
                user: user._id
            }) as Contact
            console.log("Stored to contact collection ")

            console.log('Attemtpting to store at user collection')
            // Alter the and update the data at contact collections
            // await UserModel.findById({_id: user._id},{
            //     contactsDetails: [
            //         {
            //             firstname: request.firstname,
            //             lastname: request.lastname,
            //             email: request.email,
            //             phone: request.phone,
            //         }
            //     ]
            // })

            // $set is used for non array object assigment
            // $push: Use when you want to add a new element to an existing array.
            // $set: Use when you want to replace the value of a field, 
            // or update a specific field within an object (including objects within arrays using the positional operator .$).
            await UserModel.findOneAndUpdate(
                {_id:user._id},
                {
                    $push:
                    {
                    contactsDetails: {
                            firstname: request.firstname,
                            lastname: request.lastname,
                            email: request.email,
                            phone: request.phone,
                            }
                    }
                }
            )
            console.log("Stored to user collection ")
            console.log(responseDB)
            return toContactResponse(responseDB)
        }
    }

    static async get(user: User, contactId: ObjectId):Promise<ContactResponse>{
        // const validateRequest = ContactValidation.GET.safeParse(contactId) 
        // if(validateRequest.error){
        //     throw new HTTPException(401,{
        //         message: "Invalid contact. Negative number is not allowed"
        //     })
        // }

        // console.log(`User id ${validateRequest.data}`)
        // .populate act as another filter to use the user id. means refer 
        // to the user collection and filter by it's _id object 
        // if(mongoose.Types.ObjectId.isValid(contactId)){
        //     throw new HTTPException(404,{
        //         message:'Contact is not found'
        //     })
        // }

        // Or use regex 
        // var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");

        const contact = await this.contactMustExists(user, contactId)

        return toContactResponse(contact)
    }

    // re-usable method to get contact existing contact detail
    static async contactMustExists(user: User, contactID: ObjectId):Promise<Contact>{
        // if .populate('<collectionName>') means the id will be filled the data related to the collection field
        console.log(`Finding contact in db contact id ${contactID}`)
        // checking id format
        // if(!mongoose.Types.ObjectId.isValid(contactID)){
        //     throw new HTTPException(404,{
        //         cause:"Contact is not found"
        //     })
        // }   

        const contact = await ContactModel.findById({_id: contactID})

        console.log(`contact response db ${contact}`)

        if(!contact){
            throw new HTTPException(404,{
                cause:"Contact is not found"
            })
        }

        return contact
    }

    static async update(user: User, request: UpdateContactRequest):Promise<ContactResponse>{
        const validateRequest = ContactValidation.UPDATE.safeParse(request) 

        if(validateRequest.error){
            throw new HTTPException(404,{
                cause:"Invalid input"
            })
        }

        // For what ?
        // const contact = await this.contactMustExists(user, user._id)
        // use findoneandUpdate to update data. dont use updateOne. it will return different type
        const dbResponse = await ContactModel.findOneAndUpdate({_id:request._id},{
            $set:{
                firstname: request.firstname,
                lastname: request.lastname,
                email: request.email,
                phone: request.phone
            }
        },{new:true}) as Contact

        await UserModel.updateOne({_id:user._id},{$set:{
            contactsDetails:[
                {
                    firstname: request.firstname,
                    lastname: request.lastname,
                    email: request.email,
                    phone: request.phone
                }
            ]
        }})

        return toContactResponse(dbResponse);
        
    }

    static async delete(user: User, contactID: ObjectId):Promise<boolean>{
        const response = await ContactModel.findOneAndDelete({_id: contactID})

        return true
    } 

    // It will return Pageable that wrap the data of the contacts detail and the 
    // pagination details
    static async search(user: User, request: SearchContactRequest): Promise<Pageable<ContactResponse>>{
        const validateRequest = ContactValidation.SEARCH.safeParse(request)
        if(validateRequest.error){
            throw new HTTPException(401,{
                message:"Invalid input"
            })
        }

        // Since the endpoint is dynamic following RESTful API rules,
        // we must store the filters

        let filters = []
        // Check if request name exists

        console.log('Filters')

        if(request.name){
            filters.push({
                // using the OR to find that firstname that contain from the request or the 
                // lastname 
                $or:[
                        {firstname: {$regex: request.name, $options: 'i'}},
                        {lastname: {$regex: request.name, $options: 'i'}}
                    ]
            })
        }else{
            filters.push()
        }
        if(request.email){
            filters.push({
                email: {$regex: request.email, $options: 'i'}
            })
        }else{
            filters.push()
        }
        if(request.phone){
            filters.push({
                phone: {$regex: request.phone, $options: 'i'}
            })
        }else{
            filters.push()
        }
        // Filter is the condition
        console.log(filters)

        // Not sure what this use for. 
        const skip = (request.page - 1) + request.size
        console.log('Sending data to db')        // The filters should be here 
        console.log(request.name)
        // const responseDB = await ContactModel.find().where({user: user._id,$and:filters}).exec()

        // The "i" flag in a regular expression stands for case-insensitive matching. 
        // It is an optional flag that modifies the behavior of the regex engine.
        // the option filters by insensitive flag where it ignore the upper case 
        // it will search based on the text only 
        const responseDB = await ContactModel.find(
            {
                user: user._id,
                $and: filters
            }
        ).exec()

        // This code need to revise. 
        // The syntax require to return based on the number of result. 
        const reviseResponse = await ContactModel.find({
                user: user._id,
                $and: filters
        }).limit(request.size).exec()
        //.limit(10)
        // these we can limit for one response
        // how many result we can send back to the user.
        console.log(`Revise Variable result`)
        console.info(reviseResponse)

        // Mongoosejs has query builder for paginate()
        // https://www.freecodecamp.org/news/how-to-write-cleaner-code-using-mongoose-schemas/#heading-query-builder

        console.log(responseDB)

        console.log('Total document')
        const total = await ContactModel.countDocuments({user: user._id, $and: filters})
        console.log(total)

        return {
            // this map the contact value into an array
            // data: responseDB.map(contact=>toContactResponse(contact)),
            data: reviseResponse.map(contact=>toContactResponse(contact)),
            paging: {
                current_page: request.page,
                // size: request.size,
                size: total,
                // Size here define the number of data.
                total_page: Math.ceil(total/request.size)
            }
        }
    }
}