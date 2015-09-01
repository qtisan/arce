/**
 * @module connection
 * @author qx
 * @date 2015/8/27
 * @function 功能说明
 */

var fs = require('fs');
var Interface = require('../interface');
var path = require('path');

var IConnection = new Interface('Connection', [
	'connect',
	'getConfig',
	'query'
]);



var Model = function( dbConfig ) {

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

/*
 * @query: 查询条件
 * @callback: 回调函数
 *      params: err, rows, fields
 */

Model.prototype.query = function( query, callback ) {
	this.connection.query(query, callback);
};


module.exports = Model;