# Suggest using Reflect methods where applicable (prefer-reflect)

This rule was **deprecated** in ESLint v3.9.0 and will not be replaced. The original intent of this rule now seems misguided as we have come to understand that `Reflect` methods are not actually intended to replace the `Object` counterparts the rule suggests, but rather exist as low-level primitives to be used with proxies in order to replicate the default behavior of various previously existing functionality.

The ES6 Reflect API comes with a handful of methods which somewhat deprecate methods on old constructors:

* [`Reflect.apply`](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-reflect.apply) effectively deprecates [`Function.prototype.apply`](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-function.prototype.apply) and [`Function.prototype.call`](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-function.prototype.call)
* [`Reflect.deleteProperty`](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-reflect.deleteproperty) effectively deprecates the [`delete` keyword](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-delete-operator-runtime-semantics-evaluation)
* [`Reflect.getOwnPropertyDescriptor`](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-reflect.getownpropertydescriptor) effectively deprecates [`Object.getOwnPropertyDescriptor`](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-object.getownpropertydescriptor)
* [`Reflect.getPrototypeOf`](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-reflect.getprototypeof) effectively deprecates [`Object.getPrototypeOf`](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-object.getprototypeof)
* [`Reflect.setPrototypeOf`](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-reflect.setprototypeof) effectively deprecates [`Object.setPrototypeOf`](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-object.setprototypeof)
* [`Reflect.preventExtensions`](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-reflect.preventextensions)  effectively deprecates [`Object.preventExtensions`](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-object.preventextensions)

The prefer-reflect rule will flag usage of any older method, suggesting to instead use the newer Reflect version.

## Rule Details

## Options

### Exceptions

```
"prefer-reflect": [<enabled>, { "exceptions": [<...exceptions>] }]
```

The `exceptions` option allows you to pass an array of methods names you'd like to continue to use in the old style.

For example if you wish to use all Reflect methods, except for `Function.prototype.apply` then your config would look like `prefer-reflect: [2, { "exceptions": ["apply"] }]`.

If you want to use Reflect methods, but keep using the `delete` keyword, then your config would look like `prefer-reflect: [2, { "exceptions": ["delete"] }]`.

These can be combined as much as you like. To make all methods exceptions (thereby rendering this rule useless), use `prefer-reflect: [2, { "exceptions": ["apply", "call", "defineProperty", "getOwnPropertyDescriptor", "getPrototypeOf", "setPrototypeOf", "isExtensible", "getOwnPropertyNames", "preventExtensions", "delete"] }]`

### Reflect.apply

Deprecates `Function.prototype.apply()` and `Function.prototype.call()`

Examples of **incorrect** code for this rule when used without exceptions:

```js
/*eslint prefer-reflect: "error"*/

myFunction.apply(undefined, args);
myFunction.apply(null, args);
obj.myMethod.apply(obj, args);
obj.myMethod.apply(other, args);

myFunction.call(undefined, arg);
myFunction.call(null, arg);
obj.myMethod.call(obj, arg);
obj.myMethod.call(other, arg);
```

Examples of **correct** code for this rule when used without exceptions:

```js
/*eslint prefer-reflect: "error"*/

Reflect.apply(myFunction, undefined, args);
Reflect.apply(myFunction, null, args);
Reflect.apply(obj.myMethod, obj, args);
Reflect.apply(obj.myMethod, other, args);
Reflect.apply(myFunction, undefined, [arg]);
Reflect.apply(myFunction, null, [arg]);
Reflect.apply(obj.myMethod, obj, [arg]);
Reflect.apply(obj.myMethod, other, [arg]);
```

Examples of **correct** code for this rule with the `{ "exceptions": ["apply"] }` option:

```js
/*eslint prefer-reflect: ["error", { "exceptions": ["apply"] }]*/

// in addition to Reflect.apply(...):
myFunction.apply(undefined, args);
myFunction.apply(null, args);
obj.myMethod.apply(obj, args);
obj.myMethod.apply(other, args);
```

Examples of **correct** code for this rule with the `{ "exceptions": ["call"] }` option:

```js
/*eslint prefer-reflect: ["error", { "exceptions": ["call"] }]*/

// in addition to Reflect.apply(...):
myFunction.call(undefined, arg);
myFunction.call(null, arg);
obj.myMethod.call(obj, arg);
obj.myMethod.call(other, arg);
```

### Reflect.defineProperty

Deprecates `Object.defineProperty()`

Examples of **incorrect** code for this rule when used without exceptions:

```js
/*eslint prefer-reflect: "error"*/

Object.defineProperty({}, 'foo', {value: 1})
```

Examples of **correct** code for this rule when used without exceptions:

```js
/*eslint prefer-reflect: "error"*/

Reflect.defineProperty({}, 'foo', {value: 1})
```

Examples of **correct** code for this rule with the `{ "exceptions": ["defineProperty"] }` option:

```js
/*eslint prefer-reflect: ["error", { "exceptions": ["defineProperty"] }]*/

Object.defineProperty({}, 'foo', {value: 1})
Reflect.defineProperty({}, 'foo', {value: 1})
```

### Reflect.getOwnPropertyDescriptor

Deprecates `Object.getOwnPropertyDescriptor()`

Examples of **incorrect** code for this rule when used without exceptions:

