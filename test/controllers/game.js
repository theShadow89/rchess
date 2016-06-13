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

        var is_over,is_checkmate,is_stalemate,is_draw,is_check;

        beforeEach(function () {
            response = new MockExpressResponse();


            var GameModel = require("../../models/game");

            is_over = sinon.stub(GameModel, "is_over");
            is_over.yields({game_over:true});

            is_checkmate = sinon.stub(GameModel, "is_checkmate");
            is_checkmate.yields({checkmate:true});

            is_stalemate = sinon.stub(GameModel, "is_stalemate");
            is_stalemate.yields({stalemate:true});

            is_draw = sinon.stub(GameModel, "is_draw");
            is_draw.yields({draw:true});

            is_check = sinon.stub(GameModel, "is_check");
            is_check.yields({check:true});
        });

        afterEach(function () {
            response = new MockExpressResponse();

            is_over.restore();

            is_checkmate.restore();

            is_stalemate.restore();

            is_draw.restore();

            is_check.restore();
        });


        before(function () {
            request = new MockExpressRequest({
                params:{
                    id:""
                }
            });
        });

        it("should respond with array of statuses ",function(done){

            GameController.status(request, response);

            expect(response._getJSON()).to.have.property('statuses');
            expect(response._getJSON().statuses).to.be.a("array");
            expect(response.statusCode).to.equal(200);

            done();

        });

        describe("game over status",function () {

            it("should respond with statuses array that contains game_over flag if game is over",function(done){

                GameController.status(request, response);

                expect(response._getJSON()).to.have.property('statuses');
                expect(response._getJSON().statuses).to.include("game_over");
                expect(response.statusCode).to.equal(200);

                done();

            });

            it('should call is_over model function', function(done) {
                GameController.status(request,response);
                sinon.assert.calledOnce(is_over);
                done();
            });

        });

        describe("checkmate status",function () {

            it("should respond with statuses array that contains checkmate flag if game position is checkmate",function(done){

                GameController.status(request, response);

                expect(response._getJSON()).to.have.property('statuses');
                expect(response._getJSON().statuses).to.include("checkmate");
                expect(response.statusCode).to.equal(200);

                done();

            });

            it('should call is_over model function', function(done) {
                GameController.status(request,response);
                sinon.assert.calledOnce(is_checkmate);
                done();
            });

        });

        describe("stalemate status",function () {

            it("should respond with statuses array that contains stalemate flag if game position is stalemate",function(done){
                GameController.status(request, response);

                expect(response._getJSON()).to.have.property('statuses');
                expect(response._getJSON().statuses).to.include("stalemate");
                expect(response.statusCode).to.equal(200);
                done();
            });

            it('should call is_stalemate model function', function(done) {
                GameController.status(request,response);
                sinon.assert.calledOnce(is_stalemate);
                done();
            });

        });

        describe("draw status",function () {

            it("should respond with statuses array that contains draw flag if game position is draw",function(done){

                GameController.status(request, response);

                expect(response._getJSON()).to.have.property('statuses');
                expect(response._getJSON().statuses).to.include("draw");
                expect(response.statusCode).to.equal(200);

                done();

            });

            it('should call is_draw model function', function(done) {
                GameController.status(request,response);
                sinon.assert.calledOnce(is_draw);
                done();
            });

        });

        describe("check status",function () {

            it("should respond with statuses array that contains check flag if game position is check",function(done){

                GameController.status(request, response);

                expect(response._getJSON()).to.have.property('statuses');
                expect(response._getJSON().statuses).to.include("check");
                expect(response.statusCode).to.equal(200);

                done();

            });

            it('should call is_check model function', function(done) {

                GameController.status(request,response);
                sinon.assert.calledOnce(is_check);
                done();
            });

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
