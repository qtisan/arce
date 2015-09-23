/**
 * @module middleware
 * @author qx
 * @date 2015/9/12
 * @function 功能说明
 */

var express = require('express');
var Filter = require('./filter');
var path = require('path');
var fs = require('fs');
var utils = require('../utils');

var DEFAULT_PAGE = 'index';



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
			vm.params = vm.params || { area: DEFAULT_PAGE, part: DEFAULT_PAGE, item: DEFAULT_PAGE };
			vm.params[param] = value;
			vm.filter.apply( param, req, value, function ( err ) {
				next( err );
			} );
		}
	};
}

function renderMiddleware(param, onRender){
	var cb = (typeof param == 'function' ? param : onRender);
	return function(req, res){

		var vmp = res.locals.viewModel.params || { area: DEFAULT_PAGE },
			dir = DEFAULT_PAGE,
			root = dir;
		switch (param) {
			case 'area':
				vmp = vmp['area'];
				break;
			case 'part':
				root = dir = vmp['area'];
				vmp = path.join(vmp['area'], vmp['part']);
				break;
			case 'item':
				dir = path.join(vmp['area'], vmp['part']);
				vmp = path.join(vmp['area'], vmp['part'], vmp['item']);
				break;
			default :
				vmp = DEFAULT_PAGE;
				break;
		}
		var viewPath = res.locals.viewModel.customView || path.join(
			res.locals.viewModel.viewsRoot, vmp
		);

		var render = function() {
			if (req.query._f == 'json') {
				try {
					delete res.locals.viewModel.filter.res;
					delete res.locals.viewModel.filter.locals;
					var json = req.query.target ? res.locals[req.query.target] : res.locals;
					JSON.stringify(json);
					res.json(json);
				}
				catch (e) {
					res.json(e);
				}
			}
			else if (!utils.existView(path.join(process.cwd(), 'views', viewPath), '.hbs')) {
				if (utils.existView(path.join(process.cwd(), 'views', res.locals.viewModel.viewsRoot, dir), '.hbs')) {
					res.render(path.join(res.locals.viewModel.viewsRoot, dir));
				}
				else if (utils.existView(path.join(process.cwd(), 'views', res.locals.viewModel.viewsRoot, root), '.hbs')) {
					res.render(path.join(res.locals.viewModel.viewsRoot, root));
				}
				else {
					res.render(path.join(res.locals.viewModel.viewsRoot, DEFAULT_PAGE));
				}
			}
			else {
				res.render(viewPath);
			}
		};

		if (cb){
			cb(req, res, render);
		}
		else {
			render();
		}
	};
}

module.exports = {
	createRouter: function(onRender){
		var router = express.Router();
		router.use(applyFilterMiddleware('index'));
		router.param('area', applyFilterMiddleware('area'));
		router.param('part', applyFilterMiddleware('part'));
		router.param('item', applyFilterMiddleware('item'));

		router.all('/', renderMiddleware(onRender));
		router.all('/:area', renderMiddleware('area', onRender));
		router.all('/:area/:part', renderMiddleware('part', onRender));
		router.all('/:area/:part/:item', renderMiddleware('item', onRender));

		return router;
	},
	setViewModel: function(viewsRoot, viewModelsRoot){
		return function(req, res, next) {
			res.locals.viewModel = {
				viewsRoot: viewsRoot,
				viewModelsRoot: path.join(process.cwd(), viewModelsRoot),
				filter: new Filter(res),
				handlerPath: '',
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
			res.locals.extra = {

			};
			next();
		};
	}
};