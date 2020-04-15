require("dotenv").config();

//vars
var keys = require("./keys.js");
var fs = require("fs");
var request = require ("request");
var Twitter = require("twitter");
var Spotify = require('node-spotify-api');
//creates log txt file
var filename = './log.txt';

//NPM module used to write output to console and log.txt simulatneously
var log= require("simple-node-logger").createSimpleFileLogger(filename);
log.setLevel('all');

// argv[2] chooses users actions; argv[3] is input paramater. ie; movie title
var userCommnad=process.argv[2];
var secondCommand=process.argv[3];

// concatenate multiple words in 2nd user arguement
for (var i = 4; i < process.argv.length; i++) {
    secondCommand+= '+' process.argv[i];
}

// Fetch spotify keys
var spotify = new Spotify(keys.spotify);

//Writes to the log.txt file
var getArtistNames = function(artists) {
    return artists.name;
}

//function for running a spotify search - Command is spotify-this-song
var getSpotify = function (songName) {
    if (songName === undefined) {
    songName = "What's my age again";
}

    spotify.search(
        {
            type:"track",
            query: userCommnand
        },

            function (err, data) {
                if (err) {
                    console.log("Error occurred: " + err);
                    return;
                }

            var songs = data.tracks.item;

            for(var i=0; i <songs.length; i++) {
                console.log(i);
                console.log("artist(s): " + songs[i].artists.map(getArtistNames));
                console.log("song name: " + songs[i].name);
                console.log("preview song: " + songs[i].preview_url);
                console.log("album: " + songs[i].album.name);
                console.log("-----------------------");
            }
        }   
    );

};

//switch command
function mySwitch(userCommnad) {
    // choose which statment (userCommand) to switch to and execute
    switch (userCommnad) {

        case "my-tweets":
            getTweets();
            break;
        case "spotify-this-song":
            getSpotify();
            break;
        case "movie-this":
            getMovie();
            break;
        case "do-what-it-says":
            doWhat();
            break;
    }

    // Twitter - command: my-tweets
    function getTweets() {
        //Fetch Twitter keys
        var client = new Twitter(keys.twitter);
        //set my accoun ot pull tweets from 
        var screenName = { screen_name: 'captnwalker'};
        //get tweets
        client.get('statuses/user_timeline', screenName, function (error,tweets, response) {
            //throw error
            if (error) throw error;
            //loop and log first 20 tweets
            for (var i = 0; i < tweets.length; i++) {
                var date = tweets[i].created_at;
                logOutput("@capnealker: " + tweets[i].text + "Created At: " + date.substring(0, 19));
                logOutput ("-----------------------------------");
            }
        });
    }

    //OMDB Movie - command: movie-this
    funciton getMovie() {

        //OMDB - this movie base code is from class files
        var movieName = secondCommand;
        // Then run a request to the OMDB API with the movie specified
        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&apikey=trilogy";

        request(queryUrl, function (error, response, body) {

            // If the request is successful = 200
            if (!error && response.statusCode === 200) {
                var body = JSON.parse(body);

                //Simultaneously output to console and log.txt via NPM simple-node-logger
                logOutput('================ Movie Info ================');
                logOutput("Title: " + body.Title);
                logOutput("Release Year: " + body.Year);
                logOutput("IMdB Rating: " + body.imdbRating);
                logOutput("Country: " + body.Country);
                logOutput("Language: " + body.Language);
                logOutput("Plot: " + body.Plot);
                logOutput("Actors: " + body.Actors);
                logOutput("Rotten Tomatoes Rating: " + body.Ratings[2].Value);
                logOutput("Rotten Tomatoes URL: " + body.tomatoURL);
                logOutput('==================THE END=================');

            } else {
                //else - throw error
                console.log("Error occurred.")
            }
            //Response if user does not type in a movie title
            if (movieName === "Mr. Nobody") {
                console.log("-----------------------");
                console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
                console.log("It's on Netflix!");
            }
        });
    }


    //Function for command do-what-it-says; reads and splits random.txt file
    //command: do-what-it-says
    function doWhat() {
        //Read random.txt file
        fs.readFile("random.txt", "utf8", function (error, data) {
            if (!error);
            console.log(data.toString());
            //split text with comma delimiter
            var cmds = data.toString().split(',');
        });
    }
}//Closes mySwitch func - Everything except the call must be within this scope

//call switch function
mySwitch(userCommnand);