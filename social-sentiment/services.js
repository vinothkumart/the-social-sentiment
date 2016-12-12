/**
 * Created by kishoresundar on 12/12/16.
 */
//Importing require modules
var express = require('express');
var http = require("http");
var newsapi = require('newsapi');
var watson = require('watson-developer-cloud');
var twitter = require('twitter');
var NewsApi = require('news-api-njs');

//Creating node js server
http.createServer(function(request, response){
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Hello World!!\n');
}).listen(8081);

console.log('Server is running at 8081.');

var services = express();

//Get Trending News
console.log('---------------------------Get News------------------------------')


var news = new NewsApi({
    apiKey: '367e035b33ac4bb888852c472e20f6ad'
});
news.getArticles({
    source: 'cnn',
    sortBy: 'top'
}).then(function(res) {
    console.log(res.articles);
}).catch(function(err) {
    console.log(err);
});



//Keyword Extraction
console.log('-----------------------Keyword Extraction------------------------')

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


//Get Tweets
console.log('---------------------------Get Tweets--------------------------------')
var client = new twitter({
    consumer_key: 'X9mgCBnxIIUmkjObQ2yuoWjm3',
    consumer_secret: 'byV12kv08CeoM3ZMWEMTsBIix1i8zHA55WoBe29IKu474IWhbW',
    access_token_key: '3569379857-vZfRsTngbVMuPuzYwn4qa1kfSoFqORZ5qzxlydG',
    access_token_secret: 'AiYmqtzmRSLrpGBcosxWiia6CAmycHfVD08jeaIkynEAU'
});

client.get('search/tweets', {q: 'Trump'}, function(errors, tweets, response){
    console.log(tweets);
});


//Sentiment Analysis
console.log('-----------------------Sentiment Analysis---------------------------')
var parameters = {
    text: 'War in Syria'
};

alchemy_language.sentiment(parameters, function (err, response) {
    if (err)
        console.log('error:', err);
    else
        console.log(JSON.stringify(response, null, 2));
});
