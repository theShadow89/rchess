var expect = require('chai').expect,
    sinon = require('sinon');
var request = require('supertest');
var app = require("../../app");

var DB = require('../../db');

before(function(done) {
    //connection
    DB.connect(DB.MODE_TEST, done);
});

describe('Game Endpoint integration test', function() {

    var gameId;

    var server;

    before(function(done){
        //create a server to handler app request
        server = request(app);

        //ensure that db is empty
        DB.drop(function(err) {
            if (err) return done(err);
            done();
        })
    });


    describe('Game creation ', function() {
        it('should create a game', function(done) {
            server
                .post('/api/games/create')
                // end handles the response
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    expect(res.status).to.equal(200);

                    gameId = res.body.game_id;

                    done();
                });
        });
    });

    describe('Game move ', function() {
        it('should respond 200 status and valid flag to true if move in game is valid', function(done) {
            server
                .put('/api/games/move/'+gameId)
                .send({move:{from:"c2",to:"c3"}})
                // end handles the response
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    expect(res.status).to.equal(200);

                    expect(res.body.valid).to.equal(true);
                    done();
                });
        });
    });

    describe('List Games', function() {
        it('should respond 200 status and array with all games id', function(done) {
            server
                .get('/api/games/')
                // end handles the response
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    expect(res.status).to.equal(200);

                    expect(res.body.games).to.be.a('array');
                    expect(res.body.games).to.eql([gameId]);
                    done();
                });
        });
    });

    describe('Status Game', function() {
        it('should respond 200 status and game statuses array', function(done) {
            server
                .get('/api/games/status/'+gameId)
                // end handles the response
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    expect(res.status).to.equal(200);

                    expect(res.body.statuses).to.be.a('array');

                    done();
                });
        });
    });

    describe('Delete Game', function() {
        it('should respond 200 status and games id if game will be deleted', function(done) {
            server
                .delete('/api/games/delete/'+gameId)
                // end handles the response
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    expect(res.status).to.equal(200);

                    expect(res.body.game_id).to.be.equal(gameId);

                    done();
                });
        });
    });

});
