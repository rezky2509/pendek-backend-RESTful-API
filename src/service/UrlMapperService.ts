import { HTTPException } from "hono/http-exception";
import { CreateURLRequest, CreateUrlResponse, toURLResponse, UpdateUrl } from "../controller/models/urlMapper-model";
import { User } from "../models/Users";
import { UrlMapperValidation } from "../validation/UrlMapperValidation";
import { Hono } from "hono";
import URL_MAPPER_MODEL from "../models/UrlMappers";
import {UrlMapper} from '../models/UrlMappers'
import mongoose, { ObjectId, set } from "mongoose";
import {ENV} from '../utils/env'


const checkUrl = new Hono

export class UrlMapperService{
    // The response should be promise
    static async create(user: User, request: CreateURLRequest): Promise<CreateUrlResponse>{
        // Check request validation
        const validateRequest = UrlMapperValidation.CREATE.safeParse(request)
        console.log(request)

        let errorCollector: UrlMapperValidation[] = []
        if(validateRequest.error){
            // Collect the field 
            validateRequest.error.issues.forEach((issue)=>{
                // Collecting the error
                errorCollector.push({
                    error: issue.path,
                    message: issue.message
                })
            })
            throw new HTTPException(400,{
                cause: errorCollector
            })
        }

        // Check the user id or the user whether it is an object id 
        // if(!mongoose.Types.ObjectId.isValid(request.user_id)){
        //     throw new HTTPException(400,{
        //         cause:'Invalid user'
        //     })
        // }

        // Feature for filtering the url (Coming soon)



        // Check the url if it is complete or accessible or not 
        console.log("Checking URL validity")
        try {
            // Check if user inserted the complete url 
            if(request.long_url.includes("https://",0)){
                const checkUrl = await fetch(request.long_url)
                if(checkUrl.ok){
                    console.log('URL reached')
                }
            }else{
                const checkURL = await fetch("https://"+request.long_url)
                if(checkURL.ok){
                    console.log('URL reached')
                }
            }
        } catch (error) {
            throw new HTTPException(404,{
                cause: "The url provided is invalid or not found"
            })
        }

        console.log("Hashing the url")
        let short_url = this.generateShortURL(request.long_url)
    
        // Check the shorten url isExist
        console.log("Checking is URL exist")
        const checkShortenURL = await URL_MAPPER_MODEL.find().where('short_url',short_url).exec()
        let dupURL: string = ''
        checkShortenURL.forEach((checkShortenURL)=>{
            console.log(checkShortenURL.short_url)
            dupURL = checkShortenURL.short_url
        })
        if(short_url==dupURL){
            console.log("Duped URl")
            while(short_url==dupURL){
                short_url = this.generateShortURL(request.long_url,1,5)
                console.log("New Short URL")
                console.log(short_url)
                if(short_url!=dupURL){
                    break
                }
            }
        }

        // Insertion to Database
        console.log("Inserting to Database")
        const urlMapper = await URL_MAPPER_MODEL.create(
            {
                ...request,
                user_id: user._id,
                total_click: 0,
                created_at: new Date(),
                short_url: short_url
            }
        )

        return toURLResponse(urlMapper)

    }

    static async getListofURL(user: User):Promise<CreateUrlResponse[] | CreateUrlResponse>{
        const result = await URL_MAPPER_MODEL.find({
            user_id: user._id
        })
        if(result.length>1){
            console.log('Result more than 1')
            const mapResult: CreateUrlResponse[] = []
            result.map((result: UrlMapper)=>{
                mapResult.push(toURLResponse(result))
            })
            console.log(mapResult)
            return mapResult
        }
        else{
            // Using Flat map to filter possible empty array 
            // flatMap automatically flattens those empty arrays, 
            // leaving you with a clean, single-level array of only valid objects.
            // https://www.youtube.com/watch?v=ERZW8qh3igo
            return result.flatMap((urlList)=>{
                const returnResponse = toURLResponse(urlList)
                // The square bracket letting typescript know that return this single object only. 
                // Since we had filter if the lenght of the array is only one
                return returnResponse ? [returnResponse] : []
            })
        }

    }

    static generateShortURL(long_url: string, startingSlice: number = 5, endingSlice: number = 10) {
        // Shorten the url
        // Implement base62 encoding 
        const hasher = new Bun.CryptoHasher("sha256");
        // Encode it
        hasher.update(long_url)
        // Return the hash as string. use digest using base64 encoding
        // const short_url = (hasher.digest("base64")).slice(Math.random(),Math.random())
        console.log('Base_URl')
        const base_url_short = ENV.BASE_URL_SHORTEN_DEVELOPMENT
        console.log(base_url_short)
        const short_url = base_url_short + hasher.digest("base64").slice(startingSlice,endingSlice)
        return short_url
    }

    // Update Data
    static async updateURL(bodyRequest: UpdateUrl, user: User, urlID: string):Promise<CreateUrlResponse>{
        console.log("Checking body")
        // Body check
        const validation = UrlMapperValidation.UPDATE.safeParse(bodyRequest)
        let errorCollector: UrlMapperValidation [] = []
        if(!validation.success){
            console.log('Body is invalid')
            validation.error.issues.forEach((error)=>{
                errorCollector.push({
                    path: error.path,
                    message: error.message
                })
            })
            throw new HTTPException(400,{
                cause: errorCollector
            })
        }

        // Check the url id 
        const idValidation = await mongoose.Types.ObjectId.isValid(urlID)
        if(!idValidation){
            throw new HTTPException(400,{
                cause: "The url ID is invalid"
            })
        }
        else{
            
            // type mismatch
            const responseDb = await URL_MAPPER_MODEL.updateOne(urlID,validation).exec()
            return toURLResponse(responseDb)
        }


    }

    // URL Re-direct
    static async reDirect(shortenURL: string){
        const completeShortURL = "http://localhost:3050/" + shortenURL
        const fetchLongURL = await URL_MAPPER_MODEL.find().where('short_url',completeShortURL).exec()
        let returnURL: string = ''
        let previousCount: number = 0;
        console.log(fetchLongURL)
        fetchLongURL.forEach((fetchLongURL:UrlMapper)=>{
            returnURL = fetchLongURL.long_url
            // total clicks is not undefined in the database.
            // why error here
            previousCount = fetchLongURL.total_click
        })
        console.log(returnURL.slice(8))
        console.log(previousCount)
        // Update total Clicks
        await URL_MAPPER_MODEL.updateOne({
            total_click: previousCount+1
        }).where('short_url',completeShortURL)
        return returnURL
    }
}