# FootyDAO-server
## **Game API**
### POST
api/game/add - ONLY ADMIN
```javascript
// PARAMS
{
    "description" : "Play football with friends at ETH Barcelona",
    "title" : "Eth Barcelona Footie",
    "profilePic" : "www.google.com",
    "maxParticipants" : 20,
    "city" : "Barcelona",
    "country" : "Spain",
    "date" : "2011-08-20",
    "time" : "20.30",
    "web3Event" : "Eth Barcelona",
    "stake" : "0.1",
    "pics" : []
}
```

api/game/join - ONLY AUTHENTICATED USER
```javascript
// PARAMS
{
    "gameId" : "64a1987f2e067205af52ba33",
    "amount" : 2 // the amount of people you want to register
}
```

### GET

api/game/all
```javascript
//RESPONSE
[
    {
        "_id": "64a1987f2e067205af52ba33",
        "description": "Play football with friends at ETH Barcelona",
        "profilePic": "www.google.com",
        "title": "Eth Barcelona Footie",
        "participants": [
            "jrcarlos2000",
            "jrcarlos2000",
            "jrcarlos2000",
            "jrcarlos2000",
            "carlosramos",
            "carlosramos"
        ],
        "maxParticipants": 20,
        "city": "Barcelona",
        "country": "Spain",
        "date": "2011-08-20",
        "time": "20.30",
        "web3Event": "Eth Barcelona",
        "stake": 0.1,
        "totalStake": 0,
        "pics": [],
        "__v": 3
    }
]
```

api/game/:id
```javascript
// RESPONSE
{
    "_id": "64a1987f2e067205af52ba33",
    "description": "Play football with friends at ETH Barcelona",
    "profilePic": "www.google.com",
    "title": "Eth Barcelona Footie",
    "participants": [
        "jrcarlos2000",
        "jrcarlos2000",
        "jrcarlos2000",
        "jrcarlos2000",
        "carlosramos",
        "carlosramos"
    ],
    "maxParticipants": 20,
    "city": "Barcelona",
    "country": "Spain",
    "date": "2011-08-20",
    "time": "20.30",
    "web3Event": "Eth Barcelona",
    "stake": 0.1,
    "totalStake": 0,
    "pics": [],
    "__v": 3
}
```

## **User API**
### POST
### GET
api/user/info - ONLY AUTHENTICATED USER

```javascript
// RESPONSE
{
    "_id": "64a172e005b5bf9d5013e9f6",
    "username": "carlosramos",
    "roles": [
        "649e6ef543aa6819460df259"
    ],
    "project": "EduDAO",
    "location": "Kuala Lumpur",
    "twitter": "jrcarlos2000",
    "telegram": "jrcarlos2000",
    "dateJoined": "2023-07-02T12:51:44.982Z",
    "__v": 2,
    "games": [ // reduced amount of fields
        {
            "_id": "64a1987f2e067205af52ba33",
            "description": "Play football with friends at ETH Barcelona",
            "profilePic": "www.google.com",
            "title": "Eth Barcelona Footie",
            "city": "Barcelona",
            "country": "Spain",
            "date": "2011-08-20",
            "time": "20.30"
        }
    ]
}
```
