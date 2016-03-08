

var express = require('express');

var app = express();
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');

var MongoClient = require('mongodb').MongoClient // Driver for connecting to MongoDB
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');
var users = require('./routes/users');

var cons = require('consolidate') // Templating library adapter for Express
app.use(express.static('public'));


//MongoClient.connect('mongodb://localhost:27017/checking', {server: {poolSize: 1}}, function(err, db) {   
    
	
	var user, password, connectUri
	user = process.env.DB_USER || process.argv[2]
	password = process.env.DB_PW || process.argv[3]			
		var connectUri = 'mongodb://' + user + ':' + password + '@ds045757.mongolab.com:45757/checking'
		MongoClient.connect(connectUri, function(err, db) {
    "use strict";
    if(err) throw err;
var users = db.collection('users')
var entries = db.collection("entries");
var port = process.env.PORT || 3000;
entries.ensureIndex({date:1}, { w:0 })
// view engine setup
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.locals.cache = "memory"
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Application routes
    routes(app, db);
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

 
app.listen(port);
    console.log('Express server listening on port ' + port);
})//inner connect	

	
module.exports = app;
