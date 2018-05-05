module.exports.setup = function(app, handlers) {
	var $ = handlers.entities;
	app.post('/', [$.requestTime, $.saveToDb]);
	app.get('/chart/hour', [$.requestTime, $.hour, $.getDocument]);
 	app.get('/chart/day', [$.requestTime, $.day, $.getDocument]);
	app.get('/chart/week', [$.requestTime, $.week, $.getDocument]);
	app.post('/relay/change', [$.lastDoc, $.updateRelayState]);
	app.get('/relay/state', [$.lastDoc, $.lastRelayState, $.checkRelay]);
};
