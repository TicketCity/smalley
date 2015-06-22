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

		//if the filepath is missing the leading /, add it
		if(filePath.charAt(filePath.length - 1) !== '/')
			filePath = filePath + '/';
			
		//if the filepath is missing the trailing /, add it
		if(filePath.charAt(0) !== '/')
			filePath = '/' + filePath;
	
		//get the whole path from app root
		filePath = simplify(appRoot + filePath + '*.json');
		
		//get the files and concatenate the definitions
		glob(filePath, function(err, files) {
			if(err)
				return callback(err);
				
			else {
				//if there are no files, throw error
				if(files.length === 0 || files === null || files === undefined)
					return callback(new Error('No definitions found in the filepath ' + filePath));
				
				else{
					var count = 0; //counter for exiting iterations
					
					//iterate through the files found
					for(var i = 0; i < files.length; i++){
						count++;
						var defs = require(files[i]);
						
						//iterate through all definitions and concatenate into a master definitions obj
						for(var key in defs){
							validationDefinitions[key] = defs[key];
						}
					}
					
					//when all the defs have been read, callback to preVal parallel
					if(count === files.length)
						return callback(null, validationDefinitions);
					
				}
			}
		});
};

var simplify = function(directory) {
	return directory.split('\\').join('/');
};