/**
 * @module connectionPool
 * @author qx
 * @date 2015/9/24
 * @function 功能说明
 */

var _ = require('underscore');
var MSSQLConnectionPool = require('tedious-connection-pool');

var Pool = function(options, connectionConfig) {

	this.options = _.extend({
		dbType: 'sqlserver',
		min: 2,
		max: 5,
		log: true,
		idleTimeout: 300000,
		retryDelay: 5000,
		acquireTimeout: 60000
	}, options);

	this.connectionPool = new MSSQLConnectionPool(this.options, connectionConfig);
	this.connectionPool.on('error', function(err){
		console.error(err);
	});

};


Pool.prototype.wrapProcedureRequest = function(callback) {
	this.connectionPool.acquire(callback);
};
