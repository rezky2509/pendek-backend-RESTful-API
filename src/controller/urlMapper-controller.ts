import { Hono } from "hono"
import { ApplicationVariables } from "./models/app-models" 
import { User } from '../models/Users'
import { CreateURLRequest, UpdateUrl } from "./models/urlMapper-model"
import { UrlMapperService } from "../service/UrlMapperService"
import { HTTPException } from "hono/http-exception"
import { authMidleware } from "../middleware/auth-middleware"


export const urlMapperController = new Hono<{Variables: ApplicationVariables}>
// Need to use auth
// These enable to fetch the current user
urlMapperController.use(authMidleware)

urlMapperController.post('/url_mapper', async(c)=>{
    // Middleware
    const user = c.get('user') as User
    const request = await c.req.json() as CreateURLRequest
    console.log(request)

    // Check Body. If Body is null, return as 400 Bad Request
    // Fetch the body request
    try{
        const body = await c.req.json() as CreateURLRequest
        const response = await UrlMapperService.create(user,body)
        return c.json({
            data: response
        },201)
    }catch(error){
        throw new HTTPException(400,{
            cause: 'Invalid or Null Body'
        })
    }
})


// This list out all the url. No filtering 
urlMapperController.get('/url_mapper/lists', async(c)=>{
    const user = c.get('user') as User 
    console.log('User Details')
    console.log(user)
    const responseDb = await UrlMapperService.getListofURL(user)
    return c.json({
        data: responseDb
    })
})

urlMapperController.patch('/url_mapper/:url_id', async(c)=>{
    console.log('UPDATING')
    const user = c.get('user') as User
    const body = await c.req.json()
    const params =  await c.req.param('url_id')
    console.info(body)

    const databaseResponse = await UrlMapperService.updateURL(body,user,params)
    return c.json({
        data: databaseResponse
    })

})

urlMapperController.get("/url_mapper/dashboard/overview", async(c)=>{
    // Get the middleware 
    const user = await c.get('user') as User
    const resultDb = await UrlMapperService.dashboardOverview(user)

    return c.json({
        data: resultDb
    })
})

urlMapperController.delete('/url_mapper/:url_id',async(c)=>{
    const url_id = await c.req.param('url_id')
    const user = c.get('user') as User
    // console.log(`User ID ${url_id}`)

    const result = await UrlMapperService.deleteURL(user,url_id)

    // Return as new response 
    // https://hono.dev/docs/api/context
    // since successful delete return empty body
    // return empty context
    if(result === true){
        return new Response(null, {status: 204})
    }else{
        return c.json({
            data: {
                'errors':'Internal server error. Please Try again later'
            }
        },500)
    }

})

// Paginate Endpoints
urlMapperController.get('/url_mapper',async(c)=>{
    // By default should be 1
    // Using the .query it will fetch the query from url
    // but on the endpoint definition do not add trail slash
    // Example, localhost:3000/api/url_mapper?page=213213
    // the c.req.query('page') this will fetch the query params
    const page_number_params = await c.req.query('page')

    if(!page_number_params){
        throw new HTTPException(400,{
            cause: "Invalid Parameter Query"
        })
    }
    console.log(`Query ${page_number_params}`)

    // console.info('Page Params')
    // console.info(page_number_params)
    // // Parse to Int first 
    const pageNumber:number = parseInt(page_number_params)
    console.log(pageNumber)

    // Use the js IsNotANumber isNaN
    // To check is it a number
    if(!Number(pageNumber)){
        throw new HTTPException(400,{
            cause: "Invalid Parameter Query. Query only accept number"
        })
    }

    // Convert to is to number 
    // Fetch the current User
    const user = c.get('user') as User

    const result = await UrlMapperService.paginateSearch(pageNumber,user)

    // Directly Return instead wrapping it to object that uses {}
    // Because Hono when using {} you are expecting to return as objec {}
    // Since the result return already as an object, you just need to return directly as an object
    // So that it does not nested as object of an array
    //  To return an array of objects directly instead,
    // instead of wrapping the result in a data object, you want to return the array directly 
    return c.json(result, 200)
    // https://hono.dev/docs/api/context


})

// urlMapperController.get(':shortURL',async(c)=>{
//     // fetch the url
//     // console.log('Reading user shorten url')
//     const urlParam = await c.req.param()
//     console.log(urlParam)
//     const redirectURL = await UrlMapperService.reDirect(urlParam.shortURL)
//     console.log('The original url')
//     console.log(redirectURL)

//     return c.redirect(redirectURL)
//     // return c.json({
//     //     data:redirectURL
//     // })
// })