var DB = require('../db');
var uuid = require('node-uuid');

var Chess = require('chess.js').Chess;


exports.findById = function(gameId,cb){
    cb({},null);
};

exports.create = function(cb){
    var gameId = uuid.v4();
    DB.games[gameId] = new Chess();

    var gameData = {
        id: gameId
    };

    cb(gameData);
};

exports.move = function(idGame,move,cb){
    var valid = false;

    var game = DB.games[idGame];

    if(game.move(move)!= null) valid = true;

    cb({
        valid: valid
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