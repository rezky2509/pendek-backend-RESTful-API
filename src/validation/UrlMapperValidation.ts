import {z, ZodType } from "zod"


export class UrlMapperValidation{
    static readonly CREATE: ZodType = z.object({
        long_url: z.url('Valid URL is require').min(1),
        description: z.string().min(1).optional(),
        is_active: z.boolean('Please enter the URL status in boolean')
    })

    static readonly UPDATE: ZodType = z.object({
        long_url: z.url('The full URL is require').min(1),
        description: z.string().min(1).optional(),
        is_active: z.boolean('Url active status is require'),
    })
}