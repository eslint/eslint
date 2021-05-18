# Disallow use of Object.prototypes builtins directly (no-prototype-builtins)

In ECMAScript 5.1, `Object.create` was added, which enables the creation of objects with a specified `[[Prototype]]`. `Object.create(null)` is a common pattern used to create objects that will be used as a Map. This can lead to errors when it is assumed that objects will have properties from `Object.prototype`. This rule prevents calling some `Object.prototype` methods directly from an object.

Additionally, objects can have properties that shadow the builtins on `Object.prototype`, potentially causing unintended behavior or denial-of-service security vulnerabilities. For example, it would be unsafe for a webserver to parse JSON input from a client and call `hasOwnProperty` directly on the resulting object, because a malicious client could send a JSON value like `{"hasOwnProperty": 1}` and cause the server to crash.

To avoid subtle bugs like this, it's better to always call these methods from `Object.prototype`. For example, `foo.hasOwnProperty("bar")` should be replaced with `Object.prototype.hasOwnProperty.call(foo, "bar")`.

## Rule Details

This rule disallows calling some `Object.prototype` methods directly on object instances.

Examples of **incorrect** code for this rule:

```js
/*eslint no-prototype-builtins: "error"*/

var hasBarProperty = foo.hasOwnProperty("bar");

var isPrototypeOfBar = foo.isPrototypeOf(bar);

var barIsEnumerable = foo.propertyIsEnumerable("bar");
```

Examples of **correct** code for this rule:

```js
/*eslint no-prototype-builtins: "error"*/

var hasBarProperty = Object.prototype.hasOwnProperty.call(foo, "bar");

var isPrototypeOfBar = Object.prototype.isPrototypeOf.call(foo, bar);

var barIsEnumerable = {}.propertyIsEnumerable.call(foo, "bar");
```

## When Not To Use It

You may want to turn this rule off if your code only touches objects with hardcoded keys, and you will never use an object that shadows an `Object.prototype` method or which does not inherit from `Object.prototype`.
