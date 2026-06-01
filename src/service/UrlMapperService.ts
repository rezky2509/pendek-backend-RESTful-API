import { HTTPException } from "hono/http-exception";
import { CreateURLRequest, CreateUrlResponse, dashboardOverviewResponse, dashboardOverviewHeader, toDashboardOverview, totalClicksMetadata, toURLResponse, UpdateUrl, GetListsURL, toGetURLLists, URL_VALIDITY_STATUS } from "../controller/models/urlMapper-model";
import { User } from "../models/Users";
import { UrlMapperValidation } from "../validation/UrlMapperValidation";
import { Hono } from "hono";
import URL_MAPPER_MODEL from "../models/UrlMappers";
import {UrlMapper} from '../models/UrlMappers'
import mongoose, { ObjectId, set } from "mongoose";
import {ENV} from '../utils/env'
import { toAddressResponse } from "../controller/models/address-model";


export class UrlMapperService{

    // REFACTOR
    // The response should be promise
    // The body field user on the body need to be revise. 
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

        // Feature for filtering the url (Coming soon)
        // Implement Google Vision API


        // This one ok
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
                // Randomly select 0-63 number 
                // Calculate a random start index between 0 and 59 inclusive
                // .floor round up the lowest number
                const startingNumber = Math.floor(Math.random() * 60); 
                // The end index is always exactly 5 steps ahead
                const endingNuumber = startingNumber + 5;

                short_url = this.generateShortURL(request.long_url,startingNumber,endingNuumber)
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
                total_clicks: 0,
                created_at: new Date(),
                short_url: short_url
            }
        )

        return toURLResponse(urlMapper)

    }

    // static async getListofURL(user: User):Promise<CreateUrlResponse[] | CreateUrlResponse>{
    static async getListofURL(user: User):Promise<GetListsURL[] | GetListsURL>{
        const result = await URL_MAPPER_MODEL.find({
            user_id: user._id
            // using the select ('') field name and minus sign to exclude the field 
        }).select('-user_id').lean({_id: true}).sort('created_at')

        // using the select to filter only necessary field, type space
        // const result = await URL_MAPPER_MODEL.find().select('_id long_url')
        if(result.length>1){
            console.log('Result more than 1')
            // const mapResult: CreateUrlResponse[] = []
            // result.map((result: UrlMapper)=>{
            //     mapResult.push(toURLResponse(result))
            // })
            const mapResult: GetListsURL[] = []
            // result.map((result: UrlMapper)=>{
            //     mapResult.push(toURLResponse(result))
            // })
            result.map((result: GetListsURL)=>{
                mapResult.push(toGetURLLists(result))
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


    // THis is not stagging and production ready. The params should be different 
    // REFACTOR
    static generateShortURL(long_url: string, startingSlice: number = 5, endingSlice: number = 10) {
        // Shorten the url
        // Implement base62 encoding 
        const hasher = new Bun.CryptoHasher("sha256");


        // Experimenting starting and ending random whole number generator
        // const starting = Math.random()*(64-1) + 1
        // const ending = Math.random()*(64-1) + 1
        // console.log(Math.round(starting),Math.round(ending))


        // Encode it
        hasher.update(long_url)
        // Return the hash as string. use digest using base64 encoding
        // const short_url = (hasher.digest("base64")).slice(Math.random(),Math.random())
        console.log('Base_URl')
        const base_url_short = ENV.BASE_URL_SHORTEN_DEVELOPMENT
        // const base_url_short = ENV.BASE_URL_SHORTEN
        console.info(base_url_short)
        // Use hex encoding. 
        // generated 64 characters
        const short_url = base_url_short + hasher.digest("hex").slice(startingSlice,endingSlice)
        return short_url
    }

    // Update Data
    // static async updateURL(bodyRequest: UpdateUrl, user: User, urlID: string):Promise<CreateUrlResponse>{
    //     console.log("Checking body")
    //     // Body check
    //     const validation = UrlMapperValidation.UPDATE.safeParse(bodyRequest)
    //     let errorCollector: UrlMapperValidation [] = []
    //     if(!validation.success){
    //         console.log('Body is invalid')
    //         validation.error.issues.forEach((error)=>{
    //             errorCollector.push({
    //                 path: error.path,
    //                 message: error.message
    //             })
    //         })
    //         throw new HTTPException(400,{
    //             cause: errorCollector
    //         })
    //     }

    //     // Check the url id 
    //     const idValidation = await mongoose.Types.ObjectId.isValid(urlID)
    //     if(!idValidation){
    //         throw new HTTPException(400,{
    //             cause: "The url ID is invalid"
    //         })
    //     }
    //     else{
            
    //         // type mismatch
    //         const responseDb = await URL_MAPPER_MODEL.updateOne(urlID,validation).exec()
    //         return toURLResponse(responseDb)
    //     }


    // }


    // REFACTOR
    // URL Re-direct
    static async reDirect(shortenURL: string): Promise<URL_VALIDITY_STATUS> {
        // Need to change 
        const completeShortURL = "http://localhost:3050/" + shortenURL
        const fetchLongURL = await URL_MAPPER_MODEL.find().where('short_url',completeShortURL).lean()
        let returnURL: string = ''
        let previousCount: number = 0;
        let isURLActive: boolean = true
        // console.log(`The long url ${fetchLongURL}`)


        // Checking Link Active Status 
        fetchLongURL.forEach((fetchLongURL:UrlMapper)=>{
            returnURL = fetchLongURL.long_url
            // total clicks is not undefined in the database.
            // why error here
            previousCount = fetchLongURL.total_clicks
            isURLActive = fetchLongURL.is_active
        })
        console.log(returnURL.slice(8))
        console.log(previousCount)

        console.log("Check URL Active Status")
        if(isURLActive){
            // Update total Clicks
                await URL_MAPPER_MODEL.updateOne({
                    total_clicks: previousCount+1
                }).where('short_url',completeShortURL)
                // publish and push to let there is someone clicking the link 
            return {success: true, shorten_url: returnURL}
        }
        else {
            return {success: false, errorType: "URL IS NOT ACTIVE"}
        }


    }

    // Get overview data
    // For sake of quick development, use countDocuments
    // For improvement, use indexing estimatedDocumentCount
    static async dashboardOverview(user: User){
        console.log(`User is ${user.username} and the id is ${user._id}`)
        // Get total number of shorten url 
        // const getTotalshortenUrl = await URL_MAPPER_MODEL.countDocuments({user_id: user._id})

        // Get total clicks
        // aggregate returns an array of results, so destructure the first row
        // define the aggrate with <>
        const [getTotalClicks] = await URL_MAPPER_MODEL.aggregate<totalClicksMetadata>(
            [
                // Filter by the user id
                { $match: { user_id: user._id, is_active: true } },
                // Summarize the counts
                { $group: {
                    _id: null,
                    total_clicks: { $sum: '$total_clicks' },
                    total_active_links: { $count: {} },
                } },
                { $project: {
                    _id: 0
                } }
            ]
        ).exec()

        // For sorting, use descending order. Exclude _id so only short_url is returned.
        const getTopPerformerLinks = await URL_MAPPER_MODEL.findOne({ user_id: user._id, is_active: true })
            // adding 0 means dont select _id field
            .select({ short_url: 1, _id: 0 })
            // - minus sign means sort descending order. No minus sign means sort ascending
            .sort({ total_click: -1 })
            // lean converting mongoose document to js object so that is accessible
            .lean<{ short_url: string }>()
            .exec()
        
        // Receive as an array
        const getRecentlyAddedLinks = await URL_MAPPER_MODEL.find({
            user_id: user._id
        }).sort({
            // 1 means sort by ascending, negative means sort by descendign
            created_at: 1
        }).limit(5).exec()
        // console.log('Recently ADded links')
        // console.log(getRecentlyAddedLinks)

        const groupDashboard: dashboardOverviewHeader = {
            // There is a possibility that the field is 0, then replace it with zero number 
            // ?? this sign means if it is zero or undefined
                total_clicks: getTotalClicks?.total_clicks ?? 0,
                total_active_links: getTotalClicks?.total_active_links ?? 0,
                most_clicks_link: getTopPerformerLinks?.short_url.replace('http://localhost:3050','') ?? 'N/A',
                // recently_added_links:getRecentlyAddedLinks
        }
        // console.info('Using Function')
        console.log(toDashboardOverview(groupDashboard,getRecentlyAddedLinks))


        return toDashboardOverview(groupDashboard,getRecentlyAddedLinks)
    }
}