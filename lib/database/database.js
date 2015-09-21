/**
 * @module connection
 * @author qx
 * @date 2015/8/27
 * @function 功能说明
 */

var fs = require('fs');
var Interface = require('../utils/interface');
var path = require('path');
var EventProxy = require('eventproxy');

var IConnection = new Interface('Connection', [
	'connect',
	'getConfig',
	'query',
	'getModel'
]);



var Database = function( dbConfig ) {

	this.config = dbConfig;

	var file = path.join(__dirname, dbConfig.dbType + '.js');

	if (fs.existsSync(file)) {
		var Connection = require('./' + dbConfig.dbType);
		Interface.ensureImplements(Connection, IConnection);
		this.connection = new Connection(this.config);
	}
	else {
		throw new Error('file not found with the database: ['+dbConfig.dbType+']!');
	}

};

Database.prototype.connect = function(callback){
	var conn = this.connection;
	var self = this;
	if (!this.connection.connected) {
		conn.connect(function(err, innerConnection, close){
			if (!err) {
				self.connection.connected = true;
			}
			callback(err, innerConnection, close);
			//			do sth end
			//			next(err);
		});
	}
	else {
		callback(null, this.connection, this.connection.close);
	}
};

Database.connectWrapper = function(proc) {
	return function() {
		var self = this,
		    args = [].slice.apply(arguments),
			callback = arguments[arguments.length - 1];
		this.connect(function(err, conn, close) {
			if (!err) {
				proc.apply(self, args.concat([conn, close]));
			}
			else {
				callback(err);
			}
		});
	};
};

/*
 * @query: 查询条件
 * @callback: 回调函数
 *      params: err, rows, fields
 */
Database.prototype.query = Database.connectWrapper(function(query, callback, conn, close){
	this.connection.query(query, callback);
});
Database.prototype.callProcedure = Database.connectWrapper(function(query, conn, close){
	this.connection.callProcedure(query);
});

Database.prototype.getModel = Database.connectWrapper(function( name, dir, callback ){
	callback(null, this.connection.getModel(name, dir));
});

// TODO: wrapped
Database.prototype.getModelSync = function( name, dir ) {
	var conn = this.connection;
	var self = this;
	if (!this.connection.connected) {
		conn.connect(function(err, innerConnection, close){
			if (!err) {
				self.connection.connected = true;
				I('connected', __filename);
			}
		});
		E('trying to getModel [' + dir + '/' + name + '], but not connect, try connecting...', __filename );
	}
	else {
		return this.connection.getModel(name, dir);
	}
};

Database.prototype.applySchemas = function() {
	var self = this,
	    schemaRoot = arguments[0],
		callback = arguments[1];
	if (!callback && typeof arguments[0] == 'function') {
		callback = arguments[0];
		schemaRoot = undefined;
	}
	this.connection.applySchemas(schemaRoot, function(err, models) {
		self.models = models;
		callback(err, models);
		err && E(err, __filename);
	});
};

module.exports = Database;

