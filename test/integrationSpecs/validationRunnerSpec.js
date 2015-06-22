'use strict';
var should 	= require('should');
var appRoot	= require('app-root-path');
var smalley = require(appRoot + '/smalley');

describe('#Validation Runner Integration testing', function() {
	
	it('Should validate good input and definitions', function(done) {
		var customerInput	= require(appRoot + '/test/testInput/goodData1');
		var customerDef		= require(appRoot + '/test/customerDefs/validDefs2');
		smalley.validationRunner(customerInput, customerDef, function(err, response) {
			should.not.exist(err);
			response.length.should.equal(0);
			done();
		});
	});
	
	
	it('Should return a message with unvalidated attributes', function(done) {
		var customerInput	= require(appRoot + '/test/testInput/goodData2');
		var customerDef		= require(appRoot + '/test/customerDefs/validDefs2');
		smalley.validationRunner(customerInput, customerDef, function(err, response) {
			should.not.exist(err);
			response.toString().should.equal(['dojo', 'callSign'].toString());
			done();
		});
	});
	
	it('Should return an error for mismatched types Number~String', function(done) {
		
		var customerInput	= require(appRoot + '/test/testInput/badData2');
		var typeInput 	= {"phone": 1234567891};
		var typeDef	  	= {"phone": {
					"type": "[object String]",
					"require": true
				}
			};
		smalley.validationRunner(typeInput, typeDef, function(err, response) {
			err.should.exist;
			err.toString().should.equal('Error: The type ([object Number]) of phone did not match the definition type [object String].');
			done();
		});
	});
	
	it('Should return an error for mismatched types String~Number', function(done) {
		
		var customerInput	= require(appRoot + '/test/testInput/badData2');
		var typeInput 	= {"phone": "1234567891"};
		var typeDef	  	= {"phone": {
					"type": "[object Number]",
					"require": true
				}
			};
		smalley.validationRunner(typeInput, typeDef, function(err, response) {
			err.should.exist;
			err.toString().should.equal('Error: The type ([object String]) of phone did not match the definition type [object Number].');
			done();
		});
	});
	
});