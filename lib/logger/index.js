/**
 * @module index.js
 * @author qx
 * @date 2015/9/8
 * @function 功能说明
 */
var morgan = require('morgan');
var utils = require('../utils');

module.exports = {

	middleware: function(filename) {
		return morgan( 'combined', {
			stream: fs.createWriteStream(filename, {flags: 'a'}),
			skip:   function ( req, res ) {
				return (
					utils.endBy( req.url, '.js' )
					|| utils.endBy( req.url, '.jpg' )
					|| utils.endBy( req.url, '.png' )
					|| utils.endBy( req.url, '.css' )
					|| utils.endBy( req.url, '.ico' )
				);
			}
		});
	}

};