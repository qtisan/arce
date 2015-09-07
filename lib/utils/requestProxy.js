/**
 * @module requestProxy
 * @author qx
 * @date 2015/9/7
 * @function 功能说明
 */


var urllib = require('urllib');

var RequestProxy = function( url ){
	this.requestUrl = url;
};

['get', 'post'].forEach(function(method){
	RequestProxy.prototype[method] = function(data, callback){
		urllib.request(this.requestUrl,	{
			method: method,
			data: data,
			dataType: 'json'
		}, callback);
	}
});

module.exports = RequestProxy;