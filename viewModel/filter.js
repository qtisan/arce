/**
 * @module filter
 * @author qx
 * @date 2015/8/29
 * @function 功能说明
 */

var EventProxy = require('eventproxy');

var Filter = function(locals) {
	this.locals = locals;
	this.filters = { };
	this.proxy = new EventProxy();
};

Filter.prototype.register = function(name, filter) {
	if (arguments.length > 1 && typeof filter === 'function') {
		if (!this.filters[name]) {
			this.filters[name] = [ filter ];
		}
		else {
			this.filters[name].push(filter);
		}
	}
};

Filter.prototype.handle = function(handler) {

	for( var name in handler) {
		if (handler.hasOwnProperty(name)) {
			for (var i = 0; i < handler[name].length; i ++) {
				this.register(name, handler[name][i]);
			}
		}
	}

};

Filter.prototype.apply = function(name) {
	var callback = arguments[arguments.length - 1];
	if (this.filters[name]) {
		var args = [ ];
		for (var i = 1; i < arguments.length - 1; i ++ ) {
			args.push(arguments[i]);
		}
		this.proxy.after(name, this.filters[name].length, function(){
			callback(null);
		});
		args.push(this.proxy);
		for (var j = 0; j < this.filters[name].length; j ++) {
			this.filters[name][j].apply(this.locals, args);
		}
	}
	else {
		callback(null);
	}
};

module.exports = Filter;