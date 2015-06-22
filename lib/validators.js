'use strict';

// isNumber =============================================================================================
//	Input- data <object>
//	Output- <boolean>
//=======================================================================================================
var isNumber = function(data) {
	if(typeof data === 'number' && /^-?[\d.]+(?:e-?\d+)?$/.test(data))
		return true;
	else	
		return false;
};
module.exports.isNumber = isNumber;

// TypeCheck ============================================================================================
//	Input- data <object>, defType <string>, callback <function>
//	Output- err <Error>, message <string>
//=======================================================================================================
module.exports.typeCheck  = function(data, attr, definitions, noDef, callback) {
	var classCheck	= {}.toString;	
	if(classCheck.call(data[attr]).toString() !==  definitions[attr].type.toString() 
			|| (definitions[attr].type === '[object Number]' && !isNumber(data[attr]))
			|| (definitions[attr].type === '[object String]' && isNumber(data[attr]))) 
		return callback(new Error("The type (" + classCheck.call(data[attr]).toString() + ") of " + attr + " did not match the definition type " + definitions[attr].type + "."));

	else 
		return callback(null, noDef);
};


// Match ================================================================================================
//	Input- data <object>, attr, definitions<object>, callback <function>
//	Output- err <Error>, message <String>
//=======================================================================================================
module.exports.matchCheck = function(data, attr, definitions, callback) {
		if(definitions[attr].match !== undefined){
			var reg = new RegExp(definitions[attr].match);
			if(reg.test(data[attr]))
				return callback(null, "Matches regexp.");
			else
				return callback(new Error(data[attr] + " does not match the defined regular expression for " + attr +"."));
		}
		
		else
			return callback(null, "No regex to match");
};

// Length ===============================================================================================
//	Input- data <object>, attr, definitions<object>, callback <function>
//	Output- err <Error>, message <String>
//=======================================================================================================
module.exports.lengthCheck = function(data, attr, definitions, callback) {
	if(definitions[attr].hasOwnProperty("minLength") && definitions[attr].hasOwnProperty("maxLength")){
		if(definitions[attr].minLength > data[attr].length)
			return callback(data[attr] + " does not meet the defined minmum length requirements.");
			
		if(definitions[attr].maxLength < data[attr].length)
			return callback(data[attr] + " does not meet the defined maximum length requirements.");
	}
	
	else
		return callback(null, "Good length");
};

