/* global describe */
/* global it */
'use strict';

var should	= require('should'),
	appRoot	= require('app-root-path')

describe('#Smalley Tests', function() {
	
	// Good tests ------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------
	it('Should import the valid file path json', function(done) {
		var smalley 	= require('../smalley');
		var goodInput	= require(appRoot + '/test/testInput/goodData1');
		
		smalley.validate({data: goodInput, definitionPath: 'test/customerDefs'}, function(err, results) {
			should.not.exist(err);
			results.should.equal("Data was validated.");
			done();
		});
	});
	
	it('Should return a message that certain attributes couldn\'t be validated', function(done) {
		var smalley 	= require('../smalley');
		var goodInput	= require(appRoot + '/test/testInput/goodData2');
		
		smalley.validate({data: goodInput, definitionPath: 'test/customerDefs'}, function(err, results) {
			should.not.exist(err);
			results.should.equal("Could not validate dojo, callSign, but everything else was valid.");
			done();
		});
	});
	
	it('Should validate sample sale_created event', function(done) {
		var smalley 	= require('../smalley');
		var goodInput	= require(appRoot + '/test/testInput/goodData4');
		
		smalley.validate({data: goodInput, definitionPath: 'test/eventDefs'}, function(err, results) {
			should.not.exist(err);
			results.should.equal("Data was validated.");
			done();
		});
	});
	
	// Error tests -----------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------
	it('Should return an error with missing required data', function(done) {
		var smalley 	= require('../smalley');
		var badInput	= require(appRoot + '/test/testInput/badData1'); 
		
		smalley.validate({data: badInput, definitionPath: 'test/customerDefs'}, function(err, results) {
			should.exist(err);
			err.toString().should.equal('Error: lastName did not exist, but is a required attribute.');
			done();
		});
	});
	
	it('Should return an error if there were no files at given path', function(done) {
		var smalley 	= require('../smalley');
		var badInput	= require(appRoot + '/test/testInput/badData1'); 
		
		smalley.validate({data: badInput, definitionPath: 'test/'}, function(err, results) {
			should.exist(err);
			err.toString().should.equal('Error: No definitions were found at the given file path.');
			done();
		});
	});
	
});