# Disallow Unused Expressions (no-unused-expressions)

Unused expressions are those expressions that evaluate to a value but are never used. For example:

```js
"Hello world";
```

This string is a valid JavaScript expression, but isn't actually used. Even though it's not a syntax error it is clearly a logic error and it has no effect on the code being executed.

## Rule Details

This rule aims to eliminate unused expressions. The value of an expression should always be used, except in the case of expressions that side effect: function calls, assignments, and the `new` operator.

**Note:** Sequence expressions (those using a comma, such as `a = 1, b = 2`) are always considered unused unless their return value is assigned or a function call is made with the sequence expression value.

### Options

This rule, in it's default state, does not require any arguments. If you would like to enable one or more of the following you may pass an object with the options set as follows:

* `allowShortCircuit` set to `true` will allow you to use short circuit evaluations in your expressions (Default: `false`).
* `allowTernary` set to `true` will enable you use ternary operators in your expressions similarly to short circuit evaluations (Default: `false`).

### Usage

By default the following patterns are considered problems:

```js
/*eslint no-unused-expressions: 2*/

0         /*error Expected an assignment or function call and instead saw an expression.*/

if(0) 0   /*error Expected an assignment or function call and instead saw an expression.*/

{0}       /*error Expected an assignment or function call and instead saw an expression.*/

f(0), {}  /*error Expected an assignment or function call and instead saw an expression.*/

a && b()  /*error Expected an assignment or function call and instead saw an expression.*/

a, b()    /*error Expected an assignment or function call and instead saw an expression.*/

c = a, b; /*error Expected an assignment or function call and instead saw an expression.*/
```

The following patterns are not considered problems by default:

```js
/*eslint no-unused-expressions: 2*/

{}

f()

a = 0

new C

delete a.b

void a
```

The following patterns are not considered problems if `allowShortCircuit` is enabled:

```js
/*eslint no-unused-expressions: [2, { allowShortCircuit: true }]*/

a && b()

a() || (b = c)
```

If you enable the `allowTernary` the following patterns will be allowed:

```js
/*eslint no-unused-expressions: [2, { allowTernary: true }]*/

a ? b() : c()

a ? (b = c) : d()
```

Enabling both options will allow a combination of both ternary and short circuit evaluation:

```js
/*eslint no-unused-expressions: [2, { allowShortCircuit: true, allowTernary: true }]*/

a ? b() || (c = d) : e()
```

The above options still will not allow expressions that have code paths without side effects such as the following:

```js
/*eslint no-unused-expressions: [2, { allowShortCircuit: true, allowTernary: true }]*/

a || b         /*error Expected an assignment or function call and instead saw an expression.*/

a ? b : 0      /*error Expected an assignment or function call and instead saw an expression.*/

a ? b : c()    /*error Expected an assignment or function call and instead saw an expression.*/
```
