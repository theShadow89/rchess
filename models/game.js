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

exports.delete = function(idGame,cb){
    delete DB.games[idGame];
    cb({id: idGame});
};

exports.list = function(cb){
    cb({games: Object.keys(DB.games)});
};

exports.is_over = function(idGame,cb){
    var game = DB.games[idGame];
    cb({
        game_over: game.game_over()
    });
};

exports.is_draw = function(idGame,cb){
    var game = DB.games[idGame];
    cb({
        draw: game.in_draw()
    });
};

exports.is_checkmate = function(idGame,cb){
    var game = DB.games[idGame];
    cb({
        checkmate: game.in_checkmate()
    });
};

exports.is_check = function(idGame,cb){
    var game = DB.games[idGame];
    cb({
        check: game.in_check()
    });
};

exports.is_stalemate = function(idGame,cb){
    var game = DB.games[idGame];
    cb({
        stalemate: game.in_stalemate()
    });
};