var expect = require('chai').expect;

var sinon = require('sinon');


var MockExpressRequest = require('mock-express-request');
var MockExpressResponse = require('mock-express-response');

var rewire = require('rewire');

var Authenticator = require('../../middleware/authenticator.js');

describe('Authenticator Tests', function() {

    var auth;

    before(function(){
        auth = new Authenticator({token:"testtoken"});
    });

    describe("Correct Token",function(){

        var response,request;

        beforeEach(function(){
            response = new MockExpressResponse();
        });

        before(function () {
            request = new MockExpressRequest({
                headers:{
                    "x-access-token":"testtoken"
                }
            }) ;
        });


        it("should authenticate when the token is correct",function (done){
            auth.authenticate(request,response,function(){});

            expect(request.token).to.be.equal("testtoken");
            done();
        });

    });

    describe("Wrong Token",function(){

        var response,request;

        beforeEach(function(){
            response = new MockExpressResponse();
        });

        before(function () {
            request = new MockExpressRequest({
                headers:{
                    "x-access-token":"wrongtoken"
                }
            }) ;
        });


        it("should not authenticate when the token is wrong",function (done) {
            auth.authenticate(request,response);

            expect(response._getJSON()).to.have.property('message');
            expect(response._getJSON().message).to.be.equal("Failed to authenticate token.");

            done();
        });

    });

    describe("No Token",function(){

        var response,request;

        beforeEach(function(){
            response = new MockExpressResponse();
        });

        before(function () {
            request = new MockExpressRequest() ;
        });


        it("should return error if token will not provided",function (done) {
            auth.authenticate(request,response);

            expect(response._getJSON()).to.have.property('message');
            expect(response._getJSON().message).to.be.equal("No token provided.");
            expect(response.statusCode).to.equal(403);

            done();
        });

    });
});