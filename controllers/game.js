var GameModel = require("../models/game");

exports.create = function(req,res){
    GameModel.create(function (data) {
        res.send({game_id:data.id})
    })
};

exports.move = function(req,res){
    GameModel.move(req.params.id,req.body.move,function (data) {
        res.send({valid:data.valid})
    })
};

exports.status = function(req,res){

    statuses =[];

    id = req.params.id;

    GameModel.is_draw(id, function (data) {
        if(data.draw) statuses.push("draw");
    });

    GameModel.is_checkmate(id, function (data) {
        if(data.checkmate) statuses.push("checkmate");
    });

    GameModel.is_check(id, function (data) {
        if(data.check) statuses.push("check");
    });

    GameModel.is_over(id, function (data) {
        if(data.game_over) statuses.push("game_over");
    });

    GameModel.is_stalemate(id, function (data) {
        if(data.stalemate) statuses.push("stalemate");
    });

    res.send({statuses:statuses});

};

exports.delete = function(req,res){
    GameModel.delete(req.params.id,function (data) {
        res.send({game_id:data.id})
    })
};

exports.list = function(req,res){
    GameModel.list(function (data) {
        res.send({games:data})
    })
};