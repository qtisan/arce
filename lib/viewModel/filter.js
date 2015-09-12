/**
 * @module filter
 * @author qx
 * @date 2015/8/29
 * @function 功能说明
 */

var EventProxy = require('eventproxy');

var Filter = function(res) {
	this.res = res;
	this.locals = res.locals;
	this.filters = { };
	this.proxy = new EventProxy();
};

Filter.prototype.register = function(name, proc, filter) {
	if (arguments.length > 2 && typeof filter === 'function') {
		if (!this.filters[name]) {
			this.filters[name] = { };
		}
		this.filters[name][proc] = filter;
	}
};

Filter.prototype.handle = function(handler) {

	for( var name in handler) {
		if (handler.hasOwnProperty(name)) {
			for (var h in handler[name]) {
				if (handler[name].hasOwnProperty(h)) {
					this.register(name, h, handler[name][h]);
				}
			}
		}
	}

};

Filter.prototype.apply = function(name) {
	var callback = arguments[arguments.length - 1];
	if (typeof callback == 'function') {
		var self = this;
		if (this.filters[name]) {
			var endMessage = 'endFilter';
			this.proxy.on(endMessage, function(err){
				callback(err);
			});

			var args = [ ];
			for (var i = 1; i < arguments.length - 1; i ++ ) {
				args.push(arguments[i]);
			}

			var ns = [ ], nextEmits = [ ];
			for (var n in this.filters[name]) {
				if (this.filters[name].hasOwnProperty(n)) {
					ns.push(n);
				}
			}
			ns.forEach(function(n){
				self.proxy.on(n, function(emitNext){
					self.filters[name][n].apply(self.res, args.concat([ emitNext ]));
				});
			});

			var applyNext = function(curr, next) {
				nextEmits[curr] = function(err){
					if (err) {
						self.proxy.emit(endMessage, {
							error: err,
							message: message.message
						});
						console.error(err);
					}
					else {
						if ( curr == endMessage ) {
							self.proxy.emit(curr);
						}
						else {
							self.proxy.emit(curr, nextEmits[next]);
						}
					}
				};
			};

			for (var j = 0; j <= ns.length; j ++) {
				var filterCurrent = ns[ j ] || endMessage;
				var filterNext = ns[ j + 1 ] || endMessage;
				applyNext(filterCurrent, filterNext);
			}

			var first = ns[0] || endMessage,
			    stepNext = ns[1] || endMessage;

			self.proxy.emit(first, nextEmits[ stepNext ]);

		}
		else {
			callback(null);
		}
	}
	else {
		callback(new Error('callback must be a function!'));
	}
};

module.exports = Filter;