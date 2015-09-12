/**
 * @module signer
 * @author qx
 * @date 2015/9/10
 * @function ����˵��
 */

var Signer = require('../index').crypto.Signer;

var signer = new Signer();

var q = {
	count: 5,
	name: '��С��',
	id: 'hJW9wj3KEO2'
};

var signedQ = signer.signQuery(q);

console.log('--------------------------------------');

console.log(signer.verifyQuery(signedQ));




