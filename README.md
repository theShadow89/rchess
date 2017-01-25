# RChess - REST interface to play chess game

##Requirements

- mongodb (local or remote)

##Configurations


- MONGODB_URI: mongo db uri. if not specified will be used default localhost on standard port

- TOKEN : token used to authenticate request. It must be specified

Start the server with:

`node ./bin/server` or `npm start`

##Games Api Endpoint Documentation

#### Create a game

Request

`curl -X POST http://localhost:3000/api/games/create -H "x-access-token: {token}"`

Response

`{"game_id":{$gameId}}`


#### List all Active games

Request

`curl http://localhost:3000/api/games/ -H "x-access-token: {token}"`

Response

`{"games":[{$gameId1},{$gameId2}]}`

#### Make a Move on a game

Request

`curl -X PUT http://localhost:3000/api/games/move/{$gameId} -d '{"move":{"from":"c2","to":"c3"}}' -H "Content-Type: application/json" -H "x-access-token: {token}"
`

where the data represent the move object:

`
{
    move:{
        from: {start position of piece to move},
        to: {end position of pice to move}
    }
}
`

Response

`{"valid": true/false}`

return true if move is valid false otherwise


#### Get a game status

Request

`curl http://localhost:3000/api/games/status/{gameId} -H "x-access-token: {token}"`

Response

`{  
	game_id: string,
    game_over: boolean,
    draw: boolean,
    checkmate: boolean,
    check: boolean,
    stalemate: boolean,
    current_player: string
 }`

return an JSON object that represent the state of the game.


#### Delete a game

Request

`curl -x DELETE http://localhost:3000/api/games/delete/{gameId} -H "x-access-token: {token}"`

Response

`{"game_id":{$gameId}}`

return id of deleted game