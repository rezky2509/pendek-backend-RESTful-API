# url_mapper API Specification

## Create Shorten URL
Endpoint: POST api/url_mapper

Request Headers: 
- Authorization: token

Request body: 
```json 
{
    "user": "21412",
    "long_url": "www.bfddbf.com/412412",
    "description": "here is the description",
    "is_active": true
}
```

Response body(success):
```json
{
    "data":
    {
        "_id":"21412421412",
        "user": "21412",
        "long_url": "www.bfddbf.com/412412",
        "short_url":"wwww.pendek.com/g342g2",
        "total_clicks":23231,
        "created_at": "12 Jan 2025",
        "description": "here is the description",
        "is_active": true
    }
}
```

IF the domain is prohibitted
Response body(error):
```json
{
    "data":{
        "error": "The url you provided is prohibitted."
    }
}
```


## Alter URL domain or description
Endpoint: PATCH api/url_mapper/{url_id}

Request Headers: 
- Authorization: Token

Request body: 
```json 
{
    "long_url": "www.bfddbf.com/412412",
    "description": "here is the description",
    "is_active": true
}
```

Response body(success):
```json
{
    "data":
    {
        "_id":"21412421412",
        "user_id": "21412",
        "long_url": "www.bfddbf.com/412412",
        "short_url":"wwww.pendek.com/g342g2",
        "total_clicks":23231,
        "created_at": "12 Jan 2025",
        "description": "here is the description",
        "is_active": true
    }
}
```

## GET Short URL List 
Endpoint: GET /api/url_mapper/lists

Request Headers:
- Authorization: token

Response body(success):
```json
{
    "data":
    {
        "_id":"21412421412",
        "user": "21412",
        "long_url": "www.bfddbf.com/412412",
        "short_url":"wwww.pendek.com/g342g2",
        "total_clicks":23231,
        "created_at": "12 Jan 2025",
        "description": "here is the description",
        "is_active": true
    }
}
```

Can return multiple url in an array 

```json
{
    "data":
    [
        {
            "_id":"21412421412",
            "user": "21412",
            "long_url": "www.bfddbf.com/412412",
            "short_url":"wwww.pendek.com/g342g2",
            "total_clicks":23231,
            "created_at": "12 Jan 2025",
            "description": "here is the description",
            "is_active": true
        },
        {
            "_id":"21412421412",
            "user": "21412",
            "long_url": "www.bfddbf.com/412412",
            "short_url":"wwww.pendek.com/g342g2",
            "total_clicks":23231,
            "created_at": "12 Jan 2025",
            "description": "here is the description",
            "is_active": true
        }
    ]

}
```

Pagination features coming soon for url lists

## Remove Short URL 
Endpoint: DELETE /api/url_mapper/{url_id}

Request Headers: 
- Authorization: token 

Response body (success)
```json
{
    "data":true
}
```

## Redirect to the URL 
Endpoint: GET /{short_url}

Response: 
- HTTP Response Code 301 

Response Error(Not Found): 
- HTTP Response Code 404 

 Response Body:
```json
{
    "errors":"url is not found"
}
```


