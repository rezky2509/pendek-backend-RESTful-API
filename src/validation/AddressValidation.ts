import {z, ZodType } from "zod";
// z is the object that is receive as parameter 
export class AddressValidation {
    static readonly CREATE : ZodType = z.object({
        contact: z.string().min(1),
        street: z.string().min(1).max(255).optional(),
        city: z.string().min(1).max(255).optional(),
        province: z.string().min(1).max(255).optional(),
        // if method optional not being called, it is required. 
        country: z.string().min(1,"Country is required").max(100),
        postal_code: z.string().min(1,"Post code is required").max(10)
    })

    static readonly UPDATE : ZodType = z.object({
        _id: z.string().min(1),
        contact: z.string().min(1),
        street: z.string().min(1).max(255).optional(),
        city: z.string().min(1).max(255).optional(),
        province: z.string().min(1).max(255).optional(),
        // if method optional not being called, it is required. 
        country: z.string().min(1,"Country is required").max(100),
        postal_code: z.string().min(1,"Post code is required").max(10)
    })
    
    static readonly GET: ZodType = z.object({
        contact_id: z.string().min(1),
        address_id: z.string().min(1)
    })
}