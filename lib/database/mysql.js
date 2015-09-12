/**
 * @module mysql
 * @author qx
 * @date 2015/8/27
 * @function 功能说明
 */

var mysql = require('mysql');

var Mysql = function(config) {

	this.config = config;

};

Mysql.prototype.connect = function ( callback ) {
	var mysqlConnection = mysql.createConnection(this.config);
	var self = this;
	mysqlConnection.connect( function(err) {
		if (err) {
			mysqlConnection = null;
		}
		var next = function () {
			mysqlConnection && mysqlConnection.end( function() {
				mysqlConnection = null;
			} );
		};
		self._conn = mysqlConnection;
		callback(err, mysqlConnection, next);
	} );
};

Mysql.prototype.getConfig = function () {
	return this.config;
};

Mysql.prototype.query = function ( query, callback ) {
	if (!this._conn) {
		callback(new Error('not connected!'));
	}
	else {
		this._conn.query(query, callback);
	}
};

Mysql.prototype.getModel = function ( name, callback ) {
	callback();
};

module.exports = Mysql;