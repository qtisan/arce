/**
 * @module arce.database.utils
 * @author qx
 * @date 2015/9/15
 * @function MongoDB Utility Functions For Mongoose!
 */

var _ = require('underscore');
var utils = require('../utils');
var EventProxy = require('eventproxy');

module.exports = {

	/**
	 * 查找数组项
	 * @param model
	 * @param query
	 *      {
	 *          name: 'abc',
	 *          addresses: {
	 *              city: 'nanjing'
	 *          }
	 *      }
	 *      result: find address[city='nanjing']
	 * @param callback
	 *      callback(err:Error, subDocument:Array, root:Document)
	 */
	getSubDocs: function(model, query, callback){
		var f = function _me (doc, query, callback, root) {
			var _subQuery = undefined;
			var _subName = undefined;
			if ( !utils.isEmptyObject(query) ){
				for (var i in query) {
					if(query.hasOwnProperty(i) && typeof query[i] == 'object'){
						_subQuery = query[i];
						_subName = i;
						delete query[i];
					}
				}
				if (doc instanceof Array){
					// find by query with the syntax `OR`
					// TODO: maybe for `AND`? the condition field should be set
					var _docs = [ ];
					for (var n in query) {
						if (query.hasOwnProperty(n)) {
							for (var j in doc) {
								if (doc.hasOwnProperty(j) && doc[j][n] == query[n]){
									_docs.push(doc[j]);
								}
							}
						}
					}
					///*
					_docs = _.find(doc, function(docResult){
						var _found = true;
						for (var n in query) {
							if (query.hasOwnProperty(n)) {
								if (docResult[n] == query[n]) {
									_found = false;
								}
							}
						}
						return _found;
					});
					//*/
					// find the first one of the query result in middle
					// TODO: maybe for more? do not with more callback.[multi selection]
					if (_docs.length) {
						if (_subName){
							_me(_docs[0][_subName], _subQuery, callback, root);
						}
						else {
							_docs = _.sortBy(_docs, function(_d){
								return _d._id.toString();
							});
							callback && callback(null, _docs, root);
						}
					}
					else{
						callback && callback(null, _docs, root);
					}
				}
				else{
					doc.findOne(query, function(err, d){
						if (!d) {
							callback && callback(null, [ ]);
						}
						if (_subName) {
							_me(d[_subName], _subQuery, callback, root || d);
						}
						else {
							d = _.sortBy(d, function(_d){
								return _d._id.toString();
							});
							callback && callback(err, d, root);
						}
					});
				}
			}
			else {
				callback && callback(null, doc, root);
			}
		};
		f(model, query, callback);
	}




};