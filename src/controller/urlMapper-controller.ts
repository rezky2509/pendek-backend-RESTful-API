import { Hono } from "hono"
import { ApplicationVariables } from "./models/app-models" 
import { User } from '../models/Users'
import { CreateURLRequest, UpdateUrl } from "./models/urlMapper-model"
import { UrlMapperService } from "../service/UrlMapperService"
import { HTTPException } from "hono/http-exception"
import { error } from "winston"

export const urlMapperController = new Hono<{Variables: ApplicationVariables}>

urlMapperController.post('/url_mapper', async(c)=>{
    // Middleware
    const user = c.get('user') as User
    // Fetch the body request
    const body = await c.req.json() as CreateURLRequest

    const response = await UrlMapperService.create(user,body)

    return c.json({
        data: response
    })
})

urlMapperController.get('/url_mapper/lists', async(c)=>{
    const user = c.get('user') as User 
    const responseDb = await UrlMapperService.getListofURL(user)
    return c.json({
        data: responseDb
    })
})

urlMapperController.patch('/url_mapper/update/:url_id', async(c)=>{
    console.log('UPDATING')
    const user = c.get('user') as User
    // if the body is not exist or undefined 
    // let body;
    // try{
    //     body = await c.req.json() 
    //     const databaseResponse = await UrlMapperService.updateURL(body, user)
    //     return c.json({
    //         data: databaseResponse
    //     })
    // }catch(error){
    //     throw new HTTPException(404,{
    //         cause: 'Bad Request'
    //     })
    // }
    // if(!body){
    //     throw new HTTPException(400,{
    //         cause: 'Bad Request'
    //     })
    // }else{
    //     const databaseResponse = await UrlMapperService.updateURL(body, user)
    //     return c.json({
    //         data: databaseResponse
    //     })
    // }
    const body = await c.req.json()
    const params =  await c.req.param('url_id')
    const databaseResponse = await UrlMapperService.updateURL(body,user,params)
    return c.json({
        data: databaseResponse
    })

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