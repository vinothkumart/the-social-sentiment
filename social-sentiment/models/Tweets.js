var mongoose = require('mongoose');

var TweetSchema = new mongoose.Schema({
    text: String,
	username: String,	    
    post: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});

mongoose.model('Tweet', TweetSchema);