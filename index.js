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
		Filter: require('./lib/viewModel/filter')
	},
	utils: require('.lib//utils/index')

};