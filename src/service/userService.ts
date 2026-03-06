import { LoginUserRequest, RegisterUserRequest, UpdateUserRequest, UserResponse } from "../controller/models/user-models";
import { UserValidation } from "../validation/userValidation";
import UserModel, { toUserResponse, User } from '../models/Users'
import {HTTPException} from 'hono/http-exception'
// import { Mongoose } from "mongoose";

// Service file is where the data being store and validate to the database

type DeleteResponse = {
    successStatus: boolean, 
    message: string
}

type ErrorResponse = {
    name?: string,
    password?: string,
    username?: string
}

export class userService{
    
    // "There is a static method named register on this class. This method is asynchronous, 
    // meaning it will perform an operation that might take time and will return a Promise. 
    // When you call it, you must provide a request object that matches the RegisterUserRequest type.
    // When the asynchronous operation completes successfully, 
    // the Promise that was returned will resolve with an object that matches the UserResponse type."

    // Method where to register user.
    // take the request type registeruserrequest model 
    // Return as Promise with Type UserResponse(Generic Type)
    static async register(request: RegisterUserRequest): Promise<any> {
        // Validate Request
        // parse aka interpret or break into smaller chunks
        const validateRequest = UserValidation.REGISTER.safeParse(request)
        // Return bad Request if the form does not meet the validation checking
        // console.log(validateRequest.error?.issues)
        if(validateRequest.success === false){
            // Create a type first 
            let errorAccumulator: ErrorResponse = {}
            validateRequest.error.issues.forEach((issue)=>{
                // check the three key 
                // The .includes() method is a simple way to 
                // check if an array contains a specific value.
                // the include check if the string contain the specific string 
                // expect as the value and return as boolean
                if(issue.path.includes('name')){
                    errorAccumulator.name = issue.message
                }                
                if(issue.path.includes('username')){
                    errorAccumulator.username = issue.message
                }
                if(issue.path.includes('password')){
                    errorAccumulator.password = issue.message
                }
            })
            // console.error(errorAccumulator)
            // this is library of hono
            // this throw to the main index.ts as httpexception 
            console.log("data not meet requirement. ")
            throw new HTTPException(400,{
                cause: errorAccumulator
                // error accumulator does not store directly the error. 
            })
        }
        console.log("Form Valid")

        // IT HANG HERE
        // Check duplicate 
        // These using mongoose schema
        console.log("Checking username existance")
        let checkDuplicate = null
        try {
            // find will return an ARRAY of object
            // findOne will return an object
            // find Does Not Throw on No Match
            checkDuplicate = await UserModel.findOne({username: request.username})  
            console.log("Checked user.")
        } catch (error) {
            console.log("Duplicate found")
           console.warn(`${error}`)
        }
        console.log(checkDuplicate)

        if(checkDuplicate){
            console.warn("Username Taken.")
            // if duplicate found, return HTTP Exception from HONO 
            // it return an http response status 400
            // second argument is message 
            throw new HTTPException(400,{
                cause: "Username is taken"
            })
        }
            console.log('User not exist, proceed create')
            // Hashing Password Bcrypt
            // https://bun.com/guides/util/hash-a-password
            const bcrypt = await Bun.password.hash(request.password, {
                algorithm: "bcrypt",
                // cost is the complexity
                // The higher the longer the time taken and it's expensive
                cost: 10
            })

            // Store the hashed password into the request (mutate)
            request.password = bcrypt

            // Store to Database
            // With mongoose can create and store at once
            console.log("Storing to DB")
            const resultDB = await UserModel.create(request)
            console.log("Data stored in DB")

            // Return Response 
            // take the request as an argument with type userRequest
            return toUserResponse(resultDB)
    }


    // Login Service 
    static async login(request: LoginUserRequest): Promise<UserResponse>{
        // Validate the request 
        // parse with request in LOGIN method
        const validateRequest  = UserValidation.LOGIN.safeParse(request)

        if(validateRequest.success === false){
            throw new HTTPException(400,{
                message: "Invalid form input"
            })
        }


        // Checking at DB is the user exist 
        // use let so that we can assign or mutate the token property
        const user = await UserModel.findOne({
            username: request.username
        })

        const generatedToken: string = crypto.randomUUID();

        if(user){
            // if user exists
            // get the raw password
            // then convert to the hashed 
            // first argument is the request password
            // second argument is the stored password in DB
            // third argument is the algorithm 
            const isPasswordValid = await Bun.password.verify(request.password,user.password,'bcrypt')      
            
            if(isPasswordValid){
                // if valid
                // Create Token 
                // FindOneAndUpdate is query 
                // where it take an object 
                // with the property of the collection 
                // first argument
                // first property find by the property
                // second argument 
                // replace the value based on the requested property 
                // crypto is library from js 
                // create a random unique id 
                await UserModel.findOneAndUpdate(
                    {username:request.username},
                    {token: generatedToken}
                )
            }else{
                // if invalid
                console.log('password is not correct')
                throw new HTTPException(401,{
                    message: "Username or password is invalid"
                })
            }
        }else{
            // if user does not exists
            // it's a good practice not letting the user know
            // either the email or password is invalid. 
            // for login purpose
            console.log("User not exist")
            throw new HTTPException(401,{
                message: "Username or password is invalid"
            })
        }

        const response = toUserResponse(user)
        // store the token to the response
        // the end token <!> is ensuring that the token is not null
        response.token = generatedToken
        console.log(response)

        return response
    }


    static async deleteUser (request: LoginUserRequest): Promise<DeleteResponse> {
        console.log("Deleting User")
        const resultDB = await UserModel.deleteOne({username: request.username})
        console.log("User deleted")
        const responseUser: DeleteResponse = {
            successStatus: true,
            message: "Successful deleted"
        }
        return responseUser
    }

    // validation token 
    // get the header request as argument 
    // the authorization header can be filled or null or 
    // undefined
    static async get(token: string | undefined | null): Promise<User> {
        const validateToken = UserValidation.TOKEN.safeParse(token)
        console.log('-------- Check Token Validity------')
        if(validateToken.error){
            throw new HTTPException(401,{
                cause:"Unauthorized Access (1)"
            })
        }
        // 1 means no token 
        // 2 means token is invalid 

        // assertion
        // overriding or supplementing TypeScript's type inference
        // type assertion is a way for you to tell the compiler, 
        // "I know more about the type of this value than you do right now, so treat it as this specific type.
        // token = validateToken.data as string

        // find based on token value
        // Here we specify what kind of data we need 
        // such as the name and username 
        // the key there is the key name 
        // and the 1 defined as show and zero means do not show 
        // you must use the find based on token 
        // const user = await UserModel.find({token: validateToken}).select({'name':1 ,'username':1, "_id":0})
        // find return an array, find one return an object
        const user = await UserModel.findOne({token: validateToken.data})
        console.log("Respond DB ")
        console.log(user)

        // If token value match with request
        if(!user){
            throw new HTTPException(401,{
                cause:"Unauthorized Access (2)"
            })
        }

        // this will return the user credentials as user type schema
        return user

    }


    // This update only run when the token is validated
    // that's why when the token is validated, the middleware
    // had hold the current user data. 
    // second argument is the request from the client side
    static async update(user: User, request: UpdateUserRequest): Promise<UserResponse>{
        console.log('----------- checking user request ------------------')
        if(request.name === undefined && request.password === undefined){
            throw new HTTPException(400,{
                message:"Nothing to update"
            })
        }
        const validatedData = UserValidation.UPDATE.safeParse(request)
        console.warn(validatedData)
        if(validatedData.error){
            throw new HTTPException(401,{
                message: "Password or name is invalid. Minimum length of password or name must be more than 3 character"
            })
        }

        // check if the request body contain name 
        // or password
        if(request.name){
            user.name = request.name
        }else if(request.password){
            user.password = await Bun.password.hash(request.password,{
                algorithm: "bcrypt",
                cost: 10
            })
        }

        console.log('Updating user data to MongoDB')
        console.log(user)
        // Model.findOneAndUpdate(filter(where condition), update, options, [callback]);
        // The options is return the new and updated document.
        // by default this set to false
        user = await UserModel.findOneAndUpdate({username:user.username},{$set:{name:user.name,password:user.password}},{new:true}) as User
        // By Default (without { new: true } or with { new: false }):
        // When you call findOneAndUpdate() without specifying the new option (or setting new: false explicitly),
        //  Mongoose will return the document as it existed before the update was applied.
        // so The options object (the third argument) is where I tell findOneAndUpdate how I want the result to be returned, 
        // and one of those ways is new: true, which means 'return me the updated document'."
        // Do the update, and then, for your return value, give me the brand new version.
        console.log("Response from DB")
        console.log(user)

        return toUserResponse(user)
    }

    // Following the API spec, for logout, 
    // the payload will return boolean value
    static async logout(user: User): Promise<boolean> {
        // Remove the token to logout
        // ensure the token validity is not avalaible 
        console.log("Removing user token")
        user = await UserModel.findOneAndUpdate({username: user.username},{$set:{token:null}},{new:true}) as User
        console.log("User token Removed")
        // if token is empty
        if(!user.token){
            return true
        }else{
            // if token is not empty
            return false
        }
    }
}