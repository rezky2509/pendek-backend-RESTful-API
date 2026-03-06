// The script to run is 
// bun run dev
// Hono is kinda similar to express with node.js
import { Hono } from 'hono'
// import { poweredBy } from 'hono/powered-by'
// Logging for any request 
// import { logger } from 'hono/logger'
// DbConnect 
import dbConnect from "./database/dbConnection"

// To log every activity
import { logger } from 'hono/logger'


// just for fun 
// import figlet = require('figlet')


import { userController }  from './controller/user-controller'
import { HTTPException } from 'hono/http-exception'
import { ZodError } from 'zod'
import { contactController } from './controller/contact-controller'
import { addressController } from './controller/address-controller'
import { urlMapperController } from './controller/urlMapper-controller'
import { reDirectURLController } from './controller/reDirect-controller'

const app = new Hono()
// Middleware
// app.use(poweredBy())

// const textCLI = figlet.textSync("Main Server")
// console.log(textCLI)
try {
  dbConnect();
} catch (error) {
  console.log(`${error}`)
}


app.use(logger())

// register the controller to the service 
// this enable the endpoint to be access to the file service
app.route('api/',userController)
// URL_Mapper Controller 
app.route('api/',urlMapperController)
// Re-direct controller
app.route('/',reDirectURLController)

app.use(logger())

// This endpoint definition. Should only be implement on controller. 
// app.get('/',(c)=>  c.json('Hello'))

// Error Handler
app.onError(async(error,c)=>{
    if(error instanceof HTTPException){
      c.status(error.status)
      // add the errors.cause to accumalate the errors
      // using below, the custom message not thrown from service. 
      // return c.json({errors: error.cause})
      // using below, the custom message thrown from service. 
      return c.json({errors: error.cause})
    }
    else if(error instanceof ZodError){
      c.status(400)
      console.log("this code run")
      return c.json({errors: error.cause})
    }
    else {
      c.status(500)
      // if the error is 11000 that means duplicate found
      return c.json({errors:error.message})
    }
})

// accessing the route
// export default app 
export default {
  port: 3050,
  fetch: app.fetch
}
// Default Port number is 3000
