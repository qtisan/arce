/**
 * @module index.js
 * @author qx
 * @date 2015/9/8
 * @function 功能说明
 */
var morgan = require( 'morgan' );
var utils = require( '../utils' );
var fs = require( 'fs' );

var log = function () {
	var filename = ' - @@PATH: ' + arguments[arguments.length - 1],
	    message = arguments[arguments.length - 2],
	    method = arguments[0];
	if (typeof message == 'object' && !(message instanceof Array)) {
		message = JSON.stringify(message);
	}
	else {
		message = message.toString();
	}
	message = ' - @@MSG: ' + message;
	var logString = '';
	for ( var i = 0; i < arguments.length - 2; i++ ) {
		logString += '[|' + arguments[i] + '|] > ';
	}
	if (console.hasOwnProperty(method)) {
		console[method].apply(console, logString + message + filename);
	}
	else {
		console.log(logString + message + filename);
	}
};

var wrapper = function (type) {
	return function() {
		var args = [].slice.call( arguments );
		args = [type].concat( args );
		log.apply( '', args );
	}
};

module.exports = {

	middleware: function ( filename ) {
		return morgan( 'combined', {
			stream: fs.createWriteStream( filename, { flags: 'a' } ),
			skip:   function ( req, res ) {
				return (
				utils.endBy( req.url, '.js' )
				|| utils.endBy( req.url, '.jpg' )
				|| utils.endBy( req.url, '.png' )
				|| utils.endBy( req.url, '.css' )
				|| utils.endBy( req.url, '.ico' )
				);
			}
		} );
	},
	log: log,
	wrapper: wrapper

};