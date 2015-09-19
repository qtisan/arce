/**
 * @module idGenerator
 * @author qx
 * @date 2015/9/19
 * @function 功能说明
 */

var fs = require('fs');
var _ = require('underscore');

var IdGenerator = function(options) {

	this.isLocked = false;
	this.options = _.extend({
		seedFile: './test/seed' + (new Date()).getTime(),
		seedFrequency: 'm', // d, h, m, s, ms
		seedLength: 5
	}, options);
	try {
		this.data = JSON.parse(fs.readFileSync(this.options.seedFile));
	}
	catch (e) {
		this.data = { };
	}
	switch (this.options.seedFrequency) {
		case 'ms':
			this.gap = 1;
			break;
		case 's' :
			this.gap = 1000;
			break;
		case 'm' :
			this.gap = 1000 * 60;
			break;
		case 'h' :
			this.gap = 1000 * 60 * 60;
			break;
		case 'd' :
			this.gap = 1000 * 60 * 60 * 24;
			break;
		default:
			this.gap = 1000;
			break;
	};
	this.data.base = this.data.base || Math.random() * this.gap;
	this.data.seed = parseInt(this.data.seed || '1');
	this.data.time = parseInt(this.data.time || (new Date()).getTime());
};

IdGenerator.prototype.updateSeed = function() {
	while (!this.isLocked) {
		this.isLocked = true;
		var nowTime = (new Date()).getTime();
		if (nowTime - this.data.time > this.gap) {
			this.data.seed = 1;
			this.data.time = nowTime;
		}
		else {
			this.data.seed ++;
		}
		try{
			fs.writeFileSync(this.options.seedFile, JSON.stringify({
				"base": this.data.base,
				"seed": this.data.seed,
				"time": this.data.time
			}));
		}
		catch(e) {
			// TODO: need solutions to rescure!
			console.log('id gen error in saving! ' + e.message);
		}
		this.isLocked = false;
		break;
	}
	return this.data.seed;
};

IdGenerator.prototype.gen = function() {
	var idPre = Math.ceil((new Date()).getTime() / this.data.base).toString(),
	    seedString = this.updateSeed().toString();
	    zerolen = this.options.seedLength - seedString.length,
		zeros = '';
	while (zerolen > 0) {
		zeros = zeros + '0';
		zerolen --;
	}
	return idPre.substr(0, 4) + zeros + idPre.substr(4) + this.data.seed.toString();
};

module.exports = IdGenerator;

