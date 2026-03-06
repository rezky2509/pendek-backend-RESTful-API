import AddressModel, { Address } from "../models/Adresses";
import ContactModel, { Contact } from "../models/Contacts";
import UserModel, { User } from "../models/Users";
import { ObjectId } from "mongodb";

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
        const id = contactDetail._id 
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
        for(let i: number = 0; i<n; n++){
            this.create()
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