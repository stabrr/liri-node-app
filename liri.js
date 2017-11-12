// var twit = require("./keys.js");




var fs = require("fs");
var proCom = process.argv[2];
var itemSearch = getItem(process.argv);
// console.log("procom: " + proCom + " itemSearch: " + itemSearch);



// console.log(client);

function getItem(input) {
    var search = input[3];

    for (var i = 4; i < input.length; i++) {
        search = search + " " + input[i];
    }
    return search;


}

function spotifySong() {

    var Spotify = require('node-spotify-api');
    if (itemSearch) {
        song = itemSearch
    } else {
        var song = 'The Sign ace of base';
    }
    var spotify = new Spotify({
        id: "793e592050b44db0b0547680bfd99ab8",
        secret: "3ae5dbc139d94ca1b9f19acdaee80c48"
    });
    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        // Artist(s),The song's name,A preview link of the song from Spotify,The album that 
        var songInfo = data.tracks.items[0];
        // console.log(songInfo);
        console.log("Artist: " + songInfo.artists[0].name);
        console.log("Song Name: " + songInfo.name);
        console.log("Spotify link to song: " + songInfo.external_urls.spotify);
        console.log("Albulm: " + songInfo.album.name);
        console.log("\n -------------------------------------------\n");

    });

}

function mytweets() {
    var twit = require("./keys.js");
    var Twitter = require('twitter')
    var client = new Twitter({
        consumer_key: twit.consumer_key,
        consumer_secret: twit.consumer_secret,
        access_token_key: twit.access_token_key,
        access_token_secret: twit.access_token_secret
    });
    var params = { screen_name: 'chumpchange222', count: 20, exclude_replies: true, trim_user: true };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            // console.log(tweets); // The favorites. 
            // console.log(response); // Raw response object.


            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].text + " at " + tweets[i].created_at);
            }
            console.log("\n -------------------------------------------\n");
        } else {
            console.log(error);
        }
    });

}


function getMovie() {
    var request = require("request");
    var movieName = itemSearch;
    if (movieName) {
        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
        request(queryUrl, function(error, response, body) {

            // If the request is successful
            if (!error && response.statusCode === 200) {

                // Parse the body of the site and recover just the imdbRating
                // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
                // console.log(JSON.parse(body));
                var movie = JSON.parse(body)
                console.log(movie.Title);
                console.log(movie.Year);
                console.log(movie.Ratings[0].Source + ": " + movie.Ratings[0].Value);
                console.log(movie.Ratings[1].Source + ": " + movie.Ratings[0].Value);
                console.log(movie.Country);
                console.log(movie.Language);
                console.log(movie.Plot);
                console.log(movie.Actors);
                console.log("\n -------------------------------------------\n");

            }
        });
    } else {
        console.log("If you haven't watched " + '"Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/');
        console.log("It's on Netflix!");
    }

}

function doWhatISay() {
    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");

        // We will then re-display the content as an array for later use.
        proCom = dataArr[0];
        itemSearch = dataArr[1];
        console.log("item 1: " + proCom);
        // console.log("item 2: " + itemSearch);
        whatToDo();
    });
}

function whatToDo() {
    if (proCom === "my-tweets") {
        mytweets();
    } else if (proCom === 'spotify-this-song') {
        spotifySong();
    } else if (proCom === 'movie-this') {
        getMovie();
    } else {
        console.log(proCom + "  in what to do");
        console.log('\n type one of the following: \n my-tweets \n spotify-this-song [optional: song name] \n movie-this [optional: movie name] \n do-what-it-says \n');

    }

}

if (proCom === "do-what-it-says") {
    doWhatISay();
} else {
    whatToDo();
}
// mytweets();
// spotifySong();
// getMovie();
// doWhatISay();
console.log("\n -------------------------------------------");