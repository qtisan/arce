/**
 * @module processor
 * @author qx
 * @date 2015/9/9
 * @function 功能说明
 */

var uuid = require( 'uuid' );
var base64 = require( 'base64-min' );
var Message = function ( type, groups, message ) {

	this.messageId = base64.encodeWithKey(uuid.v1(), 'ARCE_WECHAT');
	this.type = type || 'universal';

	if (groups instanceof Array) {
		this.groups = groups;
	}
	else {
		this.groups = [ ];
	}

	this.message = message || { };
	this.handlers = {
		universal: function ( callback ) {

			callback( null, {
				status:        1,
				message:       'In Common Process...',
				originMessage: this.message
			} );

		}
	};
	this.groupHandlers = {
		default: function(next) {
			console.log('it is in default!');
			next();
		}
	};
	this.locals = {

	};

};

module.exports = Message;