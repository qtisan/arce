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

	var self = this;

	this.hbs.registerHelper('ternary', function(expression, context){

		return expression ? expression : context.fn(this);

	});

};

module.exports = HbsHelper;