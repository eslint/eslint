---
title: func-name-matching
rule_type: suggestion
---


## Rule Details

This rule requires function names to match the name of the variable or property to which they are assigned. The rule will ignore property assignments where the property name is a literal that is not a valid identifier in the ECMAScript version specified in your configuration (default ES5).

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint func-name-matching: "error"*/

var foo = function bar() {};
foo = function bar() {};
obj.foo = function bar() {};
obj['foo'] = function bar() {};
var obj = {foo: function bar() {}};
({['foo']: function bar() {}});

class C {
    foo = function bar() {};
}
```

:::

::: incorrect

```js
/*eslint func-name-matching: ["error", "never"] */

var foo = function foo() {};
foo = function foo() {};
obj.foo = function foo() {};
obj['foo'] = function foo() {};
var obj = {foo: function foo() {}};
({['foo']: function foo() {}});

class C {
    foo = function foo() {};
}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint func-name-matching: "error"*/
// equivalent to /*eslint func-name-matching: ["error", "always"]*/

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

class C {
    foo = function foo() {};
    baz = function() {};
}

// private names are ignored
class D {
    #foo = function foo() {};
    #bar = function foo() {};
    baz() {
        this.#foo = function foo() {};
        this.#foo = function bar() {};
    }
}

module.exports = function foo(name) {};
module['exports'] = function foo(name) {};
```

:::

::: correct

```js
/*eslint func-name-matching: ["error", "never"] */

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

class C {
    foo = function bar() {};
    baz = function() {};
}

// private names are ignored
class D {
    #foo = function foo() {};
    #bar = function foo() {};
    baz() {
        this.#foo = function foo() {};
        this.#foo = function bar() {};
    }
}

module.exports = function foo(name) {};
module['exports'] = function foo(name) {};
```

:::

## Options

This rule takes an optional string of `"always"` or `"never"` (when omitted, it defaults to `"always"`), and an optional options object with two properties `considerPropertyDescriptor` and `includeCommonJSModuleExports`.

### considerPropertyDescriptor

A boolean value that defaults to `false`. If `considerPropertyDescriptor` is set to true, the check will take into account the use of `Object.create`, `Object.defineProperty`, `Object.defineProperties`, and `Reflect.defineProperty`.

Examples of **correct** code for the `{ considerPropertyDescriptor: true }` option:

::: correct

```js
/*eslint func-name-matching: ["error", { "considerPropertyDescriptor": true }]*/
// equivalent to /*eslint func-name-matching: ["error", "always", { "considerPropertyDescriptor": true }]*/
var obj = {};
Object.create(obj, {foo:{value: function foo() {}}});
Object.defineProperty(obj, 'bar', {value: function bar() {}});
Object.defineProperties(obj, {baz:{value: function baz() {} }});
Reflect.defineProperty(obj, 'foo', {value: function foo() {}});
```

:::

Examples of **incorrect** code for the `{ considerPropertyDescriptor: true }` option:

::: incorrect

```js
/*eslint func-name-matching: ["error", { "considerPropertyDescriptor": true }]*/
// equivalent to /*eslint func-name-matching: ["error", "always", { "considerPropertyDescriptor": true }]*/
var obj = {};
Object.create(obj, {foo:{value: function bar() {}}});
Object.defineProperty(obj, 'bar', {value: function baz() {}});
Object.defineProperties(obj, {baz:{value: function foo() {} }});
Reflect.defineProperty(obj, 'foo', {value: function value() {}});
```

:::

### includeCommonJSModuleExports

A boolean value that defaults to `false`. If `includeCommonJSModuleExports` is set to true, `module.exports` and `module["exports"]` will be checked by this rule.

Examples of **incorrect** code for the `{ includeCommonJSModuleExports: true }` option:

::: incorrect

```js
/*eslint func-name-matching: ["error", { "includeCommonJSModuleExports": true }]*/
// equivalent to /*eslint func-name-matching: ["error", "always", { "includeCommonJSModuleExports": true }]*/

module.exports = function foo(name) {};
module['exports'] = function foo(name) {};
```

:::

## When Not To Use It

Do not use this rule if you want to allow named functions to have different names from the variable or property to which they are assigned.

## Compatibility

* **JSCS**: [requireMatchingFunctionName](https://jscs-dev.github.io/rule/requireMatchingFunctionName)
