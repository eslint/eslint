# Disallow Reassignment of const Declarations (no-const-reassign)

Reassigning declarations of const should result in a SyntaxError in both strict and non-strict mode, unfortunately there are still platforms which allow the assigment to fail silently.

```js
const a = 'a';
a = 'b'; // Should throw an error
```

There are still environments where reassignment of const declarations will fail silently.

For full coverage see the following resouces;

* http://kangax.github.io/compat-table/es6/#const_redefining_a_const_is_an_error
* http://kangax.github.io/compat-table/es6/#const_redefining_a_const_(strict_mode)

## Rule Details

This rule is aimed at eliminating errors and silent defects in code by ensuring that constants are not assigned more then once.

The following patterns are considered warnings:

```js
const a = 'a';
a = 'b';
```

```js
const b = 0;
++b;
```

```js
const c = {};
delete c;
```

The following patterns are not considered warnings:

```js
const a;
```

```js
const b = {};
b.a = 'a';
delete b.a;
b.b = 0;
++b.b;
```

### Options

This rule does not require or provide any options


## When Not to Use It

If you are not using es6 features, you can safely disable this rule.
