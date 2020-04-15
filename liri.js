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
var