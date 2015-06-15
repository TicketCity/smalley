/* global describe */
/* global it */
'use strict';

var should	= require('should');

describe('#Get Validation Definition Tests', function() {
	it('Should get valid json files and add it to validationDefinitions object', function(done) {
		var getValDefs	= require('../lib/getValDefs');
		var expected 	= {
							"phone" 	: {	"type" 	: "[object String]", "require"	: true},
							"firstName" : { "type"	: "[object String]", "require" 	: true},
							"lastName" 	: {"type"	: "[object String]", "require"	: true},
							"address"	: {"type"	: "[object Object]", "require" 	: false},
							"city"		: {"type"	: "[object String]", "require"	: false}
						};
		
		getValDefs('/test/customerDefs', function(err, defs) {
			should.not.exist(err);
			should.deepEqual(defs, expected);
			done();
		});
	});
	
	it('Should err with a filepath that has no defs', function(done) {
		var getValDefs	= require('../lib/getValDefs');
		
		getValDefs('test/', function(err, defs) {
			should.exist(err);
			done();
		});
	});
});
