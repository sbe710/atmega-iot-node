var express = require('express'); 
var bodyParser = require('body-parser');
var routes = require('./routes');
var config = require('./libs/config');
var mongoose = require('./libs/mongoose');

var app = express();
var db = mongoose();

app.use(bodyParser.json());

//ошибка валидации 
app.use((err, req, res, next) => {
	console.log(err.name);
	if (err.name == "ValidationError") {
	    res.send(400, err);
	} else { next(err) }
});

// иная ошибка
app.use((err, req, res, next) => {
	res.send(500, err);
});

var handlers = {
    entities: require('./handlers/entities'),
};

function run() {
    routes.setup(app, handlers);
	app.listen(config.get('port'), () => {
	console.log("App running on port:" + config.get('port'));
	});
}

if (module.parent) {
    module.exports.run = run;
}   else {
    run();
}
