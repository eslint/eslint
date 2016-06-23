# Require or disallow a space before function parenthesis (space-before-function-paren)

(fixable) The `--fix` option on the [command line](../user-guide/command-line-interface#fix) automatically fixes problems reported by this rule.

When formatting a function, whitespace is allowed between the function name or `function` keyword and the opening paren. Named functions also require a space between the `function` keyword and the function name, but anonymous functions require no whitespace. For example:

```js
function withoutSpace(x) {};

function withSpace (x) {};

var anonymousWithoutSpace = function() {};

var anonymousWithSpace = function () {};
```

Style guides may require a space after the `function` keyword for anonymous functions, while others specify no whitespace. Similarly, the space after a function name may or may not be required.

## Rule Details

This rule aims to enforce consistent spacing before function parentheses and as such, will warn whenever whitespace doesn't match the preferences specified.

## Options

This rule can have either a simple string argument or an object literal (if more granular control is required).

The string argument can either be:

* `"always"` _(default)_ - all functions, named and anonymous, must have space before function parentheses.
* `"never"` - all functions, named and anonymous, must not have space before function parentheses.

If you want different spacing for named and anonymous functions you can pass a configuration object as the rule argument to configure those separately (e. g. `{"anonymous": "always", "named": "never"}`). In this case, you can use `"ignore"` to only apply the rule to one type of function (e. g. `{"anonymous": "ignore", "named": "never"}` will warn on spaces for named functions, but will not warn on anonymous functions one way or the other).

The default configuration is `"always"`.

## Examples

### always

Examples of **incorrect** code for this rule with the default `"always"` option:

```js
/*eslint space-before-function-paren: "error"*/
/*eslint-env es6*/

function foo() {};

var bar = function() {};

var bar = function foo() {};

class Foo {
    constructor() {}
}

var foo = {
    bar() {}
};
```

Examples of **correct** code for this rule with the default `"always"` option:

```js
/*eslint space-before-function-paren: "error"*/
/*eslint-env es6*/

function foo () {};

var bar = function () {};

var bar = function foo () {};

class Foo {
    constructor () {}
}

var foo = {
    bar () {}
};
```

### "never"

Examples of **incorrect** code for this rule with the `"never"` option:

```js
/*eslint space-before-function-paren: ["error", "never"]*/
/*eslint-env es6*/

function foo () {};

var bar = function () {};

var bar = function foo () {};

class Foo {
    constructor () {}
}

var foo = {
    bar () {}
};
```

Examples of **correct** code for this rule with the `"never"` option:

```js
/*eslint space-before-function-paren: ["error", "never"]*/
/*eslint-env es6*/

function foo() {};

var bar = function() {};

var bar = function foo() {};

class Foo {
    constructor() {}
}

var foo = {
    bar() {}
};
```

### anonymous: always, named: never

Examples of **incorrect** code for this rule with the `{"anonymous": "always", "named": "never"}` option:

```js
/*eslint space-before-function-paren: ["error", { "anonymous": "always", "named": "never" }]*/
/*eslint-env es6*/

function foo () {};

var bar = function() {};

class Foo {
    constructor () {}
}

var foo = {
    bar () {}
};
```

Examples of **correct** code for this rule with the `{"anonymous": "always", "named": "never"}` option:

```js
/*eslint space-before-function-paren: ["error", { "anonymous": "always", "named": "never" }]*/
/*eslint-env es6*/

function foo() {};

var bar = function () {};

class Foo {
    constructor() {}
}

var foo = {
    bar() {}
};
```

### anonymous: never, named: always

Examples of **incorrect** code for this rule with the `{"anonymous": "never", "named": "always"}` option:

```js
/*eslint space-before-function-paren: ["error", { "anonymous": "never", "named": "always" }]*/
/*eslint-env es6*/

function foo() {};

var bar = function () {};

class Foo {
    constructor() {}
}

var foo = {
    bar() {}
};
```

Examples of **correct** code for this rule with the `{"anonymous": "never", "named": "always"}` option:

```js
/*eslint space-before-function-paren: ["error", { "anonymous": "never", "named": "always" }]*/
/*eslint-env es6*/

function foo () {};

var bar = function() {};

class Foo {
    constructor () {}
}

var foo = {
    bar () {}
};
```

### anonymous: ignore, named: always

Examples of **incorrect** code for this rule with the `{"anonymous": "ignore", "named": "always"}` option:

```js
/*eslint space-before-function-paren: ["error", { "anonymous": "ignore", "named": "always" }]*/
/*eslint-env es6*/

function foo() {};

class Foo {
    constructor() {}
}

var foo = {
    bar() {}
};
```

Examples of **correct** code for this rule with the `{"anonymous": "ignore", "named": "always"}` option:

```js
/*eslint space-before-function-paren: ["error", { "anonymous": "ignore", "named": "always" }]*/
/*eslint-env es6*/

var bar = function() {};

var bar = function () {};

function foo () {};

class Foo {
    constructor () {}
}

var foo = {
    bar () {}
};
```

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of spacing before function parenthesis.

## Related Rules

* [space-after-keywords](space-after-keywords.md)
* [space-return-throw-case](space-return-throw-case.md)