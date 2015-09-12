/**
 * @module signer
 * @author qx
 * @date 2015/9/4
 * @function 功能说明
 */

var _ = require( 'underscore' );
var crypto = require( 'crypto' );
var fs   = require( 'fs' );
var querystring = require('querystring');

var Signer = function ( options ) {

	this.algorithm = 'RSA-SHA256';
	this.encoding = 'base64';
	this.privateKey = '-----BEGIN PRIVATE KEY-----\n' +
		'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAKjIqAr4iz/p+tvR\n' +
		'Nc6I7fwbB9C4bAYD0GYcwJD1FTAh21vC78N2HL5RlzrR9AWqFcUv6fqbpSTJP9NU\n' +
		'4OihsSHsWZGWd7khFsNgn/1GzvTKTidZ2cbrtMmA8bv6/Y5GIcws5NqPtPd45uer\n' +
		'eJhsLIH6u7SEqEVLaFv4Vy9DQ2npAgMBAAECgYAAmPU/VLHpgAKLVKpEGOf+xHm6\n' +
		'm2yGeOz7744e9T8l9Hi6Um5W2swvQEqwwp2Ch5+cGxdQ88wZ3TyEmwBQ0oG2A47O\n' +
		'P9AC41eS16/uj6yjbHzAlOqsZ6S/2+NorUgIS+nPyPwaJf5OPo0uVoykNwbb26Qa\n' +
		'tnU4pgVvp9AeJZgEIQJBANwTNQ5fcyasKa1Dn7EIkN3gMfvGJNIdJiArAVMRMtKq\n' +
		'dk24O5WVTF1Ixp4BEoMWkGm5xSf0wLFu24XK4rgTq4cCQQDEVgXHzqw1fkI9im+s\n' +
		'uiTjaF1097EyzScWjLnk7wemGvqCm+wc7tq2vAtH+OL3WWGRDJRCSpKtvkWwl2C5\n' +
		'WfsPAkA5hCuRnhCSQtyBk/LgacSyuC1YB+kHoOad8Z9e/leyByr0FPo9lc9nceW2\n' +
		'1cDo0bTcbNjCII1b0gU9alDmmv1xAkEAg5f8q910Qy5rC4B8NVNWYi2TZlCWLiyf\n' +
		'JFgSSMWFZOn0OhJ0ATh+07fZ/9VrmsoHwQajYINHKLi9UQ1FQTZ0NQJAXNevWjRH\n' +
		'AfWX95y33HQgwPDZeFmPj+Ma+y3zlK/qX+C9wExG8frA328ba1Y+Sd44US4olUed\n' +
		'd4MGgoCsR/3Syw==\n' +
		'-----END PRIVATE KEY-----\n';
	this.certificate = '-----BEGIN PUBLIC KEY-----\n' +
		'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCoyKgK+Is/6frb0TXOiO38GwfQ\n' +
		'uGwGA9BmHMCQ9RUwIdtbwu/Ddhy+UZc60fQFqhXFL+n6m6UkyT/TVODoobEh7FmR\n' +
		'lne5IRbDYJ/9Rs70yk4nWdnG67TJgPG7+v2ORiHMLOTaj7T3eObnq3iYbCyB+ru0\n' +
		'hKhFS2hb+FcvQ0Np6QIDAQAB\n' +
		'-----END PUBLIC KEY-----\n';
	this.signParameterName = 'sign';

	if (typeof options == 'object') {
		utils.extendFrom(this, options);
		if (options.privateKey) {
			this.privateKey = fs.readFileSync( options.privateKey ).toString();
		}
		if (options.certificate) {
			this.certificate = fs.readFileSync( options.certificate ).toString();
		}
	};
};

Signer.prototype.sign = function(data){
	var sign = crypto.createSign( this.algorithm );
	sign.update( data );
	return sign.sign( this.privateKey, this.encoding );
};

Signer.prototype.verify = function(signature, data){
	var verify = crypto.createVerify( this.algorithm );
	verify.update( data );
	return verify.verify( this.certificate, signature, this.encoding );
};

Signer.prototype.signQuery = function(query, returnString) {
	var signString = '',
	    queryObj = query;
	if (typeof queryObj == 'object') {
		signString = this.sign(querystring.stringify(query));
	}
	else {
		signString = this.sign(query);
		queryObj = querystring.parse(query);
	}
	queryObj[this.signParameterName] = signString;
	if (returnString) {
		queryObj = querystring.stringify(queryObj);
	}
	return queryObj;
};

Signer.prototype.verifyQuery = function(query) {
	var signature = '',
		queryObject = query;
	if (typeof query == 'string') {
		queryObject = querystring.parse(query);
	}
	signature = queryObject[this.signParameterName];
	delete queryObject[this.signParameterName];
	return this.verify(signature, querystring.stringify(queryObject));
};

module.exports = Signer;