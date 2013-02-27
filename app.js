"use strict";

var express = require('express');
var path = require('path');
var kiwi = require('kiwi');
var publicDir = path.join(__dirname, 'public');

var app = express();

app.configure(function(){
	app.set('views', path.join(__dirname, 'view'));
	app.set('port', process.env.PORT || 8080);
	app.set('view engine', 'kiwi');
	this.engine('kiwi', function(filename, options, callback) {
		kiwi.__express(filename, options, function(err, rendered) {
			if(!process.env.production && err){
				console.error(err);
			}
			callback(err, rendered.toString());
		});
	});

	app.use(express.compress());
	app.use(require('less-middleware')({ src: publicDir }));
	app.use(express.favicon());
	app.use(express.static(publicDir));
});
app.configure('development', function(){
	app.use(express.logger());
});


app.get('/', function(req, res){
	res.render('index', {title: 'miwi'});
});

app.get('/decks', function(req, res){
	res.render('decks', {title: 'My decks', decks: [{id: 1, name: 'English', slug: 'english', user_id: 1, description: 'Basic english words', stats: {new: 20, review: 15, again: 3, total: 2600}}, {id: 1, name: 'Heisigs Remember the Kanji (RTK)', slug: 'rtk1', user_id: 1, description: 'Classic book for learning kanji', stats: {new: 2, review: 1, again: 0, total: 2520}}]});
});

app.listen(app.get('port'), function() {
	console.log('Started app on port %d', app.get('port'));
});