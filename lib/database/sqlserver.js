/**
 * @module sqlserver
 * @author qx
 * @date 2015/9/10
 * @function 功能说明
 */

var tedious = require('tedious');
var Connection = tedious.Connection,
    Request = tedious.Request,
	TYPES = tedious.TYPES;

var SqlServer = function( config ) {
	this.config = config;
	this.config.options.useColumnNames = true;
	this.rowCollectionOnDone = false;
	this.rowCollectionOnRequestCompletion = true;
};

SqlServer.prototype.connect = function( callback ) {

	var sqlConnection = new Connection(this.config);
	var self = this;
	sqlConnection.on('connect', function(err) {

		if (err) {
			sqlConnection = null;
		}
		var next = function(){
			sqlConnection && sqlConnection.close();
		};

		self._conn = sqlConnection;
		callback(err, sqlConnection, next);

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

module.exports = {};