```js
/*eslint prefer-reflect: "error"*/

Object.getOwnPropertyDescriptor({}, 'foo')
```

Examples of **correct** code for this rule when used without exceptions:

```js
/*eslint prefer-reflect: "error"*/

Reflect.getOwnPropertyDescriptor({}, 'foo')
```

Examples of **correct** code for this rule with the `{ "exceptions": ["getOwnPropertyDescriptor"] }` option:

```js
/*eslint prefer-reflect: ["error", { "exceptions": ["getOwnPropertyDescriptor"] }]*/

Object.getOwnPropertyDescriptor({}, 'foo')
Reflect.getOwnPropertyDescriptor({}, 'foo')
```

### Reflect.getPrototypeOf

Deprecates `Object.getPrototypeOf()`

Examples of **incorrect** code for this rule when used without exceptions:

```js
/*eslint prefer-reflect: "error"*/

Object.getPrototypeOf({}, 'foo')
```

Examples of **correct** code for this rule when used without exceptions:

```js
/*eslint prefer-reflect: "error"*/

Reflect.getPrototypeOf({}, 'foo')
```

Examples of **correct** code for this rule with the `{ "exceptions": ["getPrototypeOf"] }` option:

```js
/*eslint prefer-reflect: ["error", { "exceptions": ["getPrototypeOf"] }]*/

Object.getPrototypeOf({}, 'foo')
Reflect.getPrototypeOf({}, 'foo')
```

### Reflect.setPrototypeOf

Deprecates `Object.setPrototypeOf()`

Examples of **incorrect** code for this rule when used without exceptions:

```js
/*eslint prefer-reflect: "error"*/

Object.setPrototypeOf({}, Object.prototype)
```

Examples of **correct** code for this rule when used without exceptions:

```js
/*eslint prefer-reflect: "error"*/

Reflect.setPrototypeOf({}, Object.prototype)
```

Examples of **correct** code for this rule with the `{ "exceptions": ["setPrototypeOf"] }` option:

```js
/*eslint prefer-reflect: ["error", { "exceptions": ["setPrototypeOf"] }]*/

Object.setPrototypeOf({}, Object.prototype)
Reflect.setPrototypeOf({}, Object.prototype)
```

### Reflect.isExtensible

Deprecates `Object.isExtensible`

Examples of **incorrect** code for this rule when used without exceptions:

```js
/*eslint prefer-reflect: "error"*/

Object.isExtensible({})
```

Examples of **correct** code for this rule when used without exceptions:

```js
/*eslint prefer-reflect: "error"*/

Reflect.isExtensible({})
```

Examples of **correct** code for this rule with the `{ "exceptions": ["isExtensible"] }` option:

```js
/*eslint prefer-reflect: ["error", { "exceptions": ["isExtensible"] }]*/

Object.isExtensible({})
Reflect.isExtensible({})
```

### Reflect.getOwnPropertyNames

Deprecates `Object.getOwnPropertyNames()`

Examples of **incorrect** code for this rule when used without exceptions:

```js
/*eslint prefer-reflect: "error"*/

Object.getOwnPropertyNames({})
```

Examples of **correct** code for this rule when used without exceptions:

```js
/*eslint prefer-reflect: "error"*/

Reflect.getOwnPropertyNames({})
```

Examples of **correct** code for this rule with the `{ "exceptions": ["getOwnPropertyNames"] }` option:

```js
/*eslint prefer-reflect: ["error", { "exceptions": ["getOwnPropertyNames"] }]*/

Object.getOwnPropertyNames({})
Reflect.getOwnPropertyNames({})
```

### Reflect.preventExtensions

Deprecates `Object.preventExtensions()`

Examples of **incorrect** code for this rule when used without exceptions:

```js
/*eslint prefer-reflect: "error"*/

Object.preventExtensions({})
```

Examples of **correct** code for this rule when used without exceptions:

```js
/*eslint prefer-reflect: "error"*/

Reflect.preventExtensions({})
```

Examples of **correct** code for this rule with the `{ "exceptions": ["preventExtensions"] }` option:

```js
/*eslint prefer-reflect: ["error", { "exceptions": ["preventExtensions"] }]*/

Object.preventExtensions({})
Reflect.preventExtensions({})
```

### Reflect.deleteProperty

Deprecates the `delete` keyword

Examples of **incorrect** code for this rule when used without exceptions:

```js
/*eslint prefer-reflect: "error"*/

delete foo.bar; // deleting object property
```

Examples of **correct** code for this rule when used without exceptions:

```js
/*eslint prefer-reflect: "error"*/

delete bar; // deleting variable
Reflect.deleteProperty(foo, 'bar');
```

Note: For a rule preventing deletion of variables, see [no-delete-var instead](no-delete-var.md)

Examples of **correct** code for this rule with the `{ "exceptions": ["delete"] }` option:

```js
/*eslint prefer-reflect: ["error", { "exceptions": ["delete"] }]*/

delete bar
delete foo.bar
Reflect.deleteProperty(foo, 'bar');
```

## When Not To Use It

This rule should not be used in ES3/5 environments.

In ES2015 (ES6) or later, if you don't want to be notified about places where Reflect could be used, you can safely disable this rule.

## Related Rules

* [no-useless-call](no-useless-call.md)
* [prefer-spread](prefer-spread.md)
* [no-delete-var](no-delete-var.md)
