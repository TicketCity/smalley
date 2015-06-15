'use strict';

//Contains the following validating functions:
//	1. typeCheck
//	2. matchCheck
//	3. lengthCheck
//--------------------------------------------


// TypeCheck ============================================================================================
//	Input- data <object>, defType <string>, callback <function>
//	Output- err <Error>, message <string>
//=======================================================================================================
module.exports.typeCheck  = function(data, attr, definitions, noDef, callback) {
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
module.exports.matchCheck = function(data, attr, definitions, callback) {
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
module.exports.lengthCheck = function(data, attr, definitions, callback) {
	if(definitions[attr].hasOwnProperty("minLength") && definitions[attr].hasOwnProperty("maxLength")){
		if(definitions[attr].minLength > data[attr].length)
			callback(data[attr] + " does not meet the defined minmum length requirements.");
			
		if(definitions[attr].maxLength < data[attr].length)
			callback(data[attr] + " does not meet the defined maximum length requirements.");
	}
	
	else
		callback(null, "Good length");
};
