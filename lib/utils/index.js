/**
 * @module index.js
 * @author qx
 * @date 2015/8/27
 * @function 功能说明
 */


var fs = require('fs');
var _ = require('underscore');
var path = require('path');
var utils = { };
var moment = require('moment');

utils.readJSON = function( filePath, callback ) {

	filePath.endWith('.json') || (filePath = filePath + '.json');
	filePath = path.join(process.cwd(), filePath);
	fs.readFile(filePath, function( err, data ){
		callback(err, JSON.parse(data));
	});

};

utils.readJSONSync = function( filePath ) {

	filePath.endWith('.json') || (filePath = filePath + '.json');
	filePath = path.join(process.cwd(), filePath);
	var data = fs.readFileSync(filePath);
	return JSON.parse(data);
};

utils.applyAncestor = function( data, rootPath, callback ) {
	if (typeof data.ancestors != 'undefined' && data.ancestors.length) {
		for(var i in data.ancestors) {
			if (data.ancestors.hasOwnProperty(i)) {
				var ancestorData = utils.readJSONSync(path.join(rootPath, data.ancestors[i]));
				utils.applyAncestor(ancestorData, rootPath);
				utils.defaults(data, ancestorData);
			}
		}
	}
};

utils.readJS = function( filePath, callback ) {
	filePath.endWith('.js') || (filePath = filePath + '.js');
	fs.readFile(filePath, function( err, data ){
		callback(err, data);
	});
};

utils.isObject = function(obj) {
	return (typeof obj == 'object') && !(obj instanceof Array);
};

utils.isEmptyObject = function(obj) {
	var _isEmpty = true;
	if (typeof obj == 'object'){
		for ( var i in obj ) {
			if (obj.hasOwnProperty(i)) {
				_isEmpty = false;
				break;
			}
		}
	}
	return _isEmpty;
};

utils.isObjectAll = function() {
	var result = true;
	if (arguments.length == 0) {
		return false;
	}
	for (var i = 0; i < arguments.length; i ++) {
		result = result && utils.isObject(arguments[i]);
	}
	return result;
};

utils.isArrayAll = function() {
	var result = true;
	if (arguments.length == 0) {
		return false;
	}
	for (var i = 0; i < arguments.length; i ++) {
		result = result && (arguments[i] instanceof Array);
	}
	return result;
};

utils.deepClone = function(obj) {
	return JSON.parse(JSON.stringify(obj));
};

utils.deepExtend = function _deepExtend(source, destination, override) {
	for (var attr in source) {
		if (source.hasOwnProperty(attr)) {
			if ( destination.hasOwnProperty(attr) ) {
				if ( utils.isArrayAll(source[attr], destination[attr]) ) {
					for (var index = 0; index < source[attr].length; index ++) {
						destination[attr].push(source[attr][index]);
					}
				}
				else if ( utils.isObjectAll(source[attr], destination[attr]) ) {
					_deepExtend(source[attr], destination[attr]);
				}
				else if ( override ) {
					destination[attr] = source[attr];
				}
			}
			else {
				destination[attr] = source[attr];
			}
		}
	}
};

utils.extendWrapper = function(override) {
	return function(){

		if (arguments.length < 2) {
			return arguments[0];
		}
		var s = arguments[0], d = undefined;
		for (var i = 1; i < arguments.length; i ++) {
			d = utils.deepClone(arguments[i]);
			utils.deepExtend(s, d, override);
			s = d;
		}
		for( var p in s ) {
			if ( s.hasOwnProperty(p) ) {
				arguments[0][p] = s[p];
			}
		}
		return s;

	};
};

utils.extendFrom = function(destination, source){

	for( var i in source ) {
		if (source.hasOwnProperty(i)) {
			destination[i] = source[i];
		}
	}

};

utils.defaultFrom = function(destination, source) {

	for( var i in source ) {
		if (source.hasOwnProperty(i) && !destination.hasOwnProperty(i)) {
			destination[i] = source[i];
		}
	}
};

utils.defaults = utils.extendWrapper(true);
utils.extends = utils.extendWrapper(false);

utils.endBy = function (str, subStr) {
	if (subStr.length > str.length) {
		return false;
	}
	else {
		return (str.lastIndexOf(subStr) == (str.length - subStr.length));
	}
};

utils.dateNow = function(format){
	return moment().format(format);
};

utils.existView = function(viewPath, ext) {
	return fs.existsSync(viewPath + ext) || fs.existsSync(path.join(viewPath, 'index' + ext));
};

utils.resolveRoot = function(dir) {
	return path.join(process.cwd(), dir);
};

module.exports = utils;