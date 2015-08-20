# Limit minimum and maximum length for identifiers (id-length)

Very short identifier names like `e`, `x`, `_t` or very long ones like `hashGeneratorResultOutputContainerObject` usually make the code harder to read and potentially less maintainable. To prevent this, one may enforce a minimum and/or maximum identifier length. (usually min 2-chars)

```js
// id-length: 1  // default is minimum 2-chars ({ min: 2})
var x = 5; // too short
```

## Rule Details

This rule is aimed at increasing code readability and maintainability by enforcing an identifier length convention. It will warn on any type of identifier which doesn't conform to length limits (upper and lower).

It allows the programmers to silently by-pass this check by using "quoted" property names or calculated property access to allow potential server-side data requirements.

The following patterns are considered warnings:

```js
// id-length: 1  // default is minimum 2-chars ({ min: 2})

var x = 5;

obj.e = document.body;

var handler = function (e) { /* do stuff */ };

try {
    dangerousStuff();
} catch (e) {  // Identifier 'e' is too short. (< 2)
    // ignore as many do
}

var myObj = { a: 1 };  // Identifier 'a' is too short. (< 2)

(a) => { a * a };  // Identifier name 'a' is too short. (< 2)

function foo(x = 0) { }  // Identifier name 'x' is too short. (< 2)

class x { }  // Identifier name 'x' is too short. (< 2)

class Foo { x() {} }  // Identifier name 'x' is too short. (< 2)

function foo(...x) { }  // Identifier name 'x' is too short. (< 2)

var { x} = {};  // Identifier name 'x' is too short. (< 2)

var { x: a} = {};  // Identifier name 'x' is too short. (< 2)

var { a: [x]} = {};  // Identifier name 'a' is too short. (< 2)

import x from 'y';  // Identifier name 'x' is too short. (< 2)

export var x = 0;  // Identifier name 'x' is too short. (< 2)

({ a: obj.x.y.z }) = {};  // Identifier name 'a' is too short. (< 2)
                          // Identifier name 'x' is too short. (< 2)

({ prop: obj.x }) = {};  // Identifier name 'x' is too short. (< 2)

```

The following patterns are not considered warnings:

```js
// id-length: 1  // default is minimum 2-chars ({ min: 2})

var num = 5;

function _f() { return 42; }

function _func() { return 42; }

obj.el = document.body;

var handler = function (evt) { /* do stuff */ };

try {
    dangerousStuff();
} catch (error) {
    // ignore as many do
}

var myObj = { apple: 1 };

var myObj = { a: 1 };  // With {"properties": "never"}

(num) => { num * num };

function foo(num = 0) { }

class MyClass { }

class Foo { method() {} }

function foo(...args) { }

var { prop } = {};

var { prop: a } = {};

var { prop: [x] } = {};

import something from "y";

export var num = 0;

({ prop: obj.x.y.something }) = {};

({ prop: obj.longName }) = {};

({ a: obj.x.y.z }) = {};  // With {"properties": "never"}

({ prop: obj.x }) = {};  // With {"properties": "never"}

var data = { "x": 1 };  // excused because of quotes

data["y"] = 3;  // excused because of calculated property access
```

### Options

The `id-length` rule has no required options and has 4 optional ones that needs to be passed in a single options object:

* **min** *(default: 2)*: The minimum number of characters an identifier name should be, after it is stripped from it is prefixes and suffixes
* **max** *(default: Infinity)*: The maximum number of characters an identifier name should be, after it is stripped from it is prefixes and suffixes
* **properties** *(default: "always")*: If set to `"never"` does not check property names at all
* **exceptions**: An array of identifier names that the rule should not apply to


For example, to specify a minimum identifier length of 3, a maximum of 10, ignore property names and add `x` to exception list, use the following configuration:

```json
"id-length": [2, {"min": 3, "max": 10, "properties": "never", "exceptions": ["x"]}]
```


## Related Rules

* [max-len](max-len.md)
* [new-cap](new-cap.md)
* [func-names](func-names.md)
* [camelcase](camelcase.md)
