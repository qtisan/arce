/**
 * @module processor
 * @author qx
 * @date 2015/9/9
 * @function 功能说明
 */

var uuid = require( 'uuid' );
var base64 = require( 'base64-min' );
var Message = function ( message ) {

	this.messageId = base64.encodeWithKey(uuid.v1(), 'ARCE_WECHAT');
	this.message = message || {};

	this.universal = function ( callback ) {

		callback( null, {
			status:        1,
			message:       'In Common Process...',
			originMessage: this.message
		} );

	};

};

module.exports = Message;