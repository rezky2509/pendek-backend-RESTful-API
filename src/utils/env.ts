import z from 'zod'
// When creating a new database inside cluster
// on the URI it must have unique database name     

const environmentSchema = z.object({
    ATLAS_URI: z.string(),
    MONGODB_COMPASS_URI: z.string(),
    PORT_NUMBER: z.string(),
    BASE_URL_SHORTEN_DEVELOPMENT: z.string(),
    BASE_URL_SHORTEN: z.string()
})

export const ENV = environmentSchema.parse(process.env)