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
require('./models/Keywords');
//require('./models/Tweets');


var News = mongoose.model('News');
var Keywords = mongoose.model('Keyword');
var Post = mongoose.model('Post');

// Require APIs
var NewsApi = require('news-api-njs');	//*****
var watson = require('watson-developer-cloud');	//******
var Twitter = require('twitter');	//*******

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

//clearing all databases
/*News.remove(function (err, removed) {
    if(err) {
        console.log('Error deleting News');
        return (err.message);
    }
    console.log(removed, ' News removed.');
});

Keywords.remove(function (err, removed) {
    if(err) {
        console.log('Error deleting Keywords');
        return (err.message);
    }
    console.log(removed, ' Keywords removed.');
});

Post.remove(function (err, removed) {
    if(err) {
        console.log('Error deleting Post');
        return (err.message);
    }
    console.log(removed, ' Post removed.');
});*/

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
        n.save(function(err, result) {
            if (err) {
                console.log('Error while saving keyword object');
                return (err.message);
            }

            //console.log(result);
            //res.json(comment);
        });
    });
}).catch(function(err) {
    console.log(err);
});


//******Get key and then tweets********
/*var client = new Twitter({
 consumer_key: 'X9mgCBnxIIUmkjObQ2yuoWjm3',
 consumer_secret: 'byV12kv08CeoM3ZMWEMTsBIix1i8zHA55WoBe29IKu474IWhbW',
 access_token_key: '3569379857-vZfRsTngbVMuPuzYwn4qa1kfSoFqORZ5qzxlydG',
 access_token_secret: 'AiYmqtzmRSLrpGBcosxWiia6CAmycHfVD08jeaIkynEAU'
 });*/

var alchemy_language = watson.alchemy_language({
    api_key: '2cef21d3c0cc83a608c987f6a5b80a1717e8499f'
});

var bulletin = Post.find(function (error, set) {
    if(error) {
        console.log('Error while finding news');
        return (error.message);
    }

    //console.log(set);
    set.forEach(function (newspost) {
        //console.log(newspost.title);
        var str = {
            text: newspost.title
        };
        //console.log(str);	//passed

        alchemy_language.keywords(str, function (err, response) {
            if(err) {
                console.log('Error while extracting keywords: ', err);
                return (err.message);
            }

            //console.log(response);
            var keys = JSON.parse(JSON.stringify(response.keywords));

            var searchstring = '';
            keys.forEach(function (word) {
                console.log('Word: ', word);
                searchstring = searchstring.concat("", word.text);
            });

            console.log('Searchstring : ', searchstring);
        });
    });
});


//************************************************************

module.exports = app;