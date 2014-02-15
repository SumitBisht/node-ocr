var express = require('express');

var app = express();
var ncr = require('nodecr');
var path = require('path');
var fs = require('fs');
app.set('view engine', 'jade');

app.configure(function(){
	app.use(express.logger());
	app.use(express.cookieParser('s3cr3t'));
	app.use(express.session());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.bodyParser({keepExtensions:true,uploadDir:path.join(__dirname,'/files')}));
	app.use(express.static(__dirname + '/public'));
});

app.get('/', function(req, res){
	res.render("index");
});

app.post('/process', function(req, res){
	var filePath = req.files.pic.path;
	var text = '';
	ncr.process(filePath, function(error, text){
		if(error){
			console.log('Error occured while parsing image for text: '+error);
			res.redirect('/');
		}
		console.log('Here is the text: '+text);
		res.redirect('/success?text='+text);
	});
});

app.use(app.router);
console.warn('Starting app at port 8080');
app.listen(8080);
