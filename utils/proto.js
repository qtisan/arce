/**
 * @module proto
 * @author qx
 * @date 2015/8/28
 * @function 功能说明
 */


String.prototype.endWith = function (subStr) {
	if (subStr.length > this.length) {
		return false;
	}
	else {
		return (this.lastIndexOf(subStr) == (this.length - subStr.length));
	}
};