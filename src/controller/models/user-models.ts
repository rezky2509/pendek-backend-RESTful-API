// Here we defined the type for request and response 
// User Model 

export type RegisterUserRequest = {
    username: string;
    password: string;
    name:string,
    token?:string | undefined | null
}

export type UserResponse = {
    username: string;
    name: string;
    // token is optional 
    // because not all response to user need
    // token. only during registration 
    token: string;
}

export type LoginUserRequest = {
    username: string,
    password: string
}

// when update 
// name can be change and password
// so both name or password can be undefined or empty
export type UpdateUserRequest = {
    name?: string,
    password?: string
}
