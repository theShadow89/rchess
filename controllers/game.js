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

    id = req.params.id;

    GameModel.status(id, function (data) {
        res.send(data);
    });

    

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