/* global describe */
/* global it */
'use strict';

var should		= require('should'),
	appRoot		= require('app-root-path'),
	validators 	= require(appRoot + '/lib/validators');
	


describe('#Validator Tests', function() {
	//Test TypeCheck ------------------------------------------------------------------
	it('Should return a message with all matching data types', function(done) {
		var typeInput 	= {"phone": '1234567891'};
		var typeDef	  	= {"phone": {
					"type": "[object String]",
					"require": true
				}
			};
		
		validators.typeCheck(typeInput, "phone", typeDef, [], function(err, res) {
			should.not.exist(err);
			done();
		});
	});
	
	it('Should return an error on mismatched data types', function(done) {
		var typeInput 	= {"phone": '1234567891'};
		var typeDef	  	= {"phone": {
					"type": "[object Number]",
					"require": true
				}
			};
		
		validators.typeCheck(typeInput, "phone", typeDef, [], function(err, res) {
			should.exist(err);
			err.toString().should.equal("Error: The type ([object String]) of phone did not match the definition type [object Number].")
			done();
		});
	});
	
	it('Should return an error on mismatched data types', function(done) {
		var typeInput 	= {"phone": 1234567891};
		var typeDef	  	= {"phone": {
					"type": "[object String]",
					"require": true
				}
			};
		
		validators.typeCheck(typeInput, "phone", typeDef, [], function(err, res) {
			should.exist(err);
			err.toString().should.equal("Error: The type ([object Number]) of phone did not match the definition type [object String].")
			done();
		});
	});
	
	//Test MatchCheck ------------------------------------------------------------------
	it('Should return an error on mismatched regex', function(done) {
		
		var typeInput 	= {"email": "test@test"};
		var typeDef	  	= {"email": {
					"type": "[object String]",
					"require": true,
					"match": "[a-zA-Z0-9_\\.]*@\\.[a-zA-Z0-9]{2,4}"
				}
			};
		
		validators.matchCheck(typeInput, "email", typeDef, function(err, res) {
			should.exist(err);
			err.toString().should.equal("Error: test@test does not match the defined regular expression for email.")
			done();
		});
	});
	
	//Test isNumber ------------------------------------------------------------------
	it('Should validate number input as true', function() {
		var results = validators.isNumber(5121111111);
		results.should.be.ok;
	});
	
	it('Should validate string input as false', function() {
		var results = validators.isNumber('5');
		results.should.be.not.ok;
	});
});