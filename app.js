var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var games = require('./routes/games');

var db = require('./db');

var AuthenticatorMiddleware = require("./middleware/authenticator");

var auth = new  AuthenticatorMiddleware({token:process.env.TOKEN});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(auth.authenticate);

app.use('/api/games', games);


//default db mode is production
//on development use test mode
dbMode = db.MODE_PRODUCTION;
if (app.get('env') === 'development') {
  dbMode = db.MODE_TEST
}

//connect to database
//on error abort application start
db.connect(dbMode,function (err) {
  if(err){
    console.log("Impossible to connect to database: " + err);
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
