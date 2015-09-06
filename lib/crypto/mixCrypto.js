/**
 * @module mixCrypto
 * @author qx
 * @date 2015/8/27
 * @function 对称加密方法
 */

var KEY = 'HE_U@28j982';

var crypto = require('crypto');
var _ = require('underscore');

function MixCrypto(options) {
	if (typeof options == 'string')
		options = { key: options };
	options = _.extend({}, {
		key: KEY,
		encoding: {
			input: 'utf8',
			output: 'hex'
		},
		algorithms: ['bf', 'AES-128-CBC']
	}, options);
	this.key = options.key;
	this.inputEncoding = options.encoding.input;
	this.outputEncoding = options.encoding.output;
	this.algorithms = options.algorithms;
}

MixCrypto.prototype.encrypt = function(plainText){
	return _.reduce(this.algorithms, function (memo, a) {
		var cipher = crypto.createCipher(a, this.key);
		return cipher.update(memo, this.inputEncoding, this.outputEncoding)
			+ cipher.final(this.outputEncoding)
	}, plainText, this);
};

MixCrypto.prototype.decrypt = function (encryptedText) {
	try {
		return _.reduceRight(this.algorithms, function (memo, a) {
			var decipher = crypto.createDecipher(a, this.key);
			return decipher.update(memo, this.outputEncoding, this.inputEncoding)
				+ decipher.final(this.inputEncoding);
		}, encryptedText, this);
	} catch (e) {
		logger.error('decrypt error:' + e);
	}
};


exports.MixCrypto = function( options ){
	return new MixCrypto(options);
};

