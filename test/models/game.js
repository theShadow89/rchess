var expect = require('chai').expect
    , DB = require('../../db')
    , fixtures = require('../fixtures/model-games');

var uuid = require('node-uuid');

var Game = require('../../models/game');

var Chess = require('chess.js').Chess;

describe('Model Game Tests', function() {

    before(function(done) {
        DB.connect(DB.MODE_TEST, done)
    });

    beforeEach(function(done) {
        DB.drop(function(err) {
            if (err) return done(err);
            DB.fixtures(fixtures, done)
        })
    });

    it('should find game by id', function(done) {
        Game.findById("b21b089c-ced4-4f9d-a305-bf933965f44e",function(data,err){
            expect(err).to.be.null();
            expect(data).to.have.property('game_id')
                .and.not.equal(undefined);
            expect(data).to.have.property('fen')
                .and.not.equal(undefined);
            done();
        });
    });

    it('list games', function(done) {

        Game.list(function(games){
            expect(games.length).to.eql(5);
            done();
        });
    });

    it('create a game', function(done) {
        Game.create(function(data){
            expect(data).to.have.property('id')
                .and.not.equal(undefined);
            Game.findById(data.id,function(data){
                expect(data.id).to.not.be.null();
                done();
            });

        });
    });

    it('make a move in the game', function(done) {
        var idGame = "7eedb296-2586-4925-b860-8c132232b8bc";
        Game.move(idGame,{ from: 'e2', to: 'e3' },function(data){
            expect(data.valid).to.equal(true);
            Game.findById(idGame,function(data){
                expect(data.fen).to.equal("rnbqkbnr/pppppppp/8/8/8/4P3/PPPP1PPP/RNBQKBNR b KQkq - 0 1");
                done();
            });
        });
    });

    it('game is over', function(done) {
        var idGame = "1a28fe2e-7a44-4583-877a-d565644d9f83";
        Game.status(idGame,function(data){
            expect(data.game_over).to.equal(true);
            done();
        });
    });

    it('game is in checkmate state', function(done) {
        var idGame = "38f76279-caf8-4e22-8433-28bea2fb4cb2";
        Game.status(idGame,function(data){
            expect(data.checkmate).to.equal(true);
            done();
        });
    });

    it('game is in check state', function(done) {
        var idGame = "38f76279-caf8-4e22-8433-28bea2fb4cb2";
        Game.status(idGame,function(data){
            expect(data.check).to.equal(true);
            done();
        });
    });

    it('game is in draw state', function(done) {
        var idGame = "fc3d4f04-0a4e-4767-b268-0c3ad1dfbed7";
        Game.status(idGame,function(data){
            expect(data.draw).to.equal(true);
            done();
        });
    });

    it('game is in stalemate state', function(done) {
        var idGame = "fc3d4f04-0a4e-4767-b268-0c3ad1dfbed7";
        Game.status(idGame,function(data){
            expect(data.stalemate).to.equal(true);
            done();
        });
    });

    it('game status', function(done) {
        var idGame = "fc3d4f04-0a4e-4767-b268-0c3ad1dfbed7";
        Game.status(idGame,function(data){
            expect(data).to.be.an('object');
            expect(data).to.have.property('game_id');
            expect(data).to.have.property('game_over');
            expect(data).to.have.property('stalemate');
            expect(data).to.have.property('draw');
            expect(data).to.have.property('checkmate');
            expect(data).to.have.property('check');
            expect(data).to.have.property('current_player');
            done();
        });
    });

    it('delete a game', function(done) {
        var idGame = "fc3d4f04-0a4e-4767-b268-0c3ad1dfbed7";

        Game.delete(idGame,function(data){
            expect(data.id).to.equal(idGame);
            Game.findById(data.id,function(data,err){
                expect(err).to.be.not.null();
                done();
            });
        });
    });
});
