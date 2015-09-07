/**
 * @module signer
 * @author qx
 * @date 2015/9/4
 * @function 功能说明
 */

var _ = require( 'underscore' ),
    crypto = require( 'crypto' ),
    fs   = require( 'fs' );

var Signer = function ( options ) {

	this.algorithm = 'RSA-SHA256';
	this.encoding = 'base64';
	this.privateKey = '-----BEGIN RSA PRIVATE KEY-----\n' +
		'MIICXAIBAAKBgQC2xMaqm+WlBYsxdLMMZexRIFpsvU/vBodd+M0wXIkSagwl24kz\n' +
		'Qjj6pV6d9QlUNo/BHCxmOzRqknMNNbRR7fVENa3KNaSjxIFPRvU+MQD0wpXQJsRi\n' +
		'ZGtVjYqCeXer73bCW9QdxLb+tqHEgY4Vm0EqB+qLAW2Z0b1u/RP2Gus3gQIDAQAB\n' +
		'AoGAC5Fg0aOUYWF8ceDlBD/fOTNHBeLlkEdlgfkhY5I3ysaThkHi6S+j05lr56t+\n' +
		'r6nUZ3CVDtNoeeZTCd8ATr806sTl4+FKX36TUOMwskwwJWIbTikAbYIhNjpJDmLQ\n' +
		'TA/i++4JgrdtLHYx1nAp7hmavsHKb4zir9UuIWJozQrm6dECQQDfJzMgLYHlxXpc\n' +
		'cNuR5pu87xCTs9Y7uCqeRoqAkotj8qQ/OfCpoC5chb40IP3zNPreZeYg65OJk9RV\n' +
		'scYhphOnAkEA0avRpEL+wa1MvP78XUknwbiBl5hqbWhYY5Vkme7TBIoNwWt41fky\n' +
		'ZZH8zErim+YlAfIrdfh50sev2dsvf5FglwJAaqo0F+dotcnFCTaw3Xabbp3fEJrf\n' +
		'hkArrugNABQMKMQsmkQ5svrr7jHHjudOO9hRKckPTSENrq9IyYVmLWNS9QJBAKrx\n' +
		'ouKBnKLbYA1W9vo3gqp2e3HVWjAJOsc2Lecyx+iThdOEg+gwW95jv+/vvgHNCa8k\n' +
		'ejqccvZeyAieo4MmS9ECQENIglMVJD8x17ZouD6L9XK3EZLOXZ7zG2mY/60qmQG9\n' +
		'ayOhu06+/MlAnH0HD30/qVVzLhURszIYN3zEH/eGPFY=\n' +
		'-----END RSA PRIVATE KEY-----\n';
	this.certificate = '-----BEGIN CERTIFICATE-----\n' +
		'MIIC7jCCAlegAwIBAgIJAORSh35anNQkMA0GCSqGSIb3DQEBCwUAMIGPMQswCQYD\n' +
		'VQQGEwJDTjEQMA4GA1UECAwHSmlhbmdzdTEQMA4GA1UEBwwHTmFuamluZzESMBAG\n' +
		'A1UECgwJSmluaGVUZWNoMRMwEQYDVQQLDApEZXZOYW5qaW5nMQ8wDQYDVQQDDAZM\n' +
		'ZW5ub24xIjAgBgkqhkiG9w0BCQEWE3hxaWFuQGppbmhldGVjaC5jb20wHhcNMTUw\n' +
		'OTA0MDYxMzE0WhcNMTUxMDA0MDYxMzE0WjCBjzELMAkGA1UEBhMCQ04xEDAOBgNV\n' +
		'BAgMB0ppYW5nc3UxEDAOBgNVBAcMB05hbmppbmcxEjAQBgNVBAoMCUppbmhlVGVj\n' +
		'aDETMBEGA1UECwwKRGV2TmFuamluZzEPMA0GA1UEAwwGTGVubm9uMSIwIAYJKoZI\n' +
		'hvcNAQkBFhN4cWlhbkBqaW5oZXRlY2guY29tMIGfMA0GCSqGSIb3DQEBAQUAA4GN\n' +
		'ADCBiQKBgQC2xMaqm+WlBYsxdLMMZexRIFpsvU/vBodd+M0wXIkSagwl24kzQjj6\n' +
		'pV6d9QlUNo/BHCxmOzRqknMNNbRR7fVENa3KNaSjxIFPRvU+MQD0wpXQJsRiZGtV\n' +
		'jYqCeXer73bCW9QdxLb+tqHEgY4Vm0EqB+qLAW2Z0b1u/RP2Gus3gQIDAQABo1Aw\n' +
		'TjAdBgNVHQ4EFgQUiQmF5oYiDStqaFF341ASI2PRu5AwHwYDVR0jBBgwFoAUiQmF\n' +
		'5oYiDStqaFF341ASI2PRu5AwDAYDVR0TBAUwAwEB/zANBgkqhkiG9w0BAQsFAAOB\n' +
		'gQCE2SVxcBZlTqwd/JDwHPWlu73Cb4e5OwrGWSLeJcvRIYXK4dyjg/mjasHjNXA6\n' +
		'TGkW1q1DORuQDPD7A1WT4oHLE6SRrfPn0T8bXKanNletqMuEvDFH+9+Gg/Tef3Ja\n' +
		'+UuOXO4khwLTXzDSXpwn8jU3FsJRPO4GHuWJ3/ZnngOQ4g==\n' +
		'-----END CERTIFICATE-----\n';

	if (typeof options == 'object') {
		utils.extendFrom(this, options);
		if (options.privateKey) {
			this.privateKey = fs.readFileSync( options.privateKey ).toString();
		}
		if (options.certificate) {
			this.certificate = fs.readFileSync( options.certificate ).toString();
		}
	}
};

Signer.prototype.sign = function(data){
	var sign = crypto.createSign( this.algorithm );
	sign.update( data );
	return sign.sign( this.privateKey, 'base64' );
};

Signer.prototype.verify = function(signature, data){
	var verify = crypto.createVerify( this.algorithm );
	verify.update( data );
	return verify.verify( this.certificate, signature, 'base64' );
};

module.exports = Signer;