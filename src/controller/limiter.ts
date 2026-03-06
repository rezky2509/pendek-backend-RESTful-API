import { rateLimiter } from "hono-rate-limiter"

const limiter = rateLimiter({
  windowMs: 60 * 1000, //Implement rate limit for one minute
  limit: 10, //Limit 10 API under 1 minutes
  standardHeaders: 'draft-6', //standards format for rate limitter. 
  keyGenerator: (c)=>c.req.header('x-forwarded-for') || c.req.header('remote-addr') || 'anonymous',
  handler: (c)=>{
    console.log('User too many request.')
    return c.text('Too many request. Try again later',429)
  }
})

export default limiter