/**
 * @module arce.database.utils
 * @author qx
 * @date 2015/9/15
 * @function MongoDB Utility Functions For Mongoose!
 */

var _ = require( 'underscore' );
var utils = require( '../utils' );
var EventProxy = require( 'eventproxy' );
var path = require( 'path' );
var fs = require( 'fs' );
var walk = require( 'walk' );

var dbUtils = {};

dbUtils.tediousRowToObject = function ( row ) {
	var result = {};
	for ( var i in row ) {
		if ( row.hasOwnProperty( i ) ) {
			var firstCode = i.charCodeAt( 0 ),
			    name      = i;
			if ( firstCode < 91 && firstCode > 64 ) {
				name = String.fromCharCode( firstCode + 32 ) + i.substr( 1 );
			}
			name = name.replace('ID', 'Id');
			if ( row.hasOwnProperty( i ) ) {
				result[name] = row[i].value;
			}
		}
	}
	return result;
};
dbUtils.tediousRowsToObject = function ( rows ) {
	var results = [];
	rows.forEach( function ( row ) {
		results.push( dbUtils.tediousRowToObject(row) );
	} );
	return results;
};

dbUtils.schemasWalkWrapper = function ( engine, process ) {
	return function () {
		var callback   = typeof arguments[arguments.length - 1] == 'function' ?
			    arguments[arguments.length - 1] : (function () {
		    }),
		    schemaRoot = this.config.schemaRoot;
		if ( typeof arguments[0] == 'function' ) {
			callback = arguments[0];
		}
		else if ( typeof arguments[0] != 'undefined' ) {
			schemaRoot = arguments[0];
		}

		var self = this;
		var walker = walk.walk( schemaRoot, { followLinks: false } );
		walker.on( 'file', function ( root, fileStats, next ) {
			var filepath = path.join( root, fileStats.name );
			var schemaName = path.basename( fileStats.name, '.js' );
			var modelName = '__' +
				path.join(
					path.relative( schemaRoot, root ),
					schemaName
				).replace( /\\/g, '_' ).replace( /\//g, '_' ) +
				'__';

			if ( self.models[modelName] ) {
				console.error( 'the model schema [' + modelName + '] duplicate, see: [' + filepath + '] ! @@' + __filename );
			}
			self.models[modelName] = process.call( engine, schemaName, require( filepath ).schema );

			next();
		} );

		walker.on( 'errors', function ( root, nodeStatsArray, next ) {
			callback( {
				root:           root,
				nodeStatsArray: nodeStatsArray,
			} );
		} );
		walker.on( 'end', function () {
			callback( null, self.models );
			console.log( 'all model schemas loaded!' );
		} );
	}
};

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
dbUtils.getSubDocs = function ( model, query, callback ) {
	var f = function _me ( doc, query, callback, root ) {
		var _subQuery = undefined;
		var _subName = undefined;
		if ( !utils.isEmptyObject( query ) ) {
			for ( var i in query ) {
				if ( query.hasOwnProperty( i ) && typeof query[i] == 'object' ) {
					_subQuery = query[i];
					_subName = i;
					delete query[i];
				}
			}
			if ( doc instanceof Array ) {
				// find by query with the syntax `OR`
				// TODO: maybe for `AND`? the condition field should be set
				var _docs = [];
				for ( var n in query ) {
					if ( query.hasOwnProperty( n ) ) {
						for ( var j in doc ) {
							if ( doc.hasOwnProperty( j ) && doc[j][n] == query[n] ) {
								_docs.push( doc[j] );
							}
						}
					}
				}
				/*
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
				 */
				// find the first one of the query result in middle
				// TODO: maybe for more? do not with more callback.[multi selection]
				if ( _docs.length && _subName ) {
					_me( _docs[0][_subName], _subQuery, callback, root );
				}
				else {
					callback( null, _docs, root );
				}
			}
			else {
				doc.findOne( query, function ( err, d ) {
					if ( !d ) {
						callback( null, [] );
					}
					if ( _subName ) {
						_me( d[_subName], _subQuery, callback, root || d );
					}
					else {
						callback( err, [d], root );
					}
				} );
			}
		}
		else {
			callback( null, doc, root );
		}
	};
	f( model, query, callback );
};


module.exports = dbUtils;