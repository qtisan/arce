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
	wechatHandle:
		function(url, token, callback) {
			var process = function(message, req, res, next) {
				message.type = message.type || message.MsgType;
				var proxy = new RequestProxy(url);
				proxy.post(message, function(err, result){
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

	wechatMiddlewarify:
		function(url, token, callback) {
			var process = function(message, req, res, next) {
				message.type = message.type || message.MsgType;
				urllib.request(url,	{
					method: 'post',
					data: message,
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

