import {expect, describe, it, afterEach, beforeEach } from 'bun:test'
// Run the creating and the user test 
import { UrlMapperTest, UserTest } from './test-util'

import { logger } from '../application/logging'

// Run the server 
import app from '../index'
import URL_MAPPER_MODEL from '../models/UrlMappers'


describe('POST /api/url_mapper', ()=>{

    beforeEach(async()=>{
        await UserTest.create()
    })

    afterEach(async()=>{
        await UserTest.delete()
        // await UrlMapperTest.deletOne()
        // await UrlMapperTest.deleteAllURL()
    })

    // Empty Body
    // PASS 18 JUNE 2026
    it('should reject if request is null', async()=>{
        const result = await app.request(`/api/url_mapper`,{
            method: 'POST',
            headers: {
                'Authorization':'test'
            }
        })
        const resultBody = await result.json()
        expect(result.status).toBe(400)
        logger.debug(resultBody)
    })

    // One of the field is empty 
    // PASS 18 JUNE 2026
    it('should reject if one field is null', async()=>{
        const result = await app.request('/api/url_mapper',{
            method: 'POST',
            headers: {
                'Authorization':'test'
            },
            body: JSON.stringify({
                "long_url": "www.google.com",
                "description": "here is the description"
            })
        })

        expect(result.status).toBe(400);
    })


    // PASS 18 JUNE 2026
    it('should reject if long url is not accesible', async()=>{
        const result = await app.request('/api/url_mapper',{
            method: 'POST',
            headers: {
                'Authorization':'test'
            },
            body: JSON.stringify({
                "long_url": "www.goosasdasdasdasdgle.com",
                "description": "here is the description",
                "is_active": true
            })
        })

        expect(result.status).toBe(400)
    })


    // PASS 18 JUNE 2026
    it('should success if the body request is valid',async()=>{
        // Not deleting 
        const result = await app.request('/api/url_mapper',{
            method: 'POST',
            headers: {
                'Authorization':'test'
            },
            body: JSON.stringify({
                "long_url": "https://www.google.com",
                "description": "here is the description",
                "is_active": true
            })
        })
        expect(result.status).toBe(201)      
        await UrlMapperTest.deletOne()  
    })
})

describe('GET /api/url_mapper/lists', ()=>{

    beforeEach(async()=>{
        await UserTest.create()
        await UrlMapperTest.addURL()
    })

    afterEach(async()=>{
        await UrlMapperTest.deletOne()
        await UserTest.delete()
    })
    // PASS 18 JUNE 2026
    it('should success if url list is exists', async()=>{
        const result = await app.request('/api/url_mapper/lists',{
            method: "GET",
            headers:{
                'Authorization':'test'
            }
        })
        logger.debug(result)
        expect(result.status).toBe(200)
    })

    // PASS 18 June 2026
    it('should return an array of object for multiple url', async()=>{
        await UrlMapperTest.createMany(2)
        const result = await app.request('/api/url_mapper/lists',{
            method: "GET",
            headers:{
                'Authorization':'test'
            }
        })

        const body = await result.json()
        logger.debug(body.data)
        expect(body.data.length).toBe(2)
        await UrlMapperTest.deleteAllURL()
    })
})


describe('PATCH /api/url_mapper/lists', ()=>{
    beforeEach(async()=>{
        await UserTest.create()
        await UrlMapperTest.addURL()
    })

    afterEach(async()=>{
        await UrlMapperTest.deletOne()
        await UserTest.delete()
    })

    it('should success when body is valid', async()=>{
        const url_id = await UrlMapperTest.getOneUrlId

        logger.debug(url_id)
        expect(url_id).toBeDefined()
    })
})