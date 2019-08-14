var fs = require("fs");
var axios = require("axios");
var spotifyPackage = require("node-spotify-api");
var moment = require("moment");
require("dotenv").config();
var keys = require("./keys.js");

var command = process.argv[2];
var searchValue = process.argv.slice(3).join(" ");

switch (command) {
  case "spotify":
  case "Spotify":
  case "Spotif":
    spotifyFunc(searchValue);
    break;

  case "concert":
  case "concerts":
  case "Concert":
  case "Concerts":
    concertsFunc(searchValue);
    break;

  case "movie":
  case "Movie":
  case "Movies":
  case "movies":
    moviesFunc(searchValue);
    break;

  case "do-what-it-says":
  case "Do-what-it-says":

    console.log(" ");
    console.log(" LIRI-BOT: 'Fine, have it your way.' ");
    fs.readFile("./random.txt", "utf8", function (error, data) {
      if (error) {
        return console.log(error);
      }
      spotifyFunc(data);
    })
    break;

  default:
    console.log("  Please enter in the command line: 'spotify','concert',or 'movie' followed by the search value");
    break;

    function spotifyFunc(searchValue) {
      new spotifyPackage(keys.spotify)

        .search({ type: 'track', query: searchValue }, function (err, data) {
          if (err) {
            return console.log('Error occurred: ' + err);
          }

          console.log(" ");
          console.log(" LIRI-BOT: Spotifying!");
          console.log(" ");

          if (data.tracks.items[0].name) (console.log("Your Song Name: " + data.tracks.items[0].name));

          if (data.tracks.items[0].album.name) (console.log("This is Music From: " + data.tracks.items[0].album.name));

          if (data.tracks.items[0].album.artists[0].external_urls.spotify) (console.log("Check out the Artist @ " + data.tracks.items[0].album.artists[0].external_urls.spotify));

          if (data.tracks.items[0].preview_url) (console.log("Listen to a Preview @ " + data.tracks.items[0].preview_url));
        console.log(" ");


        });
    }
    function moviesFunc(searchValue) {

      axios.get(

        "http://www.omdbapi.com/?t=" + searchValue + "&y=&plot=short&apikey=" + (keys.omdb.apikey)

      ).then(function (data) {

        console.log(" ");

        console.log(" LIRI-BOT: Movies!.. Yes!.. Searching!");

        console.log(" ");
        console.log(" LIRI-BOT: I found it! Did you mean?...");
        console.log(" ");


        if (data.data.Title) (console.log(data.data.Title + "."));

        if (data.data.Rated) (console.log("This Movie was Rated " + data.data.Rated + "."));

        if (data.data.Year) (console.log("It was Released in " + data.data.Year + "."));

        if (data.data.Actors) (console.log("It Starred: " + data.data.Actors + "."));

        if (data.data.Language) (console.log(data.data.Language + "."));

        if (data.data.Country) (console.log("Produced in: " + data.data.Country + "."));

        if (data.data.Ratings[1].Source) (console.log("Rotten Tomatoes Gave " + data.data.Title + " a score of " + data.data.Ratings[1].Value + "."));
        console.log(" ");


        if (data.data.Plot) (console.log("The Synopsis: " + data.data.Plot + "."));
        console.log(" ");

      })
        .catch(function (error) {
          if (error.data) {
            console.log(error.data);
          }
        });
    }
    function concertsFunc(searchValue) {

      var concert = axios.get(

        "https://rest.bandsintown.com/artists/" + searchValue + "/events?app_id=codingbootcamp"
      )

        .then(function (data) {

          if (data.data === []) {
            console.log(" Sorry, no upcoming events are listed at this time for " + searchValue);
          }
          console.log(" ");
          console.log(" LIRI-BOT: Finding Concerts!");
          console.log(" ");
          console.log(" LIRI-BOT: Here are the next 4 shows for " + searchValue + ".  ---> (If scheduled)");
        console.log(" ");


          for (let i = 0; i < 4; i++) {

            if (data.data[i].venue) console.log(" Event @ " + data.data[i].venue.name + ".   Venue Located in " + data.data[i].venue.city + " -- " + data.data[i].venue.country + ".");

            if (data.data[i].datetime) (console.log("   Date: " + moment(data.data[i].datetime).format("MM/DD/YYYY")));
        console.log(" ");

          }

        })

        .catch(function (error) {
          if (error.data) {
            console.log(error.data);
          }

        });
    }
}
