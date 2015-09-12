/**
 * @module index
 * @author qx
 * @date 2015/8/27
 * @function 功能说明
 */


module.exports = {

	database:  {
		Database: require( './lib/database/database' ),
		Model:    require( './lib/database/model' )
	},
	viewModel: {
		Page:       require( './lib/viewModel/page' ),
		Project:    require( './lib/viewModel/project' ),
		Filter:     require( './lib/viewModel/filter' ),
		HbsHelper:  require( './lib/viewModel/hbsHelper' ),
		middleware: require( './lib/viewModel/middleware' )
	},
	utils:     {
		common:     require( './lib/utils/index' ),
		Interface:  require( './lib/utils/interface' ),
		underscore: require( 'underscore' ),
		EventProxy: require( 'eventproxy' ),
		moment:     require( 'moment' ),
		urllib:     require( 'urllib' ),
		base64:     require( 'base64-min' )
	},
	crypto:    {
		MixCrypto: require( './lib/crypto/mixCrypto' ),
		Signer:    require( './lib/crypto/signer' )
	},
	wechat:    {
		api:        require( 'wechat-api' ),
		pay:        require( 'wechat-pay' ),
		auth:       require( 'wechat-oauth' ),
		middleware: require( 'wechat' ),
		proxy:      require( './lib/app/wechat/proxy' ),
		Agent:      require( './lib/app/wechat/agent' ),
		Message:    require( './lib/app/wechat/message' )
	},
	logger:    require( './lib/logger' )

};