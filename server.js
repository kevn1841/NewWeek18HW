var express = require("express");
var bodyParser = require("body-parser");
// var expresHandlebars = require("express-handlebars");
var path = require("path");
var app = express();
var request = require('request');
var cheerio = require('cheerio');
// var databaseUrl = "facts";
// var collections = ["fact"];
var mongoose = require('mongoose')
var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:"application/vnd.api+json"}));

// app.engine("handlebars", expresHandlebars({
//     defaultLayout: "index.html"

var Article = require('./models/article.js')
var note = require('./models/note.js')
// }));
// app.set("view engine", "handlebars");

app.use(express.static('public'));

app.listen(PORT, function(){
	console.log("App listening on PORT " + PORT);
});



// var db = mongojs(databaseUrl, collections);
mongoose.connect('mongodb://heroku_lmgwf6mg:2of9j6q0rjtbcpg52b4u2r4rfp@ds033036.mlab.com:33036/heroku_lmgwf6mg');

var db = mongoose.connection;

db.on('error', function(err) {
  console.log('Database Error:', err);
});




db.once('open', function() {
  console.log('Mongoose connection successful.');
});

db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

app.get('/', function(req, res){
	res.sendFile('/public/index.html')
});



app.get('/scrape', function(req, res) {
	// first, we grab the body of the html with request
  request('https://www.reddit.com/r/funfacts/', function(error, response, html) {
  	// then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // now, we grab every h2 within an article tag, and do the following:
    $('a.title').each(function(i, element) {

    		// save an empty result object
				var result = {};

				// add the text and href of every link, 
				// and save them as properties of the result obj
				result.title = $(this).text();

				// using our Article model, create a new entry.
				// Notice the (result):
				// This effectively passes the result object to the entry (and the title and link)
				var entry = new Article (result);

				// now, save that entry to the db
				entry.save(function(err, doc) {
					// log any errors
				  if (err) {
				    console.log(err);
				  } 
				  // or log the doc
				  else {
				    console.log(doc);
				  }
				});


    });
  });
  // tell the browser that we finished scraping the text.
  res.send("Scrape Complete");
});

// app.get('/scrape', function(req, res) {
	
// 	request('https://www.reddit.com/r/funfacts/', function(error, response, html) {

// 		var $ = cheerio.load(html);

// 		$('a.title').each(function(i, element){

// 			var title = $(this).text();

// 			if (title) {

// 				db.fact.save({
//           			title: title
//           		},

//           		function(err, saved) {
// 		          // if there's an error during this query
// 		          if (err) {
// 		            // log the error
// 		            console.log(err);
// 		          } 
// 		          // otherwise, 
// 		          else {
// 		            // log the saved data
// 		            console.log(saved);
// 		          }
// 		        });
// 		      }
// 		    });
// 		  });

// 	// this will send a "search complete" message to the browser
//   res.send("Scrape Complete");
// });

// console.log(module.exports)


app.get('/Articles', function(req, res){
	// grab every doc in the Articles array
	Article.find({}, function(err, doc){
		// log any errors
		if (err){
			console.log(err);
		} 
		// or send the doc to the browser as a json object
		else {
			res.json(doc);
		}
	});
});