It is often necessary to capture the current execution context in order to make it available subsequently. A prominent example of this are jQuery callbacks:

```js
var self = this;
jQuery('li').click(function (event) {
	// here, "this" is the HTMLElement where the click event occurred
	self.setFoo(42);
});
```

There are many commonly used aliases for `this` such as `self`, `that` or `me`. It is desirable to ensure that whichever alias the team agrees upon is used consistently throughout the application.


## Rule Details

This rule designates a variable as the chosen alias for "this". It then enforces two things:

 - if a variable with the designated name is declared, it *must* explicitly be assigned the current execution context, i.e. `this`
 - if `this` is explicitly assigned to a variable, the name of that variable must be the designated one


Assuming that alias is `self`, the following patterns are considered warnings:

```js
var self;

var self = 42;

var that = this;
```

The following patterns are considered okay and do not cause warnings:

```js
var self = this;

var that = 42;

var that;
```

### Options

This rule is disabled by default. You can configure the designated `this` variable:

```js
"consistent-this": [0, "self"]
```

## When Not To Use It

If you need to capture nested context, `consistent-this` is going to be problematic. Code of that nature is usually difficult to read and maintain and you should consider refactoring it.
