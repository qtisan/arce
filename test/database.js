/**
 * @module database.js
 * @author qx
 * @date 2015/9/10
 * @function 功能说明
 */

var Database = require('../index').database.Database;

// mysql
var db = new Database({
	host     : '123.57.207.196',
	user     : 'root',
	password : 'toashintel',
	database : 'test'
});

db.query('Select * from testtable', function(){
	console.log(arguments);
});
