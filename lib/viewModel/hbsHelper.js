/**
 * @module hbs
 * @author qx
 * @date 2015/8/28
 * @function 功能说明
 */

var HbsHelper = function(hbs) {
	this.hbs = hbs;
	this.overrides = { };
	this.appends = { };
};

HbsHelper.prototype.registerBlock = function() {

	var self = this;

	this.hbs.registerHelper('override', function(name, context) {
		var block = self.overrides[name];
		if (!block) {
			block = self.overrides[name] = [];
		}
		block.push(context.fn(this));
	});

	this.hbs.registerHelper('append', function(name, context) {
		var block = self.appends[name];
		if (!block) {
			block = self.appends[name] = [];
		}
		block.push(context.fn(this));
	});

	this.hbs.registerHelper('block', function(name, context) {
		var len = (self.overrides[name] || []).length;
		var val = (self.overrides[name] || []).join('\n');
		self.overrides[name] = [];
		var result = undefined;
		if(!len){
			result = context.fn(this);
		}else{
			result = val;
		}
		var appendVal = (self.appends[name] || []).join('\n');
		self.appends[name] = [];
		if (appendVal) {
			result = result + '\n' + appendVal;
		}

		return result;

	});

};

HbsHelper.prototype.registerTernary = function() {
	this.hbs.registerHelper('ternary', function(expression, context){
		return expression ? expression : context.fn(this);
	});
};

HbsHelper.prototype.registerOr = function() {
	this.hbs.registerHelper('or', function(){
		var context = arguments[arguments.length - 1];
		var result = arguments[0];
		for (var i = 1; i < arguments.length - 1; i ++) {
			result = result || arguments[i];
		}
		return (context.fn ? context.fn(this) : '') + result;
	});
};

HbsHelper.prototype.registerSame = function() {
	this.hbs.registerHelper('same', function(exp1, exp2, context) {
		return exp1 == exp2 ? context.fn(this) : '';
	});
};

// TODO: use for sub controls
HbsHelper.prototype.registerCat = function() {
	this.hbs.registerHelper('cat', function(){
		var context = arguments[arguments.length - 1];
		var result = '';
		for (var i = 0; i < arguments.length - 1; i ++) {
			result += arguments[i];
		}
		return (context.fn ? context.fn(this) : '') + result;
	});
}

HbsHelper.prototype.registerJSON = function() {
	this.hbs.registerHelper('JSON', function(JSONString){
		return JSON.parse(JSONString);
	});
};

HbsHelper.prototype.registerTemplate = function(name, template, options) {
	this.hbs.registerHelper('temp_' + name, function() {
		var result = template,
			args = arguments;
		for (var p in options) {
			if (options.hasOwnProperty(p)) {
				var opts = options[p],
					process = options[p].process;
				if (typeof opts == 'object') {
					opts = opts.value;
				}
				var params = opts.match(/\{\d+\}/g );
				if (params != null) {
					params.forEach(function(param){
						var index = parseInt(param.replace(/[\{\}]/g, ''));
						opts = opts.replace(param, args[index] || '');
					});
				}
				if (process) {
					opts = process(opts);
				}
				result = result.replace('{' + p + '}', opts);
			}
		}
		return result;
	});
};

module.exports = HbsHelper;