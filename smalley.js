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

	// start checking attributes against defs-----------------------------------------------------------
	for(var attr in data) {
			
		
		if(definitions[attr] !== undefined){	
			async.parallel(
				[
					//Match types to defs
					function(pCallback) {
						typeCheck(data, attr, definitions, noDef, function(err, results) {
							if(err)
								pCallback(err);
	
							else
								pCallback(null, noDef);
	
						});
					},
					//if a regexp is defined, check for matching
					function(pCallback) {
						matchCheck(data, attr, definitions, function(err, results) {
							if(err)
								callback(err);
							else
								pCallback(null, results);
						});
					},
					
					function(pCallback) {
						lengthCheck(data, attr, definitions, function(err, results) {
							if(err)
								callback(err);
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


// TypeCheck ============================================================================================
//	Input- data <object>, defType <string>, callback <function>
//	Output- err <Error>, message <string>
//=======================================================================================================
var typeCheck = function(data, attr, definitions, noDef, callback) {
	var classCheck	= {}.toString;	
		
	if(classCheck.call(data[attr]).toString() !==  definitions[attr].type.toString()) {
		callback(new Error("The type (" + classCheck.call(data[attr]).toString() + ") did not match the definition type " + definitions[attr].type + "."));
	}

	else {
		callback(null, noDef);
	}
}

// Match ================================================================================================
//	Input- data <object>, attr, definitions<object>, callback <function>
//	Output- err <Error>, message <String>
//=======================================================================================================
var matchCheck = function(data, attr, definitions, callback) {
		if(definitions[attr].match !== undefined){
			var reg = new RegExp(definitions[attr].match);
			if(reg.test(data[attr]))
				callback(null, "Matches regexp.");
			else
				callback(new Error(data[attr] + " does not match the defined regular expression."));
		}
		
		else
			callback(null, "No regex to match");
};

// Length ===============================================================================================
//	Input- data <object>, attr, definitions<object>, callback <function>
//	Output- err <Error>, message <String>
//=======================================================================================================
var lengthCheck = function(data, attr, definitions, callback) {
	if(definitions[attr].hasOwnProperty("minLength") && definitions[attr].hasOwnProperty("maxLength")){
		if(definitions[attr].minLength > data[attr].length)
			callback(data[attr] + " does not meet the defined minmum length requirements.");
			
		if(definitions[attr].maxLength < data[attr].length)
			callback(data[attr] + " does not meet the defined maximum length requirements.");
	}
	
	else
		callback(null, "Good length");
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
				unwind(input.data, function(flatData) {
					pCallback(null, flatData);
				});
			}
		],
		function(err, res){
			callback(null, res);
		});
}

