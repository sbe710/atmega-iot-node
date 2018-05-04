var mongoose = require('mongoose');
var path = require('path');
var config = require('./config');

mongoose.connect(config.get('mongoose:uri'));
var db = mongoose.connection; 

db.on('error', console.error.bind(console, 'connection error:')
	 ); 
db.once('open', () => { 
	console.log('connection established');
	});

