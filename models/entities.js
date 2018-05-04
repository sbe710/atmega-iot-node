module.exports = function(mongoose) {

	var schema = new mongoose.Schema({
		power: Number,
		temperature: Number,
		humidity: Number,
		relay: Boolean,
		dt: Number
	});
		return mongoose.model('Data', schema);
};