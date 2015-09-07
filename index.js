/**
 * @module index
 * @author qx
 * @date 2015/8/27
 * @function 功能说明
 */


module.exports = {

	database: {
		Model: require('./lib/database/model')
	},
	viewModel: {
		Page: require('./lib/viewModel/page'),
		Project: require('./lib/viewModel/project'),
		Filter: require('./lib/viewModel/filter'),
		HbsHelper: require('./lib/viewModel/hbsHelper')
	},
	utils: {
		common: require('./lib/utils/index'),
		Interface: require('./lib/utils/interface'),
		underscore: require('underscore'),
		EventProxy: require('eventproxy'),
		moment: require('moment'),
		urllib: require('urllib')
	},
	crypto: {
		MixCrypto: require('./lib/crypto/mixCrypto')
	},
	wechat: {
		api: require('wechat-api'),
		pay: require('wechat-pay'),
		auth: require('wechat-oauth')
	}

};