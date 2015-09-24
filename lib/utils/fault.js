/**
 * @module error
 * @author qx
 * @date 2015/9/21
 * @function 功能说明
 */


var logger = require('../logger');

module.exports = {

	errorWrapper: function(err, process, filename, callback){

		var cb = callback,
		    args = [ ];
		if (arguments.length > 4) {
			cb = arguments[arguments.length - 1];
			for (var i = 3; i < arguments.length - 1; i ++) {
				args.push(arguments[i]);
			}
		}
		if (err) {
			logger.wrapper('error')(err.stack, err, filename);
			cb && cb(err);
		}
		else {
			if (process) {
				process.apply(this, [err].concat(args).concat([cb]));
			}
			else {
				cb(err);
			}
		}
	}


};