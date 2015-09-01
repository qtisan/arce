/**
 * @module mysql
 * @author qx
 * @date 2015/8/27
 * @function 功能说明
 */

var mysql = require('mysql');
var _ = require('underscore');

var Connection = function(config) {

	this.config = config;

};

Connection.prototype.connect = function ( callback ) {
	var mysqlConnection = mysql.createConnection(this.config);
	mysqlConnection.connect( function(err) {
		if (err) {
			mysqlConnection = null;
		}
		callback(err, mysqlConnection);
		mysqlConnection && mysqlConnection.end();
	} );
};

Connection.prototype.getConfig = function () {
	return this.config;
};

Connection.prototype.query = function ( query, callback ) {

	this.connect( function(err, connection) {
		err || connection.query(query, callback);
	} );

};

module.exports = Connection;