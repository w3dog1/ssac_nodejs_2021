var express = require('express');
var app = express();
var mysql = require( 'mysql' );

var conn = mysql.createConnection({
	user: 'root',
	password: 'ssac()',
	database: 'ssac'
});

app.listen( 8000, function () {
	console.log( conn );
    console.log( "Listening on *:3000" );
});