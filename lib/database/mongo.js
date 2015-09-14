/**
 * @module mongo
 * @author qx
 * @date 2015/9/7
 * @function 功能说明
 */


var mongoose = require('mongoose');
var path = require('path');
var fs = require('fs');
var walk = require('walk');

var Mongo = function(config) {

	this.config = config;
	this.models = { };
	this.config.schemaRoot = this.config.schemaRoot || path.join(process.cwd(), 'schemas');

};

Mongo.prototype.connect = function ( callback ) {

	var connectionString = Mongo.generateMongoUrl(this.config);
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

Mongo.prototype.getConfig = function () {
	return this.config;
};

Mongo.prototype.query = function ( query, callback ) {

	callback();

};

Mongo.prototype.getModel = function ( name, dir ) {

	dir = dir ? dir + '/' + name : name;
	var modelFile = path.join(this.config.schemaRoot, dir + '.js');

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

Mongo.prototype.applySchemas = function(){
	var callback = typeof arguments[arguments.length - 1] == 'function' ?
		    arguments[arguments.length - 1] : (function(){}),
		schemaRoot = this.config.schemaRoot;
	if (typeof arguments[0] == 'function') {
		callback = arguments[0];
	}
	else if (typeof arguments[0] != 'undefined') {
		schemaRoot = arguments[0];
	}

	var self = this;
	var walker = walk.walk(schemaRoot, { followLinks: false });
	walker.on('file', function(root, fileStats, next) {
		var filepath = path.join(root, fileStats.name);
		var schemaName = path.basename(fileStats.name, '.js');
		var modelName = '__' +
			path.join(
				path.relative(schemaRoot, root ),
				schemaName
			).replace(/\\/g, '_' ).replace(/\//g, '_') +
			'__';

		if (self.models[modelName]) {
			console.error('the model schema [' + modelName + '] duplicate, see: [' + filepath + '] !' + __filename);
		}
		self.models[modelName] = mongoose.model(schemaName, require(filepath ).schema);

		next();
	});

	walker.on('errors', function(root, nodeStatsArray, next){
		callback({
			root: root,
			nodeStatsArray: nodeStatsArray,
		});
	});
	walker.on('end', function(){
		callback(null, self.models);
		console.log('all model schemas loaded!');
	});
};

Mongo.generateMongoUrl = function (config) {
	config.host = (config.host || 'localhost');
	config.port = (config.port || 27017);
	config.db = (config.db || 'test');

	if (config.user && config.password) {
		return "mongodb://" + config.user + ":" + config.password + "@" + config.host + ":" + config.port + "/" + config.db;
	} else {
		return "mongodb://" + config.host + ":" + config.port + "/" + config.db;
	}
};

module.exports = Mongo;