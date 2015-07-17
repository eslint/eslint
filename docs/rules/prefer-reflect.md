# Suggest using Reflect methods where applicable (prefer-reflect)

The ES6 Reflect API comes with a handful of methods which somewhat deprecate methods on old constructors:

* [`Reflect.apply`](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-reflect.apply) effectively deprecates [`Function.prototype.apply`](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-function.prototype.apply) and [`Function.prototype.call`](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-function.prototype.call)
* [`Reflect.deleteProperty`](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-reflect.deleteproperty) effectively deprecates the [`delete` keyword](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-delete-operator-runtime-semantics-evaluation)
* [`Reflect.getOwnPropertyDescriptor`](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-reflect.getownpropertydescriptor) effectively deprecates [`Object.getOwnPropertyDescriptor`](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-object.getownpropertydescriptor)
* [`Reflect.getPrototypeOf`](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-reflect.getprototypeof) effectively deprecates [`Object.getPrototypeOf`](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-object.getprototypeof)
* [`Reflect.setPrototypeOf`](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-reflect.setprototypeof) effectively deprecates [`Object.setPrototypeOf`](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-object.setprototypeof)
* [`Reflect.preventExtensions`](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-reflect.preventextensions)  effectively deprecates [`Object.preventExtensions`](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-object.preventextensions)

The prefer-reflect rule will flag usage of any older method, suggesting to instead use the newer Reflect version.

## Rule Details

### Reflect.apply (Function.prototype.apply/Function.prototype.call)

The following patterns are considered warnings:

__config:__ `prefer-reflect: [2]`

```js
foo.apply(undefined, args);
foo.apply(null, args);
obj.foo.apply(obj, args);
obj.foo.apply(other, args);

foo.call(undefined, arg);
foo.call(null, arg);
obj.foo.call(obj, arg);
obj.foo.call(other, arg);
```

The following patterns are not considered warnings:

__config:__ `prefer-reflect: [2]`

```js
Reflect.apply(undefined, args);
Reflect.apply(null, args);
Reflect.apply(obj.foo, obj, args);
Reflect.apply(obj.foo, other, args);
Reflect.apply(undefined, [arg]);
Reflect.apply(null, [arg]);
Reflect.apply(obj.foo, obj, [arg]);
Reflect.apply(obj.foo, other, [arg]);
```

__config:__ `prefer-reflect: [2, { exceptions: ["apply"] }]`

```js
foo.apply(undefined, args);
foo.apply(null, args);
obj.foo.apply(obj, args);
obj.foo.apply(other, args);
Reflect.apply(undefined, args);
Reflect.apply(null, args);
Reflect.apply(obj.foo, obj, args);
Reflect.apply(obj.foo, other, args);
```

__config:__ `prefer-reflect: [2, { exceptions: ["call"] }]`

```js
foo.call(undefined, arg);
foo.call(null, arg);
obj.foo.call(obj, arg);
obj.foo.call(other, arg);
Reflect.apply(undefined, [arg]);
Reflect.apply(null, [arg]);
Reflect.apply(obj.foo, obj, [arg]);
Reflect.apply(obj.foo, other, [arg]);
```

### Reflect.defineProperty (Object.defineProperty)

The following patterns are considered warnings:

__config:__ `prefer-reflect: [2]`

```js
Object.defineProperty({}, 'foo', {value: 1})
```

The following patterns are not considered warnings:

__config:__ `prefer-reflect: [2]`

```js
Reflect.defineProperty({}, 'foo', {value: 1})
```

__config:__ `prefer-reflect: [2, { exceptions: ["defineProperty"] }]`

```js
Object.defineProperty({}, 'foo', {value: 1})
Reflect.defineProperty({}, 'foo', {value: 1})
```

### Reflect.getOwnPropertyDescriptor (Object.getOwnPropertyDescriptor)

The following patterns are considered warnings:

__config:__ `prefer-reflect: [2]`

```js
Object.getOwnPropertyDescriptor({}, 'foo')
```

The following patterns are not considered warnings:

__config:__ `prefer-reflect: [2]`

```js
Reflect.getOwnPropertyDescriptor({}, 'foo')
```

__config:__ `prefer-reflect: [2, { exceptions: ["getOwnPropertyDescriptor"] }]`

```js
Object.getOwnPropertyDescriptor({}, 'foo')
Reflect.getOwnPropertyDescriptor({}, 'foo')
```

### Reflect.getPrototypeOf (Object.getPrototypeOf)

The following patterns are considered warnings:

__config:__ `prefer-reflect: [2]`

```js
Object.getPrototypeOf({}, 'foo')
```

The following patterns are not considered warnings:

__config:__ `prefer-reflect: [2]`

```js
Reflect.getPrototypeOf({}, 'foo')
```

__config:__ `prefer-reflect: [2, { exceptions: ["getPrototypeOf"] }]`

```js
Object.getPrototypeOf({}, 'foo')
Reflect.getPrototypeOf({}, 'foo')
```

### Reflect.setPrototypeOf (Object.setPrototypeOf)

The following patterns are considered warnings:

__config:__ `prefer-reflect: [2]`

```js
Object.setPrototypeOf({}, Object.prototype)
```

The following patterns are not considered warnings:

__config:__ `prefer-reflect: [2]`

```js
Reflect.setPrototypeOf({}, Object.prototype)
```

__config:__ `prefer-reflect: [2, { exceptions: ["setPrototypeOf"] }]`

```js
Object.setPrototypeOf({}, Object.prototype)
Reflect.setPrototypeOf({}, Object.prototype)
```

### Reflect.isExtensible (Object.isExtensible)

The following patterns are considered warnings:

__config:__ `prefer-reflect: [2]`

```js
Object.isExtensible({})
```

The following patterns are not considered warnings:

__config:__ `prefer-reflect: [2]`

```js
Reflect.isExtensible({})
```

__config:__ `prefer-reflect: [2, { exceptions: ["isExtensible"] }]`

```js
Object.isExtensible({})
Reflect.isExtensible({})
```

### Reflect.getOwnPropertyNames (Object.getOwnPropertyNames)

The following patterns are considered warnings:

__config:__ `prefer-reflect: [2]`

```js
Object.getOwnPropertyNames({})
```

The following patterns are not considered warnings:

__config:__ `prefer-reflect: [2]`

```js
Reflect.getOwnPropertyNames({})
```

__config:__ `prefer-reflect: [2, { exceptions: ["getOwnPropertyNames"] }]`

```js
Object.getOwnPropertyNames({})
Reflect.getOwnPropertyNames({})
```

### Reflect.preventExtensions (Object.preventExtensions)

The following patterns are considered warnings:

__config:__ `prefer-reflect: [2]`

```js
Object.preventExtensions({})
```

The following patterns are not considered warnings:

__config:__ `prefer-reflect: [2]`

```js
Reflect.preventExtensions({})
```

__config:__ `prefer-reflect: [2, { exceptions: ["preventExtensions"] }]`

```js
Object.preventExtensions({})
Reflect.preventExtensions({})
```

### Reflect.deleteProperty (The `delete` keyword)

The following patterns are considered warnings:

__config:__ `prefer-reflect: [2]`

```js
delete foo.bar;
```

The following patterns are not considered warnings:

__config:__ `prefer-reflect: [2]`

```js
delete bar; // Does not reference an object, just a var
Reflect.deleteProperty(foo, 'bar');
```

(Note: For a rule preventing deletion of variables, see [no-delete-var instead](no-delete-var.md))

__config:__ `prefer-reflect: [2, { exceptions: ["delete"] }]`

```js
delete bar
delete foo.bar
Reflect.deleteProperty(foo, 'bar');
```

## Options

### Exceptions

```js
"prefer-reflect": [<enabled>, { exceptions: [<...exceptions>] }]
```

The `exceptions` option allows you to pass an array of methods names you'd like to continue to use in the old style.

For example if you wish to use all Reflect methods, except for `Function.prototype.apply` then your config would look like `prefer-reflect: [2, { exceptions: ["apply"] }]`.

If you want to use Reflect methods, but keep using the `delete` keyword, then your config would look like `prefer-reflect: [2, { exceptions: ["delete"] }]`.

These can be combined as much as you like. To make all methods exceptions (thereby rendering this rule useless), use `prefer-reflect: [2, { exceptions: ["apply", "call", "defineProperty", "getOwnPropertyDescriptor", "getPrototypeOf", "setPrototypeOf", "isExtensible", "getOwnPropertyNames", "preventExtensions", "delete"] }]`

## When Not to Use It

This rule should not be used in ES3/5 environments.

In ES2015 (ES6) or later, if you don't want to be notified about places where Reflect could be used, you can safely disable this rule.

## Related rules

* [no-useless-call](no-useless-call.md)
* [prefer-spread](prefer-spread.md)
* [no-delete-var](no-delete-var.md)
