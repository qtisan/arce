/**
 * @module mongo
 * @author qx
 * @date 2015/9/7
 * @function 功能说明
 */


var mongoose = require('mongoose');

var Connection = function(config) {

	this.config = config;

};

Connection.prototype.connect = function ( callback ) {

	var connectionString = Connection.generateMongoUrl(this.config);
	mongoose.connect(connectionString, function(err){
		if (err) {
			console.error('connect to %s error: ', connectionString, err.message)
		}
		else {
			console.info('connect to %s succeed!', connectionString);
		}
		var next = function() {
			mongoose.connection.close();
		};
		callback(err, mongoose.connection, next);
	});

};

Connection.prototype.getConfig = function () {
	return this.config;
};

Connection.prototype.query = function ( query, callback ) {

	callback();

};

Connection.prototype.getModel = function ( name, dir ) {

	dir = dir ? dir + '/' + name : name;
	this.config.modelRoot = this.config.modelRoot || __dirname + '/../../../../';
	var modelFile = path.join(this.config.modelRoot, dir + '.js');

	if (fs.existsSync(modelFile)) {
		var schema = require(modelFile).schema;
		if (schema) {
			schema.post('init', function(){

			});
			return mongoose.model(name, schema);
		}
		else {
			console.warn('NO Schema');
			return null;
		}
	}
	else {
		return null;
	}
};

Connection.generateMongoUrl = function (config) {
	config.hostname = (config.hostname || 'localhost');
	config.port = (config.port || 27017);
	config.db = (config.db || 'test');

	if (config.username && config.password) {
		return "mongodb://" + config.username + ":" + config.password + "@" + config.hostname + ":" + config.port + "/" + config.db;
	} else {
		return "mongodb://" + config.hostname + ":" + config.port + "/" + config.db;
	}
};

module.exports = Connection;