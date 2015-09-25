# Require or disallow a space before function parenthesis (space-before-function-paren)

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

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

This rule aims to enforce consistent spacing before function parentheses and as such, will warn whenever whitespace doesn't match the preferences specified.

This rule takes one argument. If it is `"always"` then all named functions and anonymous functions must have space before function parentheses. If `"never"` then all named functions and anonymous functions must not have space before function parentheses. If you want different spacing for named and anonymous functions you can pass a configuration object as the rule argument to configure those separately (e. g. `{"anonymous": "always", "named": "never"}`).

The default configuration is `"always"`.

### `"always"`

The following patterns are considered problems:

```js
/*eslint space-before-function-paren: 2*/
/*eslint-env es6*/

function foo() {           /*error Missing space before function parentheses.*/
    // ...
}

var bar = function() {     /*error Missing space before function parentheses.*/
    // ...
};

var bar = function foo() { /*error Missing space before function parentheses.*/
    // ...
};

class Foo {
    constructor() {        /*error Missing space before function parentheses.*/
        // ...
    }
}

var foo = {
    bar() {                /*error Missing space before function parentheses.*/
        // ...
    }
};
```

The following patterns are not considered problems:

```js
/*eslint space-before-function-paren: 2*/
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

### `"never"`

The following patterns are considered problems:

```js
/*eslint space-before-function-paren: [2, "never"]*/
/*eslint-env es6*/

function foo () {           /*error Unexpected space before function parentheses.*/
    // ...
}

var bar = function () {     /*error Unexpected space before function parentheses.*/
    // ...
};

var bar = function foo () { /*error Unexpected space before function parentheses.*/
    // ...
};

class Foo {
    constructor () {        /*error Unexpected space before function parentheses.*/
        // ...
    }
}

var foo = {
    bar () {                /*error Unexpected space before function parentheses.*/
        // ...
    }
};
```

The following patterns are not considered problems:

```js
/*eslint space-before-function-paren: [2, "never"]*/
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
/*eslint space-before-function-paren: [2, { "anonymous": "always", "named": "never" }]*/
/*eslint-env es6*/

function foo () {      /*error Unexpected space before function parentheses.*/
    // ...
}

var bar = function() { /*error Missing space before function parentheses.*/
    // ...
};

class Foo {
    constructor () {   /*error Unexpected space before function parentheses.*/
        // ...
    }
}

var foo = {
    bar () {           /*error Unexpected space before function parentheses.*/
        // ...
    }
};
```

The following patterns are not considered problems:

```js
/*eslint space-before-function-paren: [2, { "anonymous": "always", "named": "never" }]*/
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
/*eslint space-before-function-paren: [2, { "anonymous": "never", "named": "always" }]*/
/*eslint-env es6*/

function foo() {        /*error Missing space before function parentheses.*/
    // ...
}

var bar = function () { /*error Unexpected space before function parentheses.*/
    // ...
};

class Foo {
    constructor() {     /*error Missing space before function parentheses.*/
        // ...
    }
}

var foo = {
    bar() {             /*error Missing space before function parentheses.*/
        // ...
    }
};
```

The following patterns are not considered problems:

```js
/*eslint space-before-function-paren: [2, { "anonymous": "never", "named": "always" }]*/
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
