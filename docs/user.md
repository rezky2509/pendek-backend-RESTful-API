#User API Spec

## Register User
Endpoint: POST /api/users

Request Body: 
```json
{
    "username":"Kiki",
    "password":"123",
    "name":"kiki123"
}
```
Response Body (Success):
```json
{
    "data":{
        "username":"kiki",
        "name":"kiki123"
    }
}
```
Response Body (Error):
```json
{
    "errors":{
        "username":"Username must not empty",
        "name":"Name must not empty",
        "password":"Password must not empty"
    }
}
```

## Login User
Endpoint: POST /api/users/login

Request Body :
```json
{
    "username":"kiki",
    "password":"123"
}
```
Response Body (Success) :
```json
{
    "data":{
        "username":"kiki",
        "name":"kiki123",
        "token":"token"
    }
}
```

Response Body (Error):
```json
{
    "errors":{
        "username":"Username must not empty",
        "password":"Password is invalid"
    }
}
```

## Get User
Endpoint: GET /api/users/current

Request Headers : 
- Authorization: token

Response Body (Success) :
```json
{
    "data":{
        "username":"kiki",
        "name":"kiki123",
    }
}
```

## Update User
Endpoint: PATCH /api/users/current. Since this using PATCH, you only need at least one property key

Request Headers : 
- Authorization: token

Reqest Body: 
```json
{
    "username":"kiki",
    "name":"kiki",
    "password":"123"
}
```
Response Body (Success)
```json
{
    "data":{
        "username":"kiki",
        "name":"kiki"
    }
}
```

## Logout User
Endpoint: DELETE /api/users/current

Request Headers : 
- Authorization: token

Response Body (Success):
```json
{
    "data":"true"
}
```