'use strict';
var should 	= require('should');
var appRoot	= require('app-root-path');
var smalley = require(appRoot + '/smalley');

describe('#Pre-Validation Integration testing', function() {
	
	// Test definition getting--------------------------------------------------------------
	it('Should get good definitions path', function(done) {
		var customerInput	= require(appRoot + '/test/testInput/goodData1');
		var input 			= {data: customerInput, definitionPath: "/test/customerDefs/"};
		smalley.preValidation(input, function(err, response) {
			should.not.exist(err);
			done();
		});
	});
	
	it('Should err with bad definitions path', function(done) {
		var customerInput	= require(appRoot + '/test/testInput/goodData1');
		var input 			= {data: customerInput, definitionPath: "/test/noDefs/"};
		smalley.preValidation(input, function(err, response) {
			err.should.not.exist;
			done();
		});
	});
	
});