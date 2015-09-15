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

HbsHelper.prototype.registerSame = function() {
	this.hbs.registerHelper('same', function(exp1, exp2, context) {
		console.log(arguments);
		if (exp1 == exp2) {
			return context.fn(this);
		}
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

module.exports = HbsHelper;