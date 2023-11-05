# Server Side Objects

## Notation

- <u>Primary Keys</u> are denoted by **PK** and indicate that this key will be used by the client to retrieve the unique object associated with it. All **PK**s are assumed `int`s unless specified by a following type.

- <u>Foreign Keys</u> are denoted by **FK** followed by *foreignObject.keyName* and indicate this key will be used by the client to relate this objet to the the associated *foreignObject* with the corresponding *keyName*. All **FK**s are assumed `int`s unless specified by a following type.

## User
Field name: user
### Defining Info
- id: **PK**
- email: `str`
### Additional Info
- handle: `str`
## Game
Field name: game
### Defining Info
- id: **PK**
- hostId: **FK** user.id
### Players
- players: [player]
### State Info
- phaseNumber: `int`
### Settings
- maxNumberOfPlayers: `int`
## Player
Field name `player`
### Defining Info
- id: **PK**
- gameId: **FK** game.id
- userId: **FK** user.id
### Player Objects
- advCards: [rPlayerAdvCard]
- tradeCards: [rPlayerTradeCard]
- units: [unit]
- ships: [ship]
- cities: [city]
### Player Chats
- chats: [rPlayerChat]
## Related Player Advancement Card
Field name: `rPlayerAdvCard`
### Defining Info
- id: **PK**
- playerId: **FK** player.id
- advCardId: **FK** advCard.id
### Associated Player Info
- status: enum(owned, selected)
- actions: [rAdvCardAction]
## Unit
### Defining Info
- id: **PK**
- playerId: **FK** player.id
- areaId: **FK** rGameArea.id
### Movement Info
- remainingMove: `int`
- actions: [rMovementAction]
## Related Game Area
Field name: `rGameArea`
### defining Info
- id: **PK**
- gameId: **PK** game.id
### Associated Game Info
- units: [unit]
- cities: [city]
- ships: [ship]
### Derived Properties
- players: ^game.players/^units
- isConflicted: |players|>1