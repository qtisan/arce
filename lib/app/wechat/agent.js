/**
 * @module agent
 * @author qx
 * @date 2015/9/8
 * @function 功能说明
 */

var Message = require('./message');
var utils = require('../../utils');

var Agent = function() {
	this.handlers = {

	};
};

Agent.prototype.getMiddleware = function(needNext) {
	var self = this;
	return function(req, res, next) {
		var messageContent = req.body;

		var callback = function(err, result) {
			if (err) {
				console.error('process error width below:');
				console.error(err);
				if (needNext) {
					next(err);
				}
				else {
					res.json(err);
				}
			}
			else {
				if (needNext) {
					res.locals.message = result;
				}
				else {
					res.json(result);
				}
			}
		};

		var type = messageContent.type;
		if (!type) {
			callback(new Error('the message needs a property named "type"!'));
		}
		else {
			var message = new Message(messageContent);

			utils.defaultFrom(message, self.handlers);

			if (message.hasOwnProperty(type)) {
				type = 'universal';
			}
			if ( typeof message[type] == 'function' ) {
				message[type].apply(
					message, [ callback ]
				);
			}
			else {
				callback(new Error('handler error!'));
			}
		}
	};

};

Agent.prototype.addHandler = function(type, handler) {
	this.handlers[type] = handler;
};

Agent.prototype.addHandlers = function( handlers ) {
	var self = this;
	handlers.forEach(function(h) {
		self.addHandler( h.type, h.handler );
	});
};

module.exports = Agent;
