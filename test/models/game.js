var expect = require('chai').expect
    , DB = require('../../db');

var uuid = require('node-uuid');

var Game = require('../../models/game');

var Chess = require('chess.js').Chess;

describe('Model Game Tests', function() {
    

    beforeEach(function(done) {
        //remove all data
        DB.games={};
        done();
    });

    it('create a game', function(done) {
        Game.create(function(data){
            expect(data).to.have.property('id')
                .and.not.equal(undefined);
            expect(DB.games[data.id]).to.not.be.null;
            done();
        });
    });

    it('make a move in the game', function(done) {
        var idGame = uuid.v4();
        DB.games[idGame] = new Chess();
        Game.move(idGame,{ from: 'e2', to: 'e3' },function(data){
            expect(data.valid).to.equal(true);
            expect(DB.games[idGame].fen()).to.equal("rnbqkbnr/pppppppp/8/8/8/4P3/PPPP1PPP/RNBQKBNR b KQkq - 0 1");
            done();
        });
    });

    it('game is over', function(done) {
        var idGame = uuid.v4();
        DB.games[idGame] = new Chess('3q2rk/pbpp1Npp/1p6/6b1/2P1P3/P7/1PP2PPP/R4RK1 b - - 0 2');
        Game.is_over(idGame,function(data){
            expect(data.game_over).to.equal(true);
            done();
        });
    });

    it('game is in checkmate state', function(done) {
        var idGame = uuid.v4();
        DB.games[idGame] = new Chess('rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3');
        Game.is_checkmate(idGame,function(data){
            expect(data.checkmate).to.equal(true);
            done();
        });
    });

    it('game is in check state', function(done) {
        var idGame = uuid.v4();
        DB.games[idGame] = new Chess('rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3');
        Game.is_check(idGame,function(data){
            expect(data.check).to.equal(true);
            done();
        });
    });

    it('game is in draw state', function(done) {
        var idGame = uuid.v4();
        DB.games[idGame] = new Chess('4k3/4P3/4K3/8/8/8/8/8 b - - 0 78');
        Game.is_draw(idGame,function(data){
            expect(data.draw).to.equal(true);
            done();
        });
    });

    it('game is in stalemate state', function(done) {
        var idGame = uuid.v4();
        DB.games[idGame] = new Chess('4k3/4P3/4K3/8/8/8/8/8 b - - 0 78');
        Game.is_stalemate(idGame,function(data){
            expect(data.stalemate).to.equal(true);
            done();
        });
    });

    it('delete a game', function(done) {
        var idGame = uuid.v4();
        DB.games[idGame] = new Chess();

        Game.delete(idGame,function(data){
            expect(data.id).to.equal(idGame);
            expect(DB.games[idGame]).to.be.undefined;
            done();
        });
    });

    it('list games', function(done) {
        var idGame1 = uuid.v4();
        DB.games[idGame1] = new Chess();

        var idGame2 = uuid.v4();
        DB.games[idGame2] = new Chess();


        Game.list(function(data){
            expect(data.games).to.eql([idGame1,idGame2]);
            done();
        });
    });
});
