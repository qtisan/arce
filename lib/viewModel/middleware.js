/**
 * @module middleware
 * @author qx
 * @date 2015/9/12
 * @function 功能说明
 */

var express = require('express');
var router = express.Router();
var Filter = require('./filter');
var path = require('path');
var fs = require('fs');
var utils = require('../utils');

router.use(applyFilterMiddleware('index'));
router.param('area', applyFilterMiddleware('area'));
router.param('part', applyFilterMiddleware('part'));
router.param('item', applyFilterMiddleware('item'));

router.all('/', renderMiddleware('index'));
router.all('/:area', renderMiddleware('area'));
router.all('/:area/:part', renderMiddleware('part'));
router.all('/:area/:part/:item', renderMiddleware('item'));

function applyFilterMiddleware(param) {
	return function(){
		var req = arguments[0],
		    vm = arguments[1].locals.viewModel,
		    next = arguments[2],
		    value = arguments[3] || 'index';
		if ( typeof vm !== 'object' ) {
			next(new Error('please use the "setViewModel" function as middleware first!'));
		}
		else {
			try {
				var handler = require( path.join( vm.viewModelsRoot, value ) );
				vm.filter.handle( handler );
				vm.params = vm.params || { };
				vm.params[param] = value;
				vm.filter.apply( param, req, value, function ( err ) {
					next( err );
				} );
			}
			catch ( err ) {
				next( err );
			}
		}
	};
}

function renderMiddleware(param){
	return function(req, res){
		res.render(
			path.join(
				res.locals.viewModel.viewsRoot,
				res.locals.viewModel.params[param]
			)
		);
	};
}

module.exports = {
	router: router,
	setViewModel: function(viewsRoot, viewModelsRoot){
		return function(req, res, next) {
			res.locals.viewModel = {
				viewsRoot: viewsRoot,
				viewModelsRoot: viewModelsRoot,
				filter: new Filter(res)
			};
			next();
		};
	}
};