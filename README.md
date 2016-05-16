# RChess - REST interface to play chess game

Start the server with:

`node ./bin/server` or `npm start`

##Games Api Endpoint Documentation

#### Create a game

Request

`curl -X POST http://localhost:3000/api/games/create`

Response

`{"game_id":{$gameId}}`


#### List all Active games

Request

`curl http://localhost:3000/api/games/`

Response

`{"games":[{$gameId1},{$gameId2}]}`

#### Make a Move on a game

Request

`curl -X PUT http://localhost:3000/api/games/move/{$gameId} -d '{"move":{"from":"c2","to":"c3"}}'
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

`curl http://localhost:3000/api/games/status/{gameId}`

Response

`{"statuses":[]}`

return an array with game statuses. if empty the game is running


#### Delete a game

Request

`curl -x DELETE http://localhost:3000/api/games/delete/{gameId}`

Response

`{"game_id":{$gameId}}`

return id of deleted game