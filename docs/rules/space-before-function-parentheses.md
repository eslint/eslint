# space-before-function-parentheses: enforce consistent spacing before opening parenthesis in function definitions

(removed) This rule was **removed** in ESLint v1.0 and **replaced** by the [space-before-function-paren](space-before-function-paren.md) rule. The name of the rule changed from "parentheses" to "paren" for consistency with the names of other rules.

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

This rule takes one argument. If it is `"always"`, which is the default option, all named functions and anonymous functions must have space before function parentheses. If `"never"` then all named functions and anonymous functions must not have space before function parentheses. If you want different spacing for named and anonymous functions you can pass a configuration object as the rule argument to configure those separately (e. g. `{"anonymous": "always", "named": "never"}`).

Examples of **incorrect** code for this rule with the default `"always"` option:

```js
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

Examples of **correct** code for this rule with the default `"always"` option:

```js
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

Examples of **incorrect** code for this rule with the `"never"` option:

```js
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

Examples of **correct** code for this rule with the `"never"` option:

```js
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

Examples of **incorrect** code for this rule with the `{"anonymous": "always", "named": "never"}` option:

```js
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

Examples of **correct** code for this rule with the `{"anonymous": "always", "named": "never"}` option:

```js
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

Examples of **incorrect** code for this rule with the `{"anonymous": "never", "named": "always"}` option:

```js
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

Examples of **correct** code for this rule with the `{"anonymous": "never", "named": "always"}` option:

```js
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

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of spacing before function parenthesis.

## Related Rules

* [space-after-keywords](space-after-keywords.md)
* [space-return-throw-case](space-return-throw-case.md)
