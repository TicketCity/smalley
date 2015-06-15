'use strict';

var glob		= require('glob'),
	appRoot		= require('app-root-path'),
	validator	= require('validator');

// getValDefs =====================================================================
// Input- filepath <string>, callback <function>
// Get JSON definitions from file provided via arg
//=================================================================================
module.exports = function(filePath, callback) {
		var validationDefinitions = {};	//the json object to contain all found defs

		if(filePath.charAt(filePath.length - 1) !== '/')
			filePath = filePath + '/';
		
		if(filePath.charAt(0) !== '/')
			filePath = '/' + filePath;
	
		filePath = simplify(appRoot + filePath + '*.json');
		glob(filePath, function(err, files) {
			if(err){
				callback(err);
			}
				
			else {
				if(files.length === 0){
					callback(new Error('No definitions found in the filepath ' + filePath));
				}
				
				else{
					for(var i = 0; i < files.length; i++){
						var defs = require(files[i]);
						for(var key in defs){
							validationDefinitions[key] = defs[key];
						}
					};
					callback(null, validationDefinitions);
				}
			}
		});
};

var simplify = function(directory) {
	return directory.split('\\').join('/');
};