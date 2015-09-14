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

router.all('/', renderMiddleware());
router.all('/:area', renderMiddleware('area'));
router.all('/:area/:part', renderMiddleware('part'));
router.all('/:area/:part/:item', renderMiddleware('item'));

function applyFilterMiddleware(param) {
	return function(){
		var req = arguments[0],
		    vm = arguments[1].locals.viewModel,
		    next = arguments[2],
		    value = arguments[3] || '';
		if ( typeof vm !== 'object' ) {
			next(new Error('please use the "setViewModel" function as middleware first!'));
		}
		else {
			vm.handlerPath = path.join(vm.handlerPath, value);
			var handler = { };
			try {
				handler = require( path.join( vm.viewModelsRoot, vm.handlerPath ) );
			}
			catch ( err ) {
				handler = { };
				if (err.code != 'MODULE_NOT_FOUND') {
					handler[param] = {
						error: function(req, route, next){
							next(err);
						}
					};
				}
			}
			vm.filter.handle( handler );
			vm.params = vm.params || { };
			vm.params[param] = value;
			vm.filter.apply( param, req, value, function ( err ) {
				next( err );
			} );
		}
	};
}

function renderMiddleware(param){
	return function(req, res){

		var defaultPage = 'index',
		    vmp = res.locals.viewModel.params || { area: defaultPage };
		switch (param) {
			case 'area':
				vmp = vmp['area'];
				break;
			case 'part':
				vmp = path.join(vmp['area'], vmp['part']);
				break;
			case 'item':
				vmp = path.join(vmp['area'], vmp['part'], vmp['item']);
				break;
			default :
				vmp = defaultPage;
				break;
		}
		if (req.query._f == 'json') {
			res.json(res.locals);
		}
		else {
			res.render(
				path.join(
					res.locals.viewModel.viewsRoot, vmp
				)
			);
		}
	};
}

module.exports = {
	router: router,
	setViewModel: function(viewsRoot, viewModelsRoot){
		return function(req, res, next) {
			res.locals.viewModel = {
				viewsRoot: viewsRoot,
				viewModelsRoot: path.join(process.cwd(), viewModelsRoot),
				filter: new Filter(res),
				handlerPath: ''
			};
			res.locals.page = {
				scripts: [ ],
				styles: [ ],
				title: 'Default Page',
				description: 'It is a default page description!',
				area: {
					name: 'Default Area',
					slug: 'area-slug',
					scripts: [ ],
					styles: [ ],
					favicon: '/assets/favicon.png',
					description: 'It is the area description'
				}
			};
			next();
		};
	}
};