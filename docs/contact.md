# Contact API Spec 

## Create Contact
Endpoint: POST /api/contacts

Request Headers:
- Authorization: token

Request Body: 
```json
{
    "firstname":"firstname",
    "lastname":"lastname",
    "email":"email@email.com",
    "phone":"0123435424"
}
```

Response Body(success):
```json
{
    "data":{
        "id":1,
        "firstname":"firstname",
        "lastname":"lastname",
        "email":"email@email.com",
        "phone":"0123435424"
    }
}
```
## Create Multiple Contact
Endpoint: POST /api/contacts

Request Headers:
- Authorization: token

Request Body: 
```json
{
    "data":[
            {
                "firstname":"firstname",
                "lastname":"lastname",
                "email":"email@email.com",
                "phone":"0123435424"
            },
            {
                "firstname":"firstname",
                "lastname":"lastname",
                "email":"email@email.com",
                "phone":"0123435424"
            }
    ]
}
```

Response Body(success):
```json
{
    "data":{
        "id":1,
        "firstname":"firstname",
        "lastname":"lastname",
        "email":"email@email.com",
        "phone":"0123435424"
    }
}
```
## Get Contact
Endpoint: GET /api/contacts/{idContact}

Request Headers:
- Authorization: token

Response Body(success):
```json
{
    "data":{
        "id":1,
        "firstname":"firstname",
        "lastname":"lastname",
        "email":"email@email.com",
        "phone":"0123435424"
    }
}
```

## Update Contact
Endpoint: PUT /api/contacts/{idContact}

Request Headers:
- Authorization: token

Request Body: 
```json
{
    "firstname":"firstname",
    "lastname":"lastname",
    "email":"email@email.com",
    "phone":"0123435424"
}
```

Response Body(success):
```json
{
    "data":{
        "id":1,
        "firstname":"firstname",
        "lastname":"lastname",
        "email":"email@email.com",
        "phone":"0123435424"
    }
}
```

## Remove Contact
Endpoint: DELETE /api/contacts/{idContact}

Request Headers:
- Authorization: token

Response Body:
```json
{
    "data":"true"
}
```

## Search Contact
Endpoint: GET /api/contacts

- Query Parameter search by: 
    -   name: string, search at firstname or lastname
    -   email: string, search at email
    -   phone: string, search at phone
    -   page: number, default 1
    -   size: number, default 10

Request Headers:
- Authorization: token

Response Body:
```json
{
    "data":[
        {
                "id":1,
                "firstname":"firstname",
                "lastname":"lastname",
                "email":"email@email.com",
                "phone":"0123435424"
        },
        {
            "id":2,
            "firstname":"firstname",
            "lastname":"lastname",
            "email":"email@email.com",
            "phone":"0123435424"
        },   
    ],
    "paging":{
        "current_page":1,
        "total_page":10,
        "size":10
    }
}
```