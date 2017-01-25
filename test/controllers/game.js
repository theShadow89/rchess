var expect = require('chai').expect;

var sinon = require('sinon');

var DB = require('../../db')

var MockExpressRequest = require('mock-express-request');
var MockExpressResponse = require('mock-express-response');

var rewire = require('rewire');

var GameController = rewire('../../controllers/game');

describe('Controller Game Tests', function() {

    before(function(done) {
        DB.connect(DB.MODE_TEST, done)
    });

    describe("create a game",function () {

        var response,request;

        beforeEach(function () {
            response = new MockExpressResponse();
        });


        before(function () {
            request = new MockExpressRequest() ;
        });


        it("should respond with the id of created game",function(done){
            var GameModel = require("../../models/game");
            var create = sinon.stub(GameModel, "create").yields({id:"9df02f13-a4d1-4a9c-a404-e1e09d07e16e"});

            GameController.create(request, response);
            create.restore();


            expect(response._getJSON()).to.have.property('game_id');
            expect(response._getJSON().game_id).to.be.equal("9df02f13-a4d1-4a9c-a404-e1e09d07e16e");
            expect(response.statusCode).to.equal(200);

            done();

        });

        it('should call create model function', function(done) {
            var GameModel = require("../../models/game");
            var create = sinon.spy(GameModel, 'create');

            GameController.create(request,response);
            sinon.assert.calledOnce(create);
            done();
        });
    });

    describe("list games",function () {

        var response,request;

        beforeEach(function () {
            response = new MockExpressResponse();
        });


        before(function () {
            request = new MockExpressRequest();
        });


        it("should respond with array of games ids",function(done){
            var GameModel = require("../../models/game");

            var list = sinon.stub(GameModel, "list").yields(["77cc3b6e-1ebe-4851-bc63-1a4b4ce157eb","ca84d388-1b0e-4747-996f-70d68a2040a1"]);

            GameController.list(request, response);
            list.restore();

            expect(response._getJSON()).to.have.property('games');
            expect(response._getJSON().games).to.be.an('array');
            expect(response._getJSON().games).to.eql(["77cc3b6e-1ebe-4851-bc63-1a4b4ce157eb","ca84d388-1b0e-4747-996f-70d68a2040a1"]);
            expect(response.statusCode).to.equal(200);

            done();

        });

        it('should call create model function', function(done) {
            var GameModel = require("../../models/game");
            var list = sinon.spy(GameModel, 'list');

            GameController.list(request,response);
            list.restore();
            sinon.assert.calledOnce(list);
            done();
        });
    });

    describe("make move in a game",function () {

        var response,request;

        beforeEach(function () {
            response = new MockExpressResponse();
        });


        before(function () {
            request = new MockExpressRequest({
                params:{
                    id:""
                },
                body:{
                    move:{}
                }
            });
        });


        it("should respond with true if move is valid",function(done){
            var GameModel = require("../../models/game");

            var move = sinon.stub(GameModel, "move");
            move.yields({valid:true});

            GameController.move(request, response);
            move.restore();

            expect(response._getJSON()).to.have.property('valid');
            expect(response._getJSON().valid).to.eql(true);
            expect(response.statusCode).to.equal(200);

            done();

        });

        it("should respond with false if move is not valid",function(done){
            var GameModel = require("../../models/game");

            var move = sinon.stub(GameModel, "move").yields({valid:false});

            GameController.move(request, response);
            move.restore();

            expect(response._getJSON()).to.have.property('valid');
            expect(response._getJSON().valid).to.eql(false);
            expect(response.statusCode).to.equal(200);

            done();

        });

        it('should call move model function', function(done) {
            var GameModel = require("../../models/game");
            var move = sinon.stub(GameModel, "move").yields({valid:true});

            GameController.move(request,response);
            move.restore();
            sinon.assert.calledOnce(move);
            done();
        });
    });


    describe("check status game",function () {

        var response,request;

        var status;

        //var is_over,is_checkmate,is_stalemate,is_draw,is_check;

        beforeEach(function () {
            response = new MockExpressResponse();

            var GameModel = require("../../models/game");


            status = sinon.stub(GameModel, "status");
            status.yields({
                game_id: "77cc3b6e-1ebe-4851-bc63-1a4b4ce157eb",
                game_over: false,
                draw: true,
                checkmate: false,
                check: true,
                stalemate: false,
                current_player: 'b'
            });
        });

        afterEach(function () {
            response = new MockExpressResponse();

            status.restore();
        });


        before(function () {
            request = new MockExpressRequest({
                params:{
                    id:""
                }
            });
        });

        it("should respond with game status object ",function(done){

            GameController.status(request, response);

            
            expect(response._getJSON()).to.be.a("object");
            expect(response._getJSON()).to.have.property('game_id');
            expect(response._getJSON()).to.have.property('game_over');
            expect(response._getJSON()).to.have.property('draw');
            expect(response._getJSON()).to.have.property('checkmate');
            expect(response._getJSON()).to.have.property('stalemate');
            expect(response._getJSON()).to.have.property('current_player');

            expect(response.statusCode).to.equal(200);

            done();

        });
    });

    describe("delete a game",function () {

        var response,request;

        beforeEach(function () {
            response = new MockExpressResponse();
        });


        before(function () {
            request = new MockExpressRequest({
                params:{
                    id:""
                }
            });
        });


        it("should respond with game id if game was deleted",function(done){
            var GameModel = require("../../models/game");

            var _delete = sinon.stub(GameModel, "delete").yields({id:"9df02f13-a4d1-4a9c-a404-e1e09d07e16e"});

            GameController.delete(request, response);
            _delete.restore();

            expect(response._getJSON()).to.have.property('game_id');
            expect(response._getJSON().game_id).to.be.equal("9df02f13-a4d1-4a9c-a404-e1e09d07e16e");
            expect(response.statusCode).to.equal(200);
            done();

        });

        it('should call delete model function', function(done) {
            var GameModel = require("../../models/game");
            var _delete = sinon.stub(GameModel, "delete").yields({id:"9df02f13-a4d1-4a9c-a404-e1e09d07e16e"});

            GameController.delete(request,response);
            _delete.restore();
            sinon.assert.calledOnce(_delete);
            done();
        });
    });
});
