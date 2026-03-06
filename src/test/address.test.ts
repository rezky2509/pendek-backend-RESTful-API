import {expect, describe, it, beforeEach} from 'bun:test'
import { AddressTest, ContactTest, UserTest } from './test-util'
import app from '../index'
import { logger } from '../application/logging'

describe ("POST /api/contacts/:id/addresses",()=>{
    // Pass 15/01/2026
    it('should rejected if request is not valid',async ()=>{
        await UserTest.create()
        await ContactTest.create()
        const contact = await ContactTest.get()
        // using the .toString to convert to string. 
        const contactID: string = contact._id.toString()
        console.log(`User contact id `)
        logger.debug(contactID)
        const response = await app.request('/api/contacts/'+contactID+'/addresses',{
            method: 'POST',
            headers:{
                'Authorization':'test'
            },
            body: JSON.stringify({
                country:'',
                postal_code:''
            })
        })
        expect(response.status).toBe(400)
        const body = await response.json()
        expect(body.errors).toBeDefined()
    })
    // Pass 15/01/2026
    it('should rejected if contact is not valid',async ()=>{
        // await ContactTest.get()
        // const invalidID: ObjectId = 
        const invalidID = 4
        const response = await app.request('/api/contacts/'+invalidID+'/addresses',{
            method: 'POST',
            headers:{
                'Authorization':'test'
            },
            body: JSON.stringify({
                country:'Indonesia',
                postal_code:'2131'
            })
        })
        expect(response.status).toBe(404)
        const body = await response.json()
        expect(body.errors).toBeDefined()         
    })
    // Pass 15/01/2026
    it('should success if request is valid',async ()=>{
        const getContact = await ContactTest.get()
        const response = await app.request('/api/contacts/'+getContact._id+'/addresses',{
            method:'POST',
            headers:{
                'Authorization':'test'
            },
            body: JSON.stringify({
                street:"street",
                city:"city",
                province:"country",
                country:"country",
                postal_code:"1512"
            })
        })

        expect(response.status).toBe(201)
        logger.debug(response.status)
        const body = await response.json()
        expect(body.data.street).toBe("street")
        expect(body.data.city).toBe("city")
        expect(body.data.province).toBe("country")
        expect(body.data.country).toBe("country")
        expect(body.data.postal_code).toBe("1512")

        await UserTest.delete()
        await AddressTest.deleteAllAddress()
        await ContactTest.delete()
    })

    it('should return multiple address when the contact id is valid and the body contain multiple addresses', async()=>{
        await UserTest.create()
        await ContactTest.create()
        // await AddressTest.createManyAddress()
        const contactID  = await ContactTest.get()
        const response = await app.request('/api/contacts/'+ contactID._id + '/addresses',{
            method:'POST',
            headers:{
                'Authorization':'test'
            },
            body:JSON.stringify(
                {
                data:[
                        {
                            street:"street",
                            city:"city",   
                            province:"country",
                            country:"country",
                            postal_code:"1512",      
                        },
                        {
                            street:"street",
                            city:"city",   
                            province:"country",
                            country:"country",
                            postal_code:"1512",      
                        }
                    ]
                }
            )
        })
        const body = await response.json();
        expect(response.status).toBe(201)
        logger.debug(body.errors)
        // expect(response.status).toBe(201)
        expect(body.data.length).toBe(2)

        await AddressTest.deleteAllAddress()         
        await ContactTest.delete()
        await UserTest.delete()

        // expect(response.status).toBe(200)
        // expect(bodyResponse.data.length).toBe(2)~
    })
})

describe ("GET /api/contacts/:contactID/addresses/:addressID",()=>{
    // Pass 15/01/2026
    it('should rejected if address is not found',async ()=>{
        await UserTest.create()
        await ContactTest.create()
        // const contact = await ContactTest.get()
        // const address = await AddressTest.get()
        const response = await app.request('/api/contacts/'+21312312+'/addresses/'+3232312312312,{
            method: 'GET',
            headers:{
                'Authorization':'test',
            }
        })
        expect (response.status).toBe(404)
        const body = await response.json()
        expect(body.errors).toBeDefined()

        await AddressTest.deleteAllAddress()
        await ContactTest.delete()
        await UserTest.delete()
    })
    // Pass 15/01/2026
    it('should success if address is found',async ()=>{
        await UserTest.create()
        await ContactTest.create()
        await AddressTest.create()
        const getContact = await ContactTest.get()
        // const createAddress = await AddressTest.create()
        const getAddress = await AddressTest.get()
        const response = await app.request('/api/contacts/'+getContact._id+'/addresses/'+getAddress._id,{
            method: 'GET',
            headers:{
                'Authorization':'test',
            }
        })
        expect (response.status).toBe(200)
        const body = await response.json()
        expect(body.data.street).toBe('street')
        expect(body.data.city).toBe('city')
        expect(body.data.province).toBe('country')
        expect(body.data.country).toBe('country')
        expect(body.data.postal_code).toBe('1512')
        
        await AddressTest.deleteAllAddress()
        await ContactTest.delete()
        await UserTest.delete()
    })
})

