/**
 * @module signer
 * @author qx
 * @date 2015/9/10
 * @function 功能说明
 */

var Signer = require('../index').crypto.Signer;

var signer = new Signer();

var q = {
	count: 5,
	name: '五小坏',
	id: 'hJW9wj3KEO2'
};

var signedQ = signer.signQuery(q);

console.log('--------------------------------------');

console.log(signer.verifyQuery(signedQ));




