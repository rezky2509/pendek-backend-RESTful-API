import {z, ZodType } from "zod"


export class UrlMapperValidation{
    static readonly CREATE: ZodType = z.object({
        user: z.string('Cannot be empty').min(1),
        long_url: z.string('The full URL is require').min(1),
        description: z.string().min(1).optional(),
        is_active: z.boolean()
    })

    static readonly UPDATE: ZodType = z.object({
        long_url: z.string('The full URL is require').min(1).optional(),
        description: z.string().min(1).optional(),
        is_active: z.boolean('Url active status is require'),
    })
}