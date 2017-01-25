var expect = require('chai').expect,
    sinon = require('sinon');
var request = require('supertest');
process.env.TOKEN = 'testtoken';
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
        it('should create a game with correct token', function(done) {
            server
                .post('/api/games/create')
                .set('x-access-token', 'testtoken')
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

        it('should return error when token is wrong', function() {
            server
                .post('/api/games/create')
                .set('x-access-token', 'wrongtoken')
                // end handles the response
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    expect(res.status).to.equal(200);

                    expect(res.body.success).to.be.equal(false);
                    expect(res.body.message).to.be.equal("Failed to authenticate token.");

                });
        });
    });

    describe('Game move ', function() {
        it('should respond 200 status and valid flag to true if move in game is valid and correct token provided', function(done) {
            server
                .put('/api/games/move/'+gameId)
                .set('x-access-token', 'testtoken')
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

        it('should return error when token is wrong', function(done) {
            server
                .put('/api/games/move/'+gameId)
                .set('x-access-token', 'wrongtoken')
                .send({move:{from:"c2",to:"c3"}})
                // end handles the response
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    expect(res.status).to.equal(200);

                    expect(res.body.success).to.be.equal(false);
                    expect(res.body.message).to.be.equal("Failed to authenticate token.");
                    done();
                });
        });
    });

    describe('List Games', function() {
        it('should respond 200 status and array with all games id if a valid token provided', function(done) {
            server
                .get('/api/games/')
                .set('x-access-token', 'testtoken')
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

        it('should return error when token is wrong', function(done) {
            server
                .get('/api/games/')
                .set('x-access-token', 'wrongtoken')
                // end handles the response
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    expect(res.status).to.equal(200);

                    expect(res.body.success).to.be.equal(false);
                    expect(res.body.message).to.be.equal("Failed to authenticate token.");
                    done();
                });
        });
    });

    describe('Status Game', function() {
        it('should respond 200 status and game statuses array when token is correct', function(done) {
            server
                .get('/api/games/status/'+gameId)
                .set('x-access-token', 'testtoken')
                // end handles the response
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    expect(res.status).to.equal(200);

                    expect(res.body).to.be.a('object');

                    done();
                });
        });

        it('should return error when token is wrong', function(done) {
            server
                .get('/api/games/status/'+gameId)
                .set('x-access-token', 'wrongtoken')
                // end handles the response
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    expect(res.status).to.equal(200);

                    expect(res.body.success).to.be.equal(false);
                    expect(res.body.message).to.be.equal("Failed to authenticate token.");
                    done();
                });
        });
    });

    describe('Delete Game', function() {
        it('should respond 200 status and games id if game will be deleted', function(done) {
            server
                .delete('/api/games/delete/'+gameId)
                .set('x-access-token', 'testtoken')
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

        it('should return error when token is wrong', function(done) {
            server
                .delete('/api/games/delete/'+gameId)
                .set('x-access-token', 'wrongtoken')
                // end handles the response
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    expect(res.status).to.equal(200);

                    expect(res.body.success).to.be.equal(false);
                    expect(res.body.message).to.be.equal("Failed to authenticate token.");
                    done();
                });
        });

    });

});
