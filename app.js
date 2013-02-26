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

app.listen(app.get('port'), function() {
	console.log('Started app on port %d', app.get('port'));
});