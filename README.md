
# [Smalley](https://en.wikipedia.org/wiki/Stuart_Smalley)
###### To give your data a checkup from the neckup, and affirmation that your data is valid, it's got everything it needs and, doggone it, people will like it!


----------


### Steps to run:
1. Download/clone the module and put into your node_modules folder
2. `npm run install`
3. Test to make sure everything is loaded correctly: `npm run test`
4. Go!


----------


### Examples
###### look for example definition files in the test/customerDefs or test/eventDefs folders
#### Example Definitions
```javascript
{
	"firstName": {
		"type": "[object String]",
		"require": true,
		"minLength": 3,
		"maxLength": 15
	},
	"email" : {
		"type": "[object String]",
		"require": true,
		"match": "[a-zA-Z0-9_]+@\\.[a-zA-Z0-9_]{2,4}"
	}
	.
	.
	.
}
```

#### Example run
```javascript
var smalley = require('smalley')
var testData = \{data: \{your object to test}, dataDefinition: \'path/to/your/defs\'}
smalley.validate(testData, function(err, res) {
	if(err) 
		...do something with your err
	else
		...do something with success message and enjoy life	
});
```