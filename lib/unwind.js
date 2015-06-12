'use strict';


module.exports = function (obj, callback) {
	var unwound = {};
	traverse(obj, unwound, function(result) {
		callback(result);
	});
	
};

var traverse = function(obj, unwound, callback) {
	var classCheck = {}.toString;
	
	for(var key in obj) {
		//handle sub-objects
		if(classCheck.call(obj[key]).toString() === "[object Object]"){
			unwound[key] = obj[key];
			for(var subKey in obj[key]){
				unwound[subKey] = obj[key][subKey];
			}
		}
		//handle array of items
		else if(classCheck.call(obj[key]).toString() === "[object Array]"){
			unwound[key] = obj[key];
			var array = obj[key];
			for(var i = 0; i < array.length; i++) {
				for (var item in array[i]) {
					unwound[item] = array[i][item];
				}
			}
		}
		else{
			unwound[key] = obj[key];
		}
	}
	callback(unwound);
};
