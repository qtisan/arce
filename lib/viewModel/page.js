/**
 * @module page
 * @author qx
 * @date 2015/8/28
 * @function 功能说明
 */

var utils = require('../utils/index');
var _ = require('underscore');
var EventProxy = require('eventproxy');
var path = require('path');

var Page = function( project, pagePath ) {

	var pageObj = utils.readJSONSync(path.join(project.pageRoot, pagePath));
	if( typeof pageObj.ancestors != 'undefined' && pageObj.ancestors.length ) {
		for (var i in pageObj.ancestors) {
			if (pageObj.ancestors.hasOwnProperty(i)) {
				var _page = new Page(project, pageObj.ancestors[i]);
				utils.defaults(this, _page);
			}
		}
	}
	utils.extends(this, pageObj);
	this.project = project;
	this.name = pagePath.replace('/', '-');

};

Page.prototype.initialize = function( callback ) {

	var ep = new EventProxy();
	this.error = null;
	var that = this;

	ep.after('widget', this.widgets.length, function(){
		callback(null, that);
	});

	/******************* widgets **********************/
	this.widget = { };

	for(var i in this.widgets) {
		if (this.widgets.hasOwnProperty(i)) {

			this.addWidget(this.widgets[i], ep.done('widget'));

		}
	}

};

Page.prototype.addWidget = function( widget, callback ) {

	if (widget) {

		var that = this;
		utils.readJSON(path.join(this.project.projectRoot, widget.data) , function(err, widgetData){
			utils.applyAncestor(widgetData, that.project.projectRoot);
			that.widget[widget.id] = widgetData;
			that.widget[widget.id].id = widget.id;
			callback(err, widgetData);
		});

	}
	else {
		callback(null);
	}

};

module.exports = Page;