import { Hono } from "hono";
import { UrlMapperService } from "../service/UrlMapperService";

export const reDirectURLController = new Hono()

    reDirectURLController.get(':shortURL',async(c)=>{
        // fetch the url
        console.log('Reading user shorten url')
        const urlParam = await c.req.param()
        // console.log(urlParam.shortURL)
        const redirectURL = await UrlMapperService.reDirect(urlParam.shortURL)
        if(redirectURL.includes('https://',0)){
            return c.redirect(redirectURL,301)
        }else{
            return c.redirect(`https://${redirectURL}`,301)
        }
    })