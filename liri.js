// var twit = require("./keys.js"); moved to be used only when calling twitter function
//this program will run four commands per homework assignment
//required global variables
var fs = require("fs");
var proCom = process.argv[2];
var itemSearch = getItem(process.argv);
var outputArray = ["\n-------------------------------------------"];

// this will get the searchItem if one is included or quotes were not used
function getItem(input) {
    //this will assign the value from process.argv[3] if it was in quotes or only one word no need to loop
    var search = input[3];
    //if the movie title or the sone was not in quotes or more than word get the rest and add to search
    for (var i = 4; i < input.length; i++) {
        search = search + " " + input[i];
    }
    //returns the item to search to itemSearch
    return search;
}

//function to search spotify API
function spotifySong() {
    //calls the npm node-spotify-api
    var Spotify = require('node-spotify-api');
    //will assign the song if one was not already
    if (itemSearch) {
        song = itemSearch
    } else {
        var song = 'The Sign ace of base';
    }
    //keys to spotify app
    var spotify = new Spotify({
        id: "793e592050b44db0b0547680bfd99ab8",
        secret: "3ae5dbc139d94ca1b9f19acdaee80c48"
    });
    //search spotify using the npm
    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        // the return information from spotify for the first return
        var songInfo = data.tracks.items[0];
        //output for the results
        outputArray.push("Artist: " + songInfo.artists[0].name);
        outputArray.push("Song Name: " + songInfo.name);
        outputArray.push("Spotify link to song: " + songInfo.external_urls.spotify);
        outputArray.push("Albulm: " + songInfo.album.name);
        // console.log("\n -------------------------------------------\n");
        myOutput();

    });

}
//function for getting my tweets out of twitter
function mytweets() {
    //getting keys and using the twitter npm
    var twit = require("./keys.js");
    var Twitter = require('twitter')
    var client = new Twitter({
        consumer_key: twit.consumer_key,
        consumer_secret: twit.consumer_secret,
        access_token_key: twit.access_token_key,
        access_token_secret: twit.access_token_secret
    });
    //paramaters for getting my tweets
    var params = { screen_name: 'chumpchange222', count: 20, exclude_replies: true, trim_user: true };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            //if no errors loop through tweets and display
            for (var i = 0; i < tweets.length; i++) {
                outputArray.push(tweets[i].text + " at " + tweets[i].created_at);
            }
            myOutput();
            // console.log("\n -------------------------------------------\n");
        } else {
            console.log(error);
        }
    });

}

//function to get movie from omdb using their api and request npm
function getMovie() {
    //get keys and assing the movie to be searched
    var request = require("request");
    var movieName = itemSearch;
    //check to see if ther is a movie to search if there is search if not go to else
    if (movieName) {
        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
        request(queryUrl, function(error, response, body) {

            // If the request is successful
            if (!error && response.statusCode === 200) {
                //if no errors then parse out and display
                var movie = JSON.parse(body)
                outputArray.push(movie.Title);
                outputArray.push(movie.Year);
                outputArray.push(movie.Ratings[0].Source + ": " + movie.Ratings[0].Value);
                outputArray.push(movie.Ratings[1].Source + ": " + movie.Ratings[0].Value);
                outputArray.push(movie.Country);
                outputArray.push(movie.Language);
                outputArray.push(movie.Plot);
                outputArray.push(movie.Actors);
                myOutput();


            }
        });
        //if no movie was given then 
    } else {
        outputArray.push("If you haven't watched " + '"Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/');
        outputArray.push("It's on Netflix!");
        myOutput();
    }

}
//do what it says function reads file using fs and process file
function doWhatISay() {
    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");

        //assign action item and then do it
        proCom = dataArr[0];
        itemSearch = dataArr[1];
        whatToDo();
    });
}
//this function evaluates the commands and then calls the right function if not right info then it will tell what it requires.
function whatToDo() {
    if (proCom === "my-tweets") {
        mytweets();
    } else if (proCom === 'spotify-this-song') {
        spotifySong();
    } else if (proCom === 'movie-this') {
        getMovie();
    } else {
        console.log('\n type one of the following: \n my-tweets \n spotify-this-song [optional: song name] \n movie-this [optional: movie name] \n do-what-it-says \n');

    }

}
//this function is to display output to a file and to the screen
function myOutput() {
    //spent way too much time on this because i was viewing in notepad which does not show new lines 
    //i tried many different ways to display this in a file but this is what i had when i realized i was 
    //opening the file wrong. it still works and is good for display to screen.
    //this will append each time to a file called log.txt
    outputArray.push("------------------------------------------\n");
    var info = "";
    for (i = 0; i < outputArray.length; i++) {
        info = outputArray[i]
        fs.appendFile("./log.txt", info + "\n", 'utf8', function(err) {
            if (err) {
                return console.log(err);
            }
        });
        console.log(info);
    }

}
//checks to see if it is do-what-it-says so it can get the items needed for the whattodo function
if (proCom === "do-what-it-says") {
    doWhatISay();
} else {
    whatToDo();
}