# Require or disallow a space before function parenthesis (space-before-function-paren)

(fixable) The `--fix` option on the [command line](../user-guide/command-line-interface#fix) automatically fixes problems reported by this rule.

When formatting a function, whitespace is allowed between the function name or `function` keyword and the opening paren. Named functions also require a space between the `function` keyword and the function name, but anonymous functions require no whitespace. For example:

```js
function withoutSpace(x) {
    // ...
}

function withSpace (x) {
    // ...
}

var anonymousWithoutSpace = function() {};

var anonymousWithSpace = function () {};
```

Style guides may require a space after the `function` keyword for anonymous functions, while others specify no whitespace. Similarly, the space after a function name may or may not be required.

## Rule Details

This rule aims to enforce consistent spacing before function parentheses and as such, will warn whenever whitespace doesn't match the preferences specified.

## Options

This rule takes one argument. If it is `"always"` then all named functions and anonymous functions must have space before function parentheses. If `"never"` then all named functions and anonymous functions must not have space before function parentheses. If you want different spacing for named and anonymous functions you can pass a configuration object as the rule argument to configure those separately (e. g. `{"anonymous": "always", "named": "never"}`). In this case, you can use "ignore" to only set the apply the rule to one type of function (e. g. `{"anonymous": "ignore", "named": "never"}` will warn on spaces for named functions, but will not warn on anonymous functions one way or the other).

The default configuration is `"always"`.

### "always"

The following patterns are considered problems:

```js
/*eslint space-before-function-paren: "error"*/
/*eslint-env es6*/

function foo() {
    // ...
}

var bar = function() {
    // ...
};

var bar = function foo() {
    // ...
};

class Foo {
    constructor() {
        // ...
    }
}

var foo = {
    bar() {
        // ...
    }
};
```

The following patterns are not considered problems:

```js
/*eslint space-before-function-paren: "error"*/
/*eslint-env es6*/

function foo () {
    // ...
}

var bar = function () {
    // ...
};

var bar = function foo () {
    // ...
};

class Foo {
    constructor () {
        // ...
    }
}

var foo = {
    bar () {
        // ...
    }
};
```

### "never"

The following patterns are considered problems:

```js
/*eslint space-before-function-paren: ["error", "never"]*/
/*eslint-env es6*/

function foo () {
    // ...
}

var bar = function () {
    // ...
};

var bar = function foo () {
    // ...
};

class Foo {
    constructor () {
        // ...
    }
}

var foo = {
    bar () {
        // ...
    }
};
```

The following patterns are not considered problems:

```js
/*eslint space-before-function-paren: ["error", "never"]*/
/*eslint-env es6*/

function foo() {
    // ...
}

var bar = function() {
    // ...
};

var bar = function foo() {
    // ...
};

class Foo {
    constructor() {
        // ...
    }
}

var foo = {
    bar() {
        // ...
    }
};
```

### `{"anonymous": "always", "named": "never"}`

The following patterns are considered problems:

```js
/*eslint space-before-function-paren: ["error", { "anonymous": "always", "named": "never" }]*/
/*eslint-env es6*/

function foo () {
    // ...
}

var bar = function() {
    // ...
};

class Foo {
    constructor () {
        // ...
    }
}

var foo = {
    bar () {
        // ...
    }
};
```

The following patterns are not considered problems:

```js
/*eslint space-before-function-paren: ["error", { "anonymous": "always", "named": "never" }]*/
/*eslint-env es6*/

function foo() {
    // ...
}

var bar = function () {
    // ...
};

class Foo {
    constructor() {
        // ...
    }
}

var foo = {
    bar() {
        // ...
    }
};
```

### `{"anonymous": "never", "named": "always"}`

The following patterns are considered problems:

```js
/*eslint space-before-function-paren: ["error", { "anonymous": "never", "named": "always" }]*/
/*eslint-env es6*/

function foo() {
    // ...
}

var bar = function () {
    // ...
};

class Foo {
    constructor() {
        // ...
    }
}

var foo = {
    bar() {
        // ...
    }
};
```

The following patterns are not considered problems:

```js
/*eslint space-before-function-paren: ["error", { "anonymous": "never", "named": "always" }]*/
/*eslint-env es6*/

function foo () {
    // ...
}

var bar = function() {
    // ...
};

class Foo {
    constructor () {
        // ...
    }
}

var foo = {
    bar () {
        // ...
    }
};
```

### `{"anonymous": "ignore", "named": "always"}`

The following patterns are considered problems:

```js
/*eslint space-before-function-paren: ["error", { "anonymous": "ignore", "named": "always" }]*/
/*eslint-env es6*/

function foo() {
    // ...
}
```

The following patterns are not considered problems:

```js
/*eslint space-before-function-paren: ["error", { "anonymous": "ignore", "named": "always" }]*/
/*eslint-env es6*/

var bar = function() {
    // ...
};

var bar = function () {
    // ...
};

class Foo {
    constructor () {
        // ...
    }
}

class Foo {
    constructor() {
        // ...
    }
}

var foo = {
    bar () {
        // ...
    }
};

var foo = {
    bar() {
        // ...
    }
};
```

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of spacing before function parenthesis.

## Related Rules

* [space-after-keywords](space-after-keywords.md)
* [space-return-throw-case](space-return-throw-case.md)
