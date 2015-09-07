/**
 * @module proxy
 * @author qx
 * @date 2015/9/7
 * @function 功能说明
 */

var wechat = require('wechat');
var RequestProxy = new require('../../utils/requestProxy');
var urllib = require('urllib');

module.exports = {
	handle:
		function(url, token, callback) {
			var process = function(message, req, res, next) {
				var proxy = new RequestProxy(url);
				proxy.post({
					type: 'event',
					message: message
				}, function(err, result){
					if (err) {
						console.log(err);
						res.reply(err);
						next();
					}
					else {
						res.reply(result);
						callback(result, req, res, next);
					}
				});
			};
			return wechat(token, wechat.text(process));
		},

	middleware:
		function(url, token, callback) {
			var process = function(message, req, res, next) {
				urllib.request(url,	{
					method: 'post',
					data: {
						type: 'event',
						message: message
					},
					dataType: 'json'
				}, function(err, result){
					if (err) {
						console.log(err);
						res.reply(err);
						next();
					}
					else {
						res.reply(result);
						callback(result, req, res, next);
					}
				});
			}
			return wechat(token, wechat.text(process));
		}
};

