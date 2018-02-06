# Prefer use of an object spread over `Object.assign` (prefer-object-spread)

When Object.assign is called using an object literal the first argument, this rule requires using the object spread syntax instead.

**Please note:** This rule can only be used when using an `ecmaVersion` of 2018 or higher, 9 or higher, or when using an `ecmaVersion` of 2015-2017 or 5-8 with the `experimentalObjectRestSpread` parser option enabled.

## Rule Details

The following patterns are considered errors:

```js

Object.assign({}, foo)

Object.assign({}, {foo: 'bar'})

Object.assign({ foo: 'bar'}, baz)

Object.assign({ foo: 'bar' }, Object.assign({ bar: 'foo' }))

Object.assign({}, { foo, bar, baz })

Object.assign({}, { ...baz })

```

The following patterns are not errors:

```js

Object.assign(...foo);

// Any Object.assign call without an object literal as the first argument
Object.assign(foo, { bar: baz });

Object.assign(foo, Object.assign({ bar: 'foo' }));

Object.assign(foo, { bar, baz })

Object.assign(foo, { ...baz });

// Object.assign with a single argument that is an object literal
Object.assign({});

Object.assign({ foo: bar });
```

## When Not To Use It

When you don't care about syntactic sugar added by the object spread property.