describe ("PUT /api/contacts/:contactID/addresses/:addressID",async ()=>{
    // Pass 15/01/2026
    it('should failed if address is not found',async ()=>{
        await UserTest.create()
        await ContactTest.create()
        await AddressTest.create()
        const contact_id = await ContactTest.get()
        const response = await app.request('/api/contacts/'+contact_id._id+'/addresses/'+'dasdasdas0das0d0asd0as',{
            method: 'PUT',
            headers:{
                'Authorization':'test'
            },
            body: JSON.stringify({
                street:"street",
                city:"city",
                province:"country",
                country:"country",
                postal_code:"1512"
            })
        })

        // const body = await response.json()
        expect(response.status).toBe(404)

        await AddressTest.deleteAllAddress()
        await ContactTest.delete()
        await UserTest.delete()
    })
    // Pass 15/01/2026
    it('should failed if contact is not found',async()=>{
        await UserTest.create()
        await ContactTest.create()
        await AddressTest.create()
        const addressDetails = await AddressTest.get()
        const response = await app.request('/api/contacts/'+'2213k12l3k12l3k215454l'+'/addresses/'+addressDetails._id,{
            method:'PUT',
            headers:{
                'Authorization':'test'
            },
            body: JSON.stringify({
                street:"New street",
                city:"New city",
                province:"New country",
                country:"New country",
                postal_code:"1512"
            })
        })

        const body = await response.json()
        expect(response.status).toBe(404)

        await AddressTest.deleteAllAddress()
        await ContactTest.delete()
        await UserTest.delete()
    })

    // Pass 15/01/2026
    it('should rejected if one request is invalid', async () =>{
        await UserTest.create()
        await ContactTest.create()
        await AddressTest.create()
        const contactDetails = await ContactTest.get()
        const addressDetails = await AddressTest.get()
        const apiResponse = await app.request('/api/contacts/'+contactDetails._id+'/addresses/'+addressDetails._id,{
            method:'PUT',
            headers:{
                'Authorization':'test'
            },
            body: JSON.stringify({
                street:"New street",
                city:"New city",
                province:"New country",
                country:"",
                postal_code:"1512"
            })
        })
        expect(apiResponse.status).toBe(400)
        const bodyResponse = await apiResponse.json()
        logger.debug(bodyResponse)

        await AddressTest.deleteAllAddress()
        await ContactTest.delete()
        await UserTest.delete()
    })

    // Pass 15/01/2026
    it('should success if all parameter is valid', async () =>{
        await UserTest.create()
        await ContactTest.create()
        await AddressTest.create()
        const contactDetails = await ContactTest.get()
        const addressDetails = await AddressTest.get()
        const apiResponse = await app.request('/api/contacts/'+contactDetails._id+'/addresses/'+addressDetails._id,{
            method:'PUT',
            headers:{
                'Authorization':'test'
            },
            body: JSON.stringify({
                street:"New street",
                city:"New city",
                province:"New country",
                country:"New country",
                postal_code:"1512"
            })
        })
        const responseBody = await apiResponse.json()
        expect(apiResponse.status).toBe(200)
        expect(responseBody.data.street).toBe('New street')
        expect(responseBody.data.city).toBe('New city')
        expect(responseBody.data.province).toBe('New country')
        expect(responseBody.data.country).toBe('New country')
        expect(responseBody.data.postal_code).toBe('1512')  
        await AddressTest.deleteAllAddress()
        await ContactTest.delete()
        await UserTest.delete()
    })
})

describe ("DELETE /api/contacts/:contactID/addresses/:addressID",async ()=>{
    // Pass 15/01/2026
    it('should failed if address or contact is not found', async ()=>{
        await UserTest.create()
        await ContactTest.create()
        await AddressTest.create()
        const contactDetails = await ContactTest.get()
        const response = await app.request('/api/contacts/'+contactDetails._id+'/addresses/'+'dasdasdas0das0d0asd0as',{
            method: 'DELETE',
            headers:{
                'Authorization':'test'
            }
        })
        expect(response.status).toBe(404)
        logger.debug(`Response status: ${response}`)
        const body = await response.json()
        logger.debug(body)

        await AddressTest.deleteAllAddress()
        await ContactTest.delete()
        await UserTest.delete()
    })

    // Pass 15/01/2026
    it('should success if address is found', async()=>{ 
        await UserTest.create()
        await ContactTest.create()
        await AddressTest.create()
        const contactDetails = await ContactTest.get()
        const addressDetails = await AddressTest.get()
        const response = await app.request('/api/contacts/'+contactDetails._id+'/addresses/'+addressDetails._id,{
            method: 'DELETE',
            headers:{
                'Authorization':'test'
            }
        })
        expect(response.status).toBe(200)
        const body = await response.json()
        logger.debug(body.data)

        await AddressTest.deleteAllAddress()
        await ContactTest.delete()
        await UserTest.delete()
    })
})

describe ('GET /api/contacts/:contactID/addresses',()=>{
    // Pass 15/01/2026
    it('should failed when contact is invalid', async()=>{
        await UserTest.create()
        await ContactTest.create()
        await AddressTest.createManyAddress()
        const response = await app.request('/api/contacts/'+213123123123121+'/addresses',{
            method: 'GET',
            headers:{   
                'Authorization':'test'
            }
        })
        expect (response.status).toBe(404)
        const body = await response.json()
        logger.debug(body)

        await AddressTest.deleteAllAddress()
        await ContactTest.delete()
        await UserTest.delete()
    })

    // Pass 15/01/2026
    it('should sucess when contact id is valid', async()=>{
        await UserTest.create()
        await ContactTest.create()  
        await AddressTest.createManyAddress()
        const contactDetails = await ContactTest.get()
        const response = await app.request('/api/contacts/'+contactDetails._id+'/addresses',{
                            method: 'GET',
                            headers: {
                                'Authorization':'test'
                            }
                        })
        expect(response.status).toBe(200)
        const body = await response.json()
        logger.debug(body)
        await AddressTest.deleteAllAddress()         
        await ContactTest.delete()
        await UserTest.delete()
    })
}) 
