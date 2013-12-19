yui-inflection
==============

A port of the underscore inflection library for YUI3

usage:
```

YUI().use('yui-inflection', function(Y){
	var inflector = new Y.Inflection();
	console.log(inflector.pluralize('monkey'); //monkeys
	console.log(inflector.pluralize('miss'); //misses
	console.log(inflector.singularize('misses'); //miss
	console.log(inflector.singularize('miss'); //miss
});
```
