var DB = require('../db');
var uuid = require('node-uuid');

var Chess = require('chess.js').Chess;

var COLLECTION = 'games';

exports.findById = function (gameId, cb) {
    var db = DB.getDB();
    db.collection(COLLECTION).find({"game_id": gameId}, {limit: 1}).next(function (err, doc) {
        if (err) {
            cb(null, "game not found")
        }

        if (doc) {
            cb(doc, null)
        }else{
            cb(null, "game not found")
        }
        
    });
};

exports.create = function (cb) {
    var gameId = uuid.v4();
    var db = DB.getDB();
    var chess = new Chess();

    db.collection(COLLECTION).insertOne({"game_id": gameId, "fen": chess.fen()}, function (err, res) {
        var gameData = {
            id: gameId
        };
        cb(gameData);
    });
};

exports.move = function (idGame, move, cb) {
    var db = DB.getDB();

    //find game
    this.findById(idGame, function (game, err) {
        //if error occur move is invalid
        if (err) {
            cb({
                valid: false
            });
        }

        //create a game instance from fen stores on db
        var chess = new Chess(game.fen);

        //make move and update game fen status if it is  valid
        var chessMove = chess.move(move);
        if (chessMove != null) {
            db.collection(COLLECTION).updateOne({"game_id": game.game_id}, {"$set": {"fen": chess.fen()}}, function (err, data) {
                //error occur on update then the move is invalid
                if (err) {
                    cb({
                        valid: false
                    });
                }

                cb({
                    valid: true
                });
            });
        } else {
            //move is not valid
            cb({
                valid: false
            });
        }
    });
};

exports.delete = function (idGame, cb) {
    var db = DB.getDB();

    //find game
    this.findById(idGame, function (game, err) {
        //if error occur return no data
        if (err) {
            cb({});
        }

        db.collection(COLLECTION).deleteOne({"game_id": game.game_id}, function (err, data) {
            //if error occur on delete game return no data
            if (err) {
                cb({});
            }

            //return id of deleted game
            cb({id: game.game_id});

        });
    });

};

exports.list = function (cb) {
    var db = DB.getDB();

    db.collection(COLLECTION).find({}, {"game_id": true}).toArray(function (err, data) {
        if (err) {
            console.log(err);
        }

        var games = data.map(function (obj) {
            return obj.game_id
        });

        cb(games);
    });

};

exports.status = function (idGame, cb) {
   var db = DB.getDB();

    //find game
    this.findById(idGame, function (game, err) {
        //if error occur return no data
        if (err) {
            cb({});
        }

        //create a game instance from fen stores on db
        var chess = new Chess(game.fen);

        cb({
            game_id: idGame,
            game_over: chess.game_over(),
            draw: chess.in_draw(),
            checkmate: chess.in_checkmate(),
            check: chess.in_check(),
            stalemate: chess.in_stalemate(),
            current_player: chess.turn()
        });
    });
};