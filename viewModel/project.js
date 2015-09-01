/**
 * @module project
 * @author qx
 * @date 2015/8/28
 * @function 功能说明
 */


var fs = require('fs');
var _ = require('underscore');
var utils = require('../utils');
var Page = require('./page');
var path = require('path');

var Project = function( slug, rootPath ) {

	if ( typeof slug !== 'string' ) {
		console.error('project slug not correct!');
	}
	rootPath = rootPath || '/data';
	slug = slug || 'root';
	this.projectRoot = path.join(rootPath, slug);

	var _info = utils.readJSONSync(path.join(this.projectRoot, 'meta'));
	_.extendOwn(this, _info);
	this.site = utils.readJSONSync(path.join(this.projectRoot, 'site'));
	this.pageRoot = path.join(this.projectRoot, 'pages');

};


Project.prototype.getPage = function( pagePath, callback ) {

	var _page = new Page(this, pagePath);
	_page.initialize( callback );

};

module.exports = Project;