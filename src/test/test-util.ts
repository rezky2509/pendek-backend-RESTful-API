import AddressModel, { Address } from "../models/Adresses";
import ContactModel, { Contact } from "../models/Contacts";
import URL_MAPPER_MODEL from "../models/UrlMappers";
import UserModel, { User } from "../models/Users";
import { ObjectId } from "mongodb";

import app from '../index'

export class UserTest {
    // These unit test class DIRECTLY insert to DB
    static async create(){
        await UserModel.insertOne({
            name: "test",
            username: "test",
            password: await Bun.password.hash('secretStuff',{
                algorithm:"bcrypt",
                cost:10
            }),
            token: 'test'
        })
    }

    static async delete(){
        console.log("UserTest.delete(): Attempting to delete all documents.");
        try{
            await UserModel.deleteOne({username: 'test'})
        }catch(error){
            console.log(`${error}`)
        }
        // await UserModel.deleteOne({username: 'test'}).exec()
        console.log("UserTest.delete(): Successfully deleted all documents");
        // const username:string = "test";
        // await UserModel.deleteOne({username:'test'})
    }


    static async deleteEntireDocument(){
        console.log("Deleting Entire Row..")
        try{
            await UserModel.deleteMany()
        }catch(error){
            console.warn(`Error in ${error}`)
        }
        console.log("Successful Delete Entire Document")
    }

    static async deleteWithCondition(){
        console.log("Deleting Specific Collection..")
        try{
            await UserModel.deleteOne({username:'kiki12345'})
        }catch(error){
            console.warn(`Error in ${error}`)
        }
        console.log("Successful Deleted username kiki1235")
    }

    // parameter accepted is objectid by mongodb
    static async getID():Promise<ObjectId>{
        const contactDetail = await UserModel.findOne({username:'test'}) as User
        console.log(contactDetail)
        const id = contactDetail._id as ObjectId
        return id
    }
    
}

export class ContactTest{
    static async delete(){
        console.log("Deleting contact detail")
        try {
            await ContactModel.deleteOne({firstname:"kucing"})
            console.log('Deleted Contact detail')
        } catch (error) {
            console.warn(`Error in ${error}`)
        }
    }

    static async create(){
        console.log('Adding contact detail')
        try{
            await ContactModel.create({
                firstname:"kucing",
                lastname:"Satok",
                email:"kenyalang@gmail.com",
                phone:"0152535345",
                user: await UserTest.getID()
            })
            console.log('Contact added')
        }catch(error){
            throw error
        }
    }

    static async get(): Promise<Contact>{
        console.log('Fetching Contact Details')
        let contactDetails: Contact
        try {
            contactDetails = await ContactModel.findOne({firstname:'kucing'}) as Contact
            console.log('Contact fetched')
        } catch (error) {
            throw error
        }

        return contactDetails
    }

    static async deleteContact(){
        console.log('Deleting contact test')
        try {
            await ContactModel.deleteMany({firstname:'kucing'}) 
            console.log('Deleted')
        } catch (error) {
            throw error 
        }
    }

    static async createMany(n: number){
        console.log(`Creating contact with amount of ${n}`)
        for(let i: number = 0; i<n; i++){
            await this.create()
        }
    }
}

export class AddressTest {
    static async deleteAllAddress(){
        console.log(`Deleting all address`)
        try {
            console.log('Deleting')
            await AddressModel.deleteMany({contact: await ContactTest.get().then((contact)=>contact._id)})
        }catch(error){
            throw error
        }
    }
    static async create(){
        console.log('Adding address detail')  
        await AddressModel.create({
            street:"street",
            city:"city",   
            province:"country",
            country:"country",
            postal_code:"1512",      
            contact: await ContactTest.get().then((contact)=>contact._id)
        })
        console.log('Address added')
    }

    static async get(){
        console.log('Fetching Address Details')
        let addressDetails: Address
        try {
            addressDetails = await AddressModel.findOne({country:'country', postal_code:'1512'}) as Address
        } catch (error) {
            throw error
        }   
        console.log('Address fetched')
        return addressDetails
    }

    // not use
    static async createManyAddress(){
        console.log('Creating many address on one contact')
        try{
            for(let i=0; i<5; i++){
                await AddressModel.create({
                    street:`street ${i}`,
                    city:`city ${i}`,   
                    province:`country ${i}`,
                    country:`country ${i}`,
                    postal_code:`1512${i}`,      
                    contact: await ContactTest.get().then((contact)=>contact._id)
                })
            }
        }catch(error){
            throw error
        }
    }
}

export class UrlMapperTest{
    static async addURL(){
        console.log('Inserting URL...')
        // Should just directly use the API call not directly insert 
        // await URL_MAPPER_MODEL.insertOne({
        //     user_id: await UserTest.getID(),
        //     long_url: 'https://www.google.com',
        //     description: 'LALALALA',
        //     is_active: true
        // })
        await app.request('/api/url_mapper',{
            method:'POST',
            headers:{
                'Authorization':'test'
            },
            body:JSON.stringify({
                long_url: 'https://www.google.com',
                description: 'LALALALA',
                is_active: true
            })
        })
        console.log('Insert Success')
    }

    static async createMany(n: number){
        console.log('Inserting Many')
        for(let a:number = 1; a<n; a++){
            // Need await since it's return as promise
            await this.addURL();
        }
    }

    static async deletOne(){
        console.log('Deleting ONE ')
        await URL_MAPPER_MODEL.deleteOne({
            user_id: await UserTest.getID() as ObjectId
        })
        console.log('Delete success')
    }

    static async getOneUrlId():Promise<ObjectId>{
        console.log('Getting URL ID')
        const result = await URL_MAPPER_MODEL.findOne(
            {
                user_id: await UserTest.getID() as ObjectId
            },
            {
                _id: 1
            }
        ).exec()
        console.log(result)
        return result?._id!
    }

    static async deleteAllURL(){
        console.log('Deleting....')
        await URL_MAPPER_MODEL.deleteMany({
            user_id: await UserTest.getID() as ObjectId
        })
        console.log('Deleted success')
    }
}