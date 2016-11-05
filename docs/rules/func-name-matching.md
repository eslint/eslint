# require function names to match the name of the variable or property to which they are assigned (func-name-matching)

## Rule Details

This rule requires function names to match the name of the variable or property to which they are assigned. The rule will ignore property assignments where the property name is a literal that is not a valid identifier in the ECMAScript version specified in your configuration (default ES5).

## Options

This rule takes an optional string of "always" or "never" (when omitted, it defaults to "always"), and an optional options object with one key, `includeCommonJSModuleExports`, and a boolean value. This option defaults to `false`, which means that `module.exports` and `module["exports"]` are ignored by this rule. If `includeCommonJSModuleExports` is set to true, `module.exports` and `module["exports"]` will be checked by this rule.

Examples of **incorrect** code for this rule:

```js
/*eslint func-name-matching: "error"*/

var foo = function bar() {};
foo = function bar() {};
obj.foo = function bar() {};
obj['foo'] = function bar() {};
var obj = {foo: function bar() {}};
({['foo']: function bar() {}});
```

```js
/*eslint func-name-matching: ["error", { "includeCommonJSModuleExports": true }]*/
/*eslint func-name-matching: ["error", "always", { "includeCommonJSModuleExports": true }]*/ // these are equivalent

module.exports = function foo(name) {};
module['exports'] = function foo(name) {};
```

```js
/*eslint func-name-matching: ["error", "never"] */

var foo = function foo() {};
foo = function foo() {};
obj.foo = function foo() {};
obj['foo'] = function foo() {};
var obj = {foo: function foo() {}};
({['foo']: function foo() {}});
```

Examples of **correct** code for this rule:

```js
/*eslint func-name-matching: "error"*/
/*eslint func-name-matching: ["error", "always"]*/ // these are equivalent
/*eslint-env es6*/

var foo = function foo() {};
var foo = function() {};
var foo = () => {};
foo = function foo() {};

obj.foo = function foo() {};
obj['foo'] = function foo() {};
obj['foo//bar'] = function foo() {};
obj[foo] = function bar() {};

var obj = {foo: function foo() {}};
var obj = {[foo]: function bar() {}};
var obj = {'foo//bar': function foo() {}};
var obj = {foo: function() {}};

obj['x' + 2] = function bar(){};
var [ bar ] = [ function bar(){} ];
({[foo]: function bar() {}})

module.exports = function foo(name) {};
module['exports'] = function foo(name) {};
```

```js
/*eslint func-name-matching: ["error", "never"] */
/*eslint-env es6*/

var foo = function bar() {};
var foo = function() {};
var foo = () => {};
foo = function bar() {};

obj.foo = function bar() {};
obj['foo'] = function bar() {};
obj['foo//bar'] = function foo() {};
obj[foo] = function foo() {};

var obj = {foo: function bar() {}};
var obj = {[foo]: function foo() {}};
var obj = {'foo//bar': function foo() {}};
var obj = {foo: function() {}};

obj['x' + 2] = function bar(){};
var [ bar ] = [ function bar(){} ];
({[foo]: function bar() {}})

module.exports = function foo(name) {};
module['exports'] = function foo(name) {};
```

## When Not To Use It

Do not use this rule if you want to allow named functions to have different names from the variable or property to which they are assigned.

## Compatibility

* **JSCS**: [requireMatchingFunctionName](http://jscs.info/rule/requireMatchingFunctionName)
