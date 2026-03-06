import {z, ZodType } from 'zod'

export class UserValidation {
    // Create static method of REGISTER type zodType
    static readonly REGISTER:ZodType = z.object({
        username: z.string().min(3,{message:'Username is required and minimum of 3 character'}).max(100),
        password: z.string().min(3,{message:'Password is required and minimum of 3 character'}).max(100),
        name: z.string().min(3,{message:'Name is required and minimum of 3 character'}).max(100),
    })

    // Check the request body
    static readonly LOGIN:ZodType = z.object({
        username: z.string().min(3).max(100),
        password: z.string().min(3).max(100)
    })

    // Check token 
    // token must be length more than 1
    static readonly TOKEN: ZodType = z.string().min(1)


    // both name or password can be empty
    // but it's either one
    static readonly UPDATE: ZodType = z.object({
        name: z.string().min(3).max(100).optional(),
        password: z.string().min(3).max(100).optional()
    })
}