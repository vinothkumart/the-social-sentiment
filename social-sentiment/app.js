var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Require mongoose, connect and require mongoose models
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/news');
require('./models/Posts');
require('./models/Comments');
require('./models/News');
//require('./models/Tweets');


var News = mongoose.model('News');
var Post = mongoose.model('Post');
// Require APIs
var NewsApi = require('news-api-njs');	//*****
    //config = require('./config');
//var watson = require('watson-developer-cloud');	//******

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

//app.use('/', models);	//************

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

//***********************************************************



//Calling the news api
var heads = new NewsApi({
    apiKey: '367e035b33ac4bb888852c472e20f6ad'
});

heads.getArticles({
    source: 'cnn',
    sortBy: 'top'
}).then(function(req, res, next) {
    var arts = JSON.parse(JSON.stringify(req.articles));
    arts.forEach(function (art) {
        //console.log(art);
        var n = new Post(art);
        n.save(function (err, data) {
            if(err) {
                return next(err);
            }
            console.log(data);
            //res.send(data);
        });
        /*var news_data = {
         author: art.author,
         title: art.title,
         description: art.description,
         url: art.url
         };*/
        //console.log(news_data);

    });
}).catch(function(err) {
    console.log(err);

});

/*//calling the keywords api
 var alchemy_language = watson.alchemy_language({
 api_key: '46fb1b88c58b473b36326e142fdd9f89abefcaa9'
 })

 var parameters = {
 text: 'War in Syria'
 };

 alchemy_language.keywords(parameters, function (err, response) {
 if (err)
 console.log('error:', err);
 else
 console.log(JSON.stringify(response, null, 2));
 });
 */
//************************************************************

module.exports = app;