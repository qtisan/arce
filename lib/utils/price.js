/**
 * @module price
 * @author qx
 * @date 2015/9/21
 * @function 功能说明
 */



var Price = function(int, dec, pre){
	this.pre = pre || '¥';
	this.dec = dec || '00';
	this.int = int || 0;
};

Price.prototype.toString = function() {
	return this.pre + this.int + '.' + this.dec;
};

Price.prototype.parse = function(p) {
	var price = Price.parse(p);
	this.pre = price.pre;
	this.int = price.int;
	this.dec = price.dec;
};

Price.parse = function( p ) {

	var pArr = p.toString().split('.');
	var dec = pArr[1];
	if (dec && dec.length) {
		dec = dec.length < 2 ? dec + '0' : dec.substr(0, 2);
	}
	else {
		dec = '00';
	}
	return new Price(pArr[0], dec);
};

module.exports = Price;