/**
 * @module sqlserver
 * @author qx
 * @date 2015/9/10
 * @function ����˵��
 */

var path = require('path');
var tedious = require('tedious');
var Connection = tedious.Connection,
    Request = tedious.Request,
	TYPES = tedious.TYPES;
var utils = require('./utils');

var SqlServer = function( config ) {
	this.config = config;
	this.config.options.useColumnNames = true;
	this.config.options.rowCollectionOnDone = false;
	this.config.options.rowCollectionOnRequestCompletion = true;
	this.config.schemaRoot = this.config.schemaRoot || path.join(process.cwd(), 'schemas/sqlserver');
	this.models = { };
};

SqlServer.prototype.connect = function( callback ) {

	var sqlConnection = new Connection(this.config);
	var self = this;
	sqlConnection.on('connect', function(err) {

		if (err) {
			sqlConnection = null;
		}
		self.connected = true;

		var close = self.close = function(){
			self.connected = false;
			sqlConnection && sqlConnection.close();
		};

		self._conn = sqlConnection;
		callback(err, sqlConnection, close);

	});

	sqlConnection.on('error', function(err) {
		require('../logger').wrapper('error')(err, __filename);
		self.connected = false;
	});

};

SqlServer.prototype.getConfig = function(){
	return this.config;
};

SqlServer.prototype.query = function(query, callback){

	if (!this._conn) {
		callback(new Error('not connected!'));
	}
	else {
		var request = new Request(query, function(rowCount, more, rows){
			callback(null, rows);
		});
		this._conn.execSql(request);
	}

};

SqlServer.prototype.callProcedure = function (request) {
	this._conn.callProcedure(request);
};

// TODO: Convert `Schema` File to `Model` with operations
SqlServer.prototype.applySchemas = utils.schemasWalkWrapper(function(){
	return true;
});

SqlServer.prototype.getModel = function() {
	return true;
};


module.exports = SqlServer;