var twit = require("./keys.js");
// console.log(twit.twitterKeys.consumer_key);

var Twitter = require('twitter')
var client = new Twitter({
    consumer_key: twit.twitterKeys.consumer_key,
    consumer_secret: twit.twitterKeys.consumer_secret,
    access_token_key: twit.twitterKeys.access_token_key,
    access_token_secret: twit.twitterKeys.access_token_secret
});
// console.log(client);

function mytweets() {
    var params = { screen_name: 'chumpchange222', count: 20, exclude_replies: true, trim_user: true };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            // console.log(tweets); // The favorites. 
            // console.log(response); // Raw response object.


            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].text + " at " + tweets[i].created_at);
            }
        } else {
            console.log(error);
        }
    });
}
mytweets();