'use strict';
var getValDefs	= require('./lib/getValDefs'),
	async		= require('async'),
	unwind		= require('./lib/unwind'),
	validator	= require('validator');


module.exports.validate = function(input, callback){
		async.waterfall(
			[
				// Get the definitions ----------------------------------------
				function(wfCallback) {
					
					// The parallel here function simultaneously grabs the definitions from the given folder
					//	and flattens the given object.
					parallel(input, function(err, results) {
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
							callback(null, "Data was validated.")
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
	var noDef = []; //for tracking attributes without definitions

	// look for missing, but required attributes------------------------------------- 
	for(var def in definitions) {
		if(definitions[def].require === true && data[def] === undefined){
			callback(new Error(def + " did not exist, but is a required attribute."));
		}
	}

	// start type checking -----------------------------------------------------------
	for(var attr in data) {
			
		
		if(definitions[attr] !== undefined){	
			//check type---------------------------------------------
			typeCheck(data, attr, definitions, noDef, function(err, results) {
				if(err)
					callback(err);
				
				else 
					noDef = results;
			});
		}
		
		else {
			noDef.push(attr);
		}
	}
	
	callback(null, noDef);
};


// TypeCheck ============================================================================================
//	Input- attrType <string>, defType <string>, callback <function>
//	Output- err <Error>, message <string>
//=======================================================================================================
var typeCheck = function(data, attr, definitions, noDef, callback) {
	var classCheck	= {}.toString;	
		
	if(classCheck.call(data[attr]).toString() !==  definitions[attr].type.toString()) 
		callback(new Error("The type (" + classCheck.call(data[attr]).toString() + ") did not match the definition type " + definitions[attr].type + "."));

	else
		callback(null, noDef);
}

// Parallel  ============================================================================================
//	Input- input<object> (has definitionPath and data attributes)
//	Output- results <array> (results[0] = definitions, results[1] = flattnened object)
//=======================================================================================================
var parallel = function(input, callback) {
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
				unwind(input.data, function(flatData) {
					pCallback(null, flatData);
				});
			}
		],
		function(err, res){
			callback(null, res);
		});
}