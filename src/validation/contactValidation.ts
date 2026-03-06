import { z, ZodType } from "zod";

export class ContactValidation {
    // Validate create request
    static readonly CREATE: ZodType = z.object({
        firstname: z.string().min(1).max(50),
        lastname: z.string().min(1).max(50).optional(),
        email: z.email().optional(),
        phone: z.string().min(1).max(20).optional()
    })

    // get the object id of the id contact 
    // static readonly GET: ZodType = z.number().positive()

    static readonly UPDATE: ZodType = z.object({
        firstname: z.string().min(1).max(50),
        lastname: z.string().min(1).max(50).optional(),
        email: z.email().optional(),
        phone: z.string().min(1).max(20).optional()
    })


    static readonly SEARCH: ZodType = z.object({
        name: z.string().min(1).optional(),
        email: z.email().optional(),
        phone: z.string().optional(),
        page: z.number().min(1).positive(),
        size: z.number().min(1).max(100).positive()
    })

    
}