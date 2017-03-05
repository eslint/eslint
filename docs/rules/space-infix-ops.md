# require spacing around infix operators (space-infix-ops)

(fixable) The `--fix` option on the [command line](../user-guide/command-line-interface#fix)
automatically fixes problems reported by this rule.

While formatting preferences are very personal,
a number of style guides require spaces around operators, such as:

```js
var sum = 1 + 2;
```

The proponents of these extra spaces believe it make the code easier to read
and can more easily highlight potential errors, such as:

```js
var sum = i+++2;
```

While this is valid JavaScript syntax, it is hard to determine what the author intended.

## Rule Details

This rule is aimed at ensuring there are spaces around infix operators.

Examples of **incorrect** code for this rule:

```js
/*eslint space-infix-ops: "error"*/

const quotient = dividend/divisor;
const cubed = x**3;
```

Examples of **correct** code for this rule:

```js
/*eslint space-infix-ops: "error"*/

const quotient = dividend / divisor;
const cubed = x ** 3;
```

## Options

* `all` set to `always` requires spaces around all operators that do not override this (the default).
* `all` set to `never` disallows spaces around all operators that do not override this.
* `all` set to `ignore` doesn't enforce any particular use of spaces around operators that do not override this.
* The name of every operator (except `in` and `instanceof`)
  can be used as an option with the values
  `always` (require spaces), `never` (disallow spaces), or `ignore` (don't care).
  These options override the `all` setting for that operator.
  Options for `in` and `instanceof` are not supported because
  it is not valid to omit spaces around those operators.
* `int32Hint` set to `true` allows writing `a|0` without spaces (Default `false`).
  This option is deprecated in favor of specifying `"|": "never"` or `"|": "ignore"`.

For example,

```json
"space-infix-ops": ["error", {"**": "never", "*": "ignore"}]
```

requires spaces around all operators except `**`,
does not allow spaces around `**`,
and doesn't care whether spaces are used around `*`.

Without options to override the default settings,
the following patterns are considered problems:

```js
/*eslint space-infix-ops: "error"*/
/*eslint-env es6*/

a+b

a+ b

a +b

a?b:c

const a={b:1};

var {a=0}=bar;

function foo(a=0) { }
```

Examples of **correct** code for this rule:

```js
/*eslint space-infix-ops: "error"*/
/*eslint-env es6*/

a + b

a       + b

a ? b : c

const a = {b:1};

var {a = 0} = bar;

function foo(a = 0) { }
```
