//-------------------VARIABLES----------------------------------------------------

//Loading modules
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');
var keys = require("./keys.js");
var tweetsArray = [];
var inputCommand = process.argv[2];
var commandParam = process.argv[3];
var defaultMovie = "Ex Machina";
var defaultSong = "Radioactive";



var twitterKeys = keys.twitterKeys;
var tmdbKey = keys.tmdbKey;

var client = new Twitter({
consumer_key: twitterKeys.consumer_key,
consumer_secret: twitterKeys.consumer_secret,
access_token_key: twitterKeys.access_token_key,
access_token_secret: twitterKeys.access_token_secret
});

//-----------------------FUNCTIONS-----------------------------------------------

//This function processes the input commands
function processCommands(command, commandParam){

	//console.log(commandParam);

	switch(command){

	case 'my-tweets':
		getMyTweets(); break;
	case 'spotify-this-song':
		//If user has not specified a song , use default
		if(commandParam === undefined){
			commandParam = defaultSong;
		}     
		spotifyThis(commandParam); break;
	case 'movie-this':
		//If user has not specified a movie Name , use default
		if(commandParam === undefined){
			commandParam = defaultMovie;
		}    
		movieThis(commandParam); break;
	case 'do-what-it-says':
		doWhatItSays(); break;
	default: 
		console.log("Invalid command. Please type any of the following commnds: my-tweets spotify-this-song movie-this or do-what-it-says");
}


}

function getMyTweets(){

	var params = {screen_name: 'jincygeorge8388', count: 20, exclude_replies:true, trim_user:true};
		client.get('statuses/user_timeline', params, function(error, tweets, response) {
				if (!error) {
					//console.log(tweets);
					tweetsArray = tweets;

					for(i=0; i<tweetsArray.length; i++){
						console.log("Created at: " + tweetsArray[i].created_at);
						console.log("Text: " + tweetsArray[i].text);
						console.log('--------------------------------------');
					}
				}
				else{
					console.log(error);
				}
	});

}

function spotifyThis(song){

	//If user has not specified a song , default to "Radioactive" imagine dragons
	if(song === ""){
		song = "Radioactive";
	}

	spotify.search({ type: 'track', query: song}, function(err, data) {
    if (err) {
        console.log('Error occurred: ' + err);
        return;
    }

    var song = data.tracks.items[0];
    console.log("------Artists-----");
    for(i=0; i<song.artists.length; i++){
    console.log(song.artists[i].name);
    }

	console.log(data);

    console.log("------Song Name-----");
    console.log(song.name);

	console.log("-------Preview Link-----");
    console.log(song.preview_url);

    console.log("-------Album-----");
    console.log(song.album.name);

	});

}

function movieThis(movieName){

	console.log(movieName);

	request("https://api.themoviedb.org/3/search/movie?api_key=" + tmdbKey + "&query=" + movieName, function(error, response, body) {

  	// If there were no errors and the response code was 200 (i.e. the request was successful)...
	if (!error && response.statusCode === 200) {

	    //console.log(JSON.parse(body));

	    //Get the Movie ID
		var movieID =  JSON.parse(body).results[0].id;
	    //console.log(movieID);

	    //Create new query using the movie ID
		var queryURL = "https://api.themoviedb.org/3/movie/" + movieID + "?api_key=" + tmdbKey + "&append_to_response=credits,releases";

		request(queryURL, function(error, response, body) {
			var movieObj = JSON.parse(body);

			console.log("--------Title-----------");
			console.log(movieObj.original_title);

			console.log("--------Year -----------");
			console.log(movieObj.release_date.substring(0,4));

			console.log("--------Rating-----------");
			console.log(movieObj.releases.countries[0].certification);

			console.log("--------Country Produced-----------");
			for(i=0, j = movieObj.production_countries.length; i<j; i++){
				console.log(movieObj.production_countries[i].name);
			}
			console.log("--------Languages-----------");
			for(i=0, j = movieObj.spoken_languages.length; i<j; i++){
				console.log(movieObj.spoken_languages[i].name);
			}
			console.log("--------Plot----------------");
			console.log(movieObj.overview);

			console.log("--------Actors-----------");
			for(i=0, j = movieObj.credits.cast.length; i<j; i++){
				console.log(movieObj.credits.cast[i].name);
			}
		});


	}else{
		console.log(error);
	}

	});
}

function doWhatItSays(){
	fs.readFile('random.txt', 'utf8', function(err, data){

		if (err){ 
			return console.log(err);
		}

		var dataArr = data.split(',');

		processCommands(dataArr[0], dataArr[1]);
	});
}



//-------------------------MAIN PROCESS-------------------------------------------

processCommands(inputCommand, commandParam);
