/**
 * @module agent
 * @author qx
 * @date 2015/9/8
 * @function 功能说明
 */

var Message = require('./message');
var utils = require('../../utils');
var EventProxy = require('eventproxy');

var Agent = function() {
	this.handlers = {

	};
	this.groupHandlers = {

	};
};
// 下一步扩展自定义 Message,及 IMessage接口
Agent.prototype.middlewarify = function(isContinue) {
	var self = this;
	return function(req, res, next) {
		var messageContent = req.body;

		var ep = new EventProxy();
		var callback = function(err, result) {
			if (err) {
				console.error('process error width below:');
				console.error(err);
				if (isContinue) {
					next(err);
				}
				else {
					res.json(err);
				}
			}
			else {
				if (isContinue) {
					res.locals.message = result;
					next();
				}
				else {
					res.json(result);
				}
			}
		};

		var message = new Message(messageContent.type, messageContent.groups, messageContent);
		var endEmitMessage = 'endToHandler';

		utils.defaultFrom(self.handlers, message.handlers);
		utils.defaultFrom(self.groupHandlers, message.groupHandlers);

		message.handlers[message.type] = self.handlers[message.type];
		message.groups.forEach(function(g){
			if (!self.groupHandlers.hasOwnProperty(g)) {
				self.groupHandlers[g] = message.groupHandlers.default;
			}
			message.groupHandlers[g] = self.groupHandlers[g];
		});

		var groups = message.groups,
		    groupEmits = { };

		groups.forEach(function(g){
			ep.on(g, function(emitNext){
				message.groupHandlers[g].apply(message, [ emitNext ]);
			});
		});
		ep.on(endEmitMessage, function(){
			if ( typeof message.handlers[message.type] == 'function' ) {
				message.handlers[message.type].apply(
					message, [ callback ]
				);
			}
			else {
				callback(null, message);
			}
		});

		var applyNext = function(g, h) {
			groupEmits[g] = function(err){
				if (err) {
					console.error(err);
					callback({
						error: err,
						message: message.message
					});
				}
				else {
					ep.emit(g, groupEmits[h]);
				}
			};
		};
		for (var i = 0; i <= groups.length; i ++) {
			var groupCurrent = groups[ i ] ? groups[ i ] : endEmitMessage;
			var groupNext = groups[ i + 1 ] ? groups[ i + 1 ] : endEmitMessage;
			applyNext(groupCurrent, groupNext);
		}

		var first = groups[0] || endEmitMessage,
		    stepNext = groups[1] || endEmitMessage;

		ep.emit(first, groupEmits[ stepNext ]);
	};

};

Agent.prototype.addHandler = function(type, handler) {
	this.handlers[type] = handler;
};
Agent.prototype.addHandlers = function( handlers ) {
	if (handlers instanceof Array) {
		var self = this;
		handlers.forEach(function(h) {
			self.addHandler( h.type, h.handler );
		});
	}
};

Agent.prototype.addGroupHandler = function( group, groupHandler ) {
	this.groupHandlers[group] = groupHandler;
};
Agent.prototype.addGroupHandlers = function( groupHandlers ) {
	if (groupHandlers instanceof Array) {
		var self = this;
		groupHandlers.forEach(function(g) {
			self.addGroupHandler( g.group, g.groupHandler );
		});
	}
};

module.exports = Agent;
