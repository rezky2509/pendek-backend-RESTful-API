import { UrlMapper }  from "../../models/UrlMappers"
import { ObjectId } from "mongodb"

export type CreateURLRequest = {
    user_id: string,
    long_url: string,
    description: string,
    is_active: boolean
}

export type InvalidURLRequest = {
    error: string, 
    message: string
}

export type CreateUrlResponse = {
    user_id: ObjectId,
    _id: ObjectId,
    long_url: string,
    short_url: string,
    description?: string,
    created_at: string,
    is_active: boolean,
    total_click: number | undefined
}

export type UpdateUrl = {
    long_url: string,
    description?: string,
    is_active: boolean
}


export function toURLResponse(response: UrlMapper): CreateUrlResponse {
    return {
        user_id: response.user_id,
        _id: response._id,
        long_url: response.long_url,
        short_url: response.short_url,
        description: response.description,
        is_active: response.is_active,
        created_at: response.created_at,
        total_click: response.total_click
    }
}