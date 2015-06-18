'use strict';
var appRoot		= require('app-root-path'),
	getValDefs	= require('./lib/getValDefs'),
	async		= require('async'),
	unwind		= require('unwinder'),
	validators	= require('./lib/validators');


module.exports.validate = function(input, callback){
		async.waterfall(
			[
				// Get the definitions ----------------------------------------
				function(wfCallback) {
					
					// The preValidation here function simultaneously grabs the definitions from the given folder
					//	and flattens the given object.
					preValidation(input, function(err, results) {
						if(err)
							wfCallback(err);
							
						else
							wfCallback(null, results);
					});
				},
				
				// Run the validation testing --------------------------------
				// Iterates through the object checking for required attributes and types
				function(data, wfCallback){
					validationRunner(data[1], data[0], function(err, results) {
						if(err){
							wfCallback(err);
						}
						else{
							wfCallback(null, results);
						}
					});
				}
			],
				// Send back the results -------------------------------------
				// The success response is just a string indicating that things passed validation.
				function(err, results) {
					if(err){
						callback(err);
					}
					else{
						if (results.length === 0)
							callback(null, "Data was validated.");
						else
							callback(null, "Could not validate " + results.join(", ") + ", but everything else was valid.");
					}	
				}
			);
		
};

// Validation ===========================================================================================
//	Input- data <object>, definitions <object>, callback <function>
//	Output- err <Error>, message <string>
//=======================================================================================================
var validationRunner = function(data, definitions, callback) {
	
	if(definitions === undefined || definitions === null) {
		callback(new Error("No definitions were found at the given file path."));
	}
	
	var noDef = []; //for tracking attributes without definitions

	// look for missing, but required attributes------------------------------------- 
	for(var def in definitions) {
		if(definitions[def].require === true && data[def] === undefined){
			callback(new Error(def + " did not exist, but is a required attribute."));
		}
	}

	// start checking attributes against defs-----------------------------------------------------------
	for(var attr in data) {
		if(definitions === undefined)
			callback(new Error("No definitions file existed at the given path"));	
		
		else if(definitions[attr] !== undefined){	
			async.parallel(
				[
					//Match types to defs
					function(pCallback) {
						validators.typeCheck(data, attr, definitions, noDef, function(err, results) {
							if(err)
								pCallback(err);
	
							else
								pCallback(null, noDef);
	
						});
					},
					//if a regexp is defined, check for matching
					function(pCallback) {
						validators.matchCheck(data, attr, definitions, function(err, results) {
							if(err)
								pCallback(err);
							else
								pCallback(null, results);
						});
					},
					
					function(pCallback) {
						validators.lengthCheck(data, attr, definitions, function(err, results) {
							if(err)
								pCallback(err);
							else
								pCallback(null, results);
						});
					}
				],
				function(err, finished){
					if(err){
						callback(err);
					}
					
					else{
						noDef = finished[0];
						callback(null, finished[0])
					}
				});
		}
		
		else {
			noDef.push(attr);
			callback(null, noDef);
		}
	}	
};



// preValidation  =======================================================================================
//	Input- input<object> (has definitionPath and data attributes)
//	Output- results <array> (results[0] = definitions, results[1] = flattnened object)
//=======================================================================================================
var preValidation = function(input, callback) {
	async.parallel(
		[
			//get the definitions read in
			function(pCallback) {
					getValDefs(input.definitionPath, function(err, foundDefs) {
						if(err)
							pCallback(err);
				
						else
							pCallback(null, foundDefs);
						
					});
				},
			//flatten the object passed in for reading	
			function(pCallback){
				unwind.flatten(input.data, pCallback);
			}
		],
		function(err, res){
			callback(null, res);
		});
}

