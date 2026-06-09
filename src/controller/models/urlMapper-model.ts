import { UrlMapper }  from "../../models/UrlMappers"
import { ObjectId } from "mongodb"

export type CreateURLRequest = {
    // why need the user id ? We can fetch it from the middleware 
    // user_id: string,
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
    total_clicks: number | undefined
}

export type GetListsURL = {
    _id: ObjectId,
    long_url: string,
    short_url: string,
    description?: string,
    created_at: string,
    is_active: boolean,
    total_clicks: number
}

export interface RecentlyAddedURLResponse {
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

export type dashboardSummary = {
    total_clicks: number,
    total_active_links: number,
    most_clicks_link: string
}

export type totalClicksMetadata = {
    total_clicks: number
    total_active_links: number
}

export type recentlyAddedSummary = {
    _id: ObjectId,
    short_url: string,
    long_url: string,
    total_clicks: number,
    url_status: boolean,
    description: string
}

export type dashboardOverviewHeader = {
    total_clicks: number,
    total_active_links: number,
    most_clicks_link: string,
}

export type dashboardOverviewResponse = {
    total_clicks: number,
    total_active_links: number,
    most_clicks_link: string,
    recently_added_links: recentlyAddedSummary[]
}

// Discriminated Union For active or inactve links 
export type URL_VALIDITY_STATUS = 
    | {success: true; shorten_url: string}
    | {success: false; errorType: "URL IS NOT ACTIVE"}

export function toURLResponse(response: UrlMapper): CreateUrlResponse {
    return {
        user_id: response.user_id,
        _id: response._id,
        long_url: response.long_url,
        short_url: response.short_url,
        description: response.description,
        is_active: response.is_active,
        created_at: response.created_at,
        total_clicks: response.total_clicks
    }
}
export function toGetURLLists(response: GetListsURL): GetListsURL {
    return {
        _id: response._id,
        long_url: response.long_url,
        short_url: response.short_url,
        description: response.description,
        is_active: response.is_active,
        created_at: response.created_at,
        total_clicks: response.total_clicks
    }
}

// Dashboard Overview response
export function toDashboardOverview(responseDashboardSummary: dashboardSummary, recentlyAdded: CreateUrlResponse[]): dashboardOverviewResponse {
    return {
        total_clicks: responseDashboardSummary.total_clicks,
        total_active_links: responseDashboardSummary.total_active_links,
        most_clicks_link: responseDashboardSummary.most_clicks_link,
        recently_added_links: toRecentlyAddedLinks(recentlyAdded)
    }
}

export function toRecentlyAddedLinks(recentlyAddedLinks: CreateUrlResponse[]): recentlyAddedSummary[] {
    // Loop through each array
    return recentlyAddedLinks.map((item) => ({
        _id: item._id,
        short_url: item.short_url,
        long_url: item.long_url,
        total_clicks: item.total_clicks ?? 0,
        url_status: item.is_active,
        description: item.description ?? ''
    }))
}