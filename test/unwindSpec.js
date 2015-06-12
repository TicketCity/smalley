'use strict';

var should	= 	require('should'),
	appRoot	=	require('app-root-path')

describe('#Unwind Tests', function() {
	it('Should return three objects', function(done) {
		var unwind 		= require(appRoot + '/lib/unwind');
		var testData 	= require(appRoot + '/test/testInput/goodData3'); 
		var expected	= {"address": {"city": "Austin", "zip": "55555"}, 
							"city": "Austin", "zip": "55555", "firstName": "Testy", "lastName": "McTesterson", "phone": "5120001111"}
		unwind(testData, function(result) {
			should.deepEqual(expected, result);
			done();	
		});	
	});
});