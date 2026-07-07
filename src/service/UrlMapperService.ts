import { HTTPException } from "hono/http-exception";
import { CreateURLRequest, CreateUrlResponse, dashboardOverviewResponse, dashboardOverviewHeader, toDashboardOverview, totalClicksMetadata, toURLResponse, UpdateUrl, GetListsURL, toGetURLLists, URL_VALIDITY_STATUS, recentlyAddedSummary, urlMapperPaginate } from "../controller/models/urlMapper-model";
import { User } from "../models/Users";
import { UrlMapperValidation } from "../validation/UrlMapperValidation";
import { Hono } from "hono";
import URL_MAPPER_MODEL from "../models/UrlMappers";
import {UrlMapper} from '../models/UrlMappers'
import mongoose, { ObjectId, set } from "mongoose";
import {ENV} from '../utils/env'
import { toAddressResponse } from "../controller/models/address-model";


type errorURLRegistration = {
    message: string[] | string
}

export class UrlMapperService{

    // Staging or Production
    // static BASE_URL = ENV.BASE_URL_SHORTEN
    static BASE_URL = ENV.BASE_URL_SHORTEN_DEVELOPMENT


    // REFACTOR
    // The response should be promise
    // The body field user on the body need to be revise. 
    static async create(user: User, request: CreateURLRequest): Promise<CreateUrlResponse>{
        // Check request validation
        const validateRequest = UrlMapperValidation.CREATE.safeParse(request)
        console.log(request)

        // Too complex if return in an array 
        let errorCollector: UrlMapperValidation[] = []
        // let errorCollector: errorURLRegistration = {message: ''}
        if(validateRequest.error){
            console.log(validateRequest)
            // // Collect the field 
            validateRequest.error.issues.forEach((issue)=>{
                // Collecting the error
                errorCollector.push({
                    field: issue.path.toString(),
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
        // Seems not running 
        // When the url is not valid
        console.log("Checking URL validity")
        try {
            // Check if user inserted the complete url 
            if(request.long_url.includes("https://",0)){
                console.log('Checking URL status')
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
            throw new HTTPException(400,{
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
            // sort created at 1 means ascending means from the oldest to newest
            // sort -1 means descending from newest to oldest
        }).select('-user_id').lean({_id: true}).sort({created_at: -1})

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
            // console.log(mapResult)
            return mapResult
        }
        else{
            // Return mapped result for single or zero results
            // loop every lists 
            return result.map((urlList) => toGetURLLists(urlList))
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
        const base_url_short = this.BASE_URL
        // const base_url_short = ENV.BASE_URL_SHORTEN
        console.info(base_url_short)
        // Use hex encoding. 
        // generated 64 characters
        const short_url = base_url_short + hasher.digest("hex").slice(startingSlice,endingSlice)
        return short_url
    }

    // Update Data
    static async updateURL(bodyRequest: UpdateUrl, user: User, urlID: string){
        console.log("Checking Body Request")
        console.log(bodyRequest)
        // Body check
        const validation = UrlMapperValidation.UPDATE.safeParse(bodyRequest)
        console.log(validation.success)
        let errorCollector: UrlMapperValidation [] = []
        if(!validation.success){
            console.log(validation.error.message)
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

        console.log('Checking url id')
        // Check the url id 
        const idValidation = await mongoose.Types.ObjectId.isValid(urlID)
        if(!idValidation){
            console.error('URL id invalid')
            throw new HTTPException(400,{
                cause: "The url ID is invalid"
            })
        }

        console.log('Body Okay. Updating to Document')
        const result = await URL_MAPPER_MODEL.findByIdAndUpdate(
            {_id:urlID},
            {...bodyRequest},
            // This option return the update document
            {new: true}
        ).exec()
        return result
    }

    static async paginateSearch(page:number, user: User): Promise<urlMapperPaginate>{
    // * PAGINATION LOGIC EXPLANATION
    // * 
    // * Formula: skip((page - 1) * limit)
    // * 
    // * Why (page - 1)?
    // * - Users think in 1-indexed pages: Page 1, Page 2, Page 3, etc.
    // * - MongoDB skip() works with 0-indexed offsets: skip(0), skip(10), skip(20), etc.
    // * - We subtract 1 to convert user's page number to database's skip offset
    // * 
    // * Example with limit = 10 and 30 total documents:
    // * 
    // * Page 1: (1-1) * 10 = 0   → skip(0)  → Returns Doc 1-10 ✅
    // * Page 2: (2-1) * 10 = 10  → skip(10) → Returns Doc 11-20 ✅
    // * Page 3: (3-1) * 10 = 20  → skip(20) → Returns Doc 21-30 ✅
    // * Page 4: (4-1) * 10 = 30  → skip(30) → Returns [] (no more data) ✅
    // * 
    // * Without (page - 1), page 1 would return Doc 11-20 instead of Doc 1-10! ❌

    // so, skip currentPage-1 is 
    // If we want to go to the current page, let say page 1, 
    // we (1-1)*10 is zero 
    // Skip(0) means that, it return only from the index of row document starting from zero 
    // than limit is limit the document result to 10. 
    // So what does skip means is the starting value of the search. 

    // Set by default, every response should be 10 List of URL
    const result = await URL_MAPPER_MODEL.find({user_id: user._id}).skip((page-1)*10).limit(10).sort({created_at: -1});
    const totalDocument = await URL_MAPPER_MODEL.countDocuments({user_id: user._id});

        return {
            // Need to destructure as an array return 
            data: result.map((urlData)=>toURLResponse(urlData)),
            page: page,
            size: totalDocument,
            // Logic to calculate total pages 
            total_pages: Math.ceil(totalDocument/10)
        }
    }


    // REFACTOR
    // URL Re-direct
    static async reDirect(shortenURL: string): Promise<URL_VALIDITY_STATUS> {
        // Need to change 
        const completeShortURL = UrlMapperService.BASE_URL + shortenURL
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

    static async deleteURL(user: User, urlID: string){
        const result = await URL_MAPPER_MODEL.deleteOne({_id: urlID, user_id: user._id}).lean().exec()
        if(result.acknowledged === true){
            return true
        }else {
            return false
        }
    }
}