
## Json Obj Notation
All request and responses will be in JSON. The following are the valid types of JSON and their notation used here.
- **Strings**: text enclosed in double quotes. The keyword **str** denotes any string value.
- **Integers/Decimals**: numbers. The keywords **int** and **dec** denote generic numbers.
- **booleans**: either ```false``` or ```true``` literals. The **bool** keyword denotes a generic boolean value.
- **Null**: denoted by the **null** keyword.
- **Objects** denoted by { } enclosing a comma seperated list of "key": *value* pairs. All keys are strings. Values may be any valid JSON type.
- **Arrays** denoted by [ ] enclosing a comma seperated list of values. These values may be any valid JSON type.

The following are additional shorthand used here:
- **Enums** used to represent a finite list of possible values are denoted by ( ) enclosing the list of values. If the type of all the values is the same, prepend the list with the type i.e. str("yes", "no") indicates two possible string values, "yes" or "no".
- **Where** and **And** clauses allow for the dfinition of additional values.
- **Destructuring** denoted by ...*obj* is used to represent all of the info from another Obj.
- **Ellipsis** denoted by ... always following the first value in an array, indicate the same value repeated 0 or more times.

## Auth
### Login
Endpoint: ```/auth/login```

Request Obj: 
```
{
    "username": str,
    "password": str
}
```
Response Obj:
```
{
    "token": str
}
```
### Register
Endpoint: ```/auth/register```

Request Obj: 
```
{
    "username": str,
    "password": str
}
```
Response Obj:
```
{
    "token": str
}
```
## Choose Game
### User
Enpoint: ```/choose/user```

Type: *get*, polling

Request obj:
```
{
    "token": str,
}
```

Response Obj:
```
{
    "userId": int
    "username": str,
    "games": [
        {...game}...
    ],
}
where game:
{
    "gameId": int,
    "hostId": int,
    "hostUsername": str,
    "status": str("pregame", "playing", "adjourned", "finished"),
    "numberOfplayers: int,
    "maxNumberOfPlayers: int,
}
```
### Host Game
Endpoint: ```/choose/host```

Type: *post*

Request obj:
```
{
    "token": str
}
```

Response obj:
```
{
    "gameId": int,
    "status": str("pregame", "playing", "adjourned", "finished")
}
```

### Join Game
Endpoint: ```/choose/join```

Type: *post*

Request obj:
```
{
    "token": str,
    "hostUsername": str
}
```

Response obj:
```
{
    "gameId": int,
    "status": str("pregame", "playing", "adjourned","finished")
}
```

### Select Game
Enpoint: ```/choose/selectgame```

Type: *post*

Notes: The client will use the response obj to move the player into the appropriate page depending on the state of the game i.e. if the game status is *pregame* the player will be moved to the pregame page to select civilization and wait for host to start or if the status is *playing* the player will be moved to the play game page. Once the client is at the next page, a follow up request for the info nessaccary to populate that page will be made.

Request obj:
```
{
    "token": str,
    "gameId": int
}
```

Response obj:
```
{
    "gameId": int,
    "status": str("pregame", "playing", "adjourned", "finished")
}
```

## Pre Game
### game

Endpoint: ```/pregame/game```

Type: *get*, polling

Request obj:
```
{
    "token": str,
    "gameId": int
}
```

Response Obj:
```
{
    "gameId": int,
    "hostId": int,
    "hostUsername": str,
    "status": str("pregame", "playing", "adjourned", "finished"),
    "numberOfplayers": int,
    "maxNumberOfPlayers": int,
    "players": [{...player}...],
    "civilizations": [
        {
            ...civilization, 
            isTaken: bool
        }...
    ]
}
where player:
{
    "userId": int,
    "username": str,
    "type": str("ai", "human", "open")
}
And civilization:
{
    "civilizationId": int,
    "name": str,
    "color": str,
    "astRank": int
}
```