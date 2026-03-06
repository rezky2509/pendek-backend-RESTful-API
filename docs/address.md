# Address API SPEC 

## Create Address
Endpoint: POST /api/contacts/{contactID}/addresses

Request Headers: 
- Authentication: token

Request Body:
```json
{
    "street":"street",
    "city":"city",
    "province":"country",
    "country":"country",
    "postal_code":"1512"
}

```
Response Body: 
```json
{
    "data":{
        "id":1,
        "street":"street",
        "city":"city",
        "province":"country",
        "country":"country",
        "postal_code":"1512"
    }
}
```
## Create Multiple Address
Endpoint: POST /api/contacts/{contactID}/addresses

Request Headers: 
- Authentication: token

Request Body:
```json
{
    "data":[
        {
            "street":"street",
            "city":"city",
            "province":"country",
            "country":"country",
            "postal_code":"1512"
        },
        {
            "street":"street",
            "city":"city",
            "province":"country",
            "country":"country",
            "postal_code":"1512"
        }
    ]
}

```
Response Body: 
```json
{
    "data":[
                {
                    "id":1,
                    "street":"street",
                    "city":"city",
                    "province":"country",
                    "country":"country",
                    "postal_code":"1512"
                },{
                    "id":2,
                    "street":"street",
                    "city":"city",
                    "province":"country",
                    "country":"country",
                    "postal_code":"1512"
                }
            ]
}
```

## Get Address
Endpoint: GET /api/contacts/{contactID}/addresses/{addressID}

Request Headers: 
- Authentication: token

Response Body: 
```json
{
    "data":{
        "id":1,
        "street":"street",
        "city":"city",
        "province":"country",
        "country":"country",
        "postal_code":"1512"
    }
}
```

## Update Address
Endpoint: PUT /api/contacts/{contactID}/addresses/{addressID}

Request Headers: 
- Authentication: token

Request Body:
```json
{
    "street":"street",
    "city":"city",
    "province":"country",
    "country":"country",
    "postal_code":"1512"
}
```

Response Body: 
```json
{
    "data":{
        "id":1,
        "street":"street",
        "city":"city",
        "province":"country",
        "country":"country",
        "postal_code":"1512"
    }
}
```

## Remove Address
Endpoint: DELETE /api/contacts/{contactID}/addresses/{addressID}

Request Headers: 
- Authentication: token

Response Body: 
```json
{
    "data":"trues"
}
```

## List Address
Endpoint: GET /api/contacts/{contactID}/addresses/

Request Headers: 
- Authentication: token

Response Body: 
```json
{
    "data":[
        {
            "id":1,
            "street":"street",
            "city":"city",
            "province":"country",
            "country":"country",
            "postal_code":"1512"
        },
        {
            "id":2,
            "street":"street",
            "city":"city",
            "province":"country",
            "country":"country",
            "postal_code":"1512"
        },

    ]
}
```