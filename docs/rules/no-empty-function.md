# Disallow empty functions (no-empty-function)

Empty functions can reduce readability because readers need to guess whether it's intentional or not.
So writing a clear comment for empty functions is a good practice.

```js
function foo() {
    // do nothing.
}
```

Especially, the empty block of arrow functions might be confusing developers.
It's very similar to an empty object literal.

```js
list.map(() => {});   // This is a block, would return undefined.
list.map(() => ({})); // This is an empty object.
```

## Rule Details

This rule is aimed at eliminating empty functions.
A function will not be considered a problem if it contains a comment.

Examples of **incorrect** code for this rule:

```js
/*eslint no-empty-function: "error"*/
/*eslint-env es6*/

function foo() {}

var foo = function() {};

var foo = () => {};

function* foo() {}

var foo = function*() {};

var obj = {
    foo: function() {},

    foo: function*() {},

    foo() {},

    *foo() {},

    get foo() {},

    set foo(value) {}
};

class A {
    constructor() {}

    foo() {}

    *foo() {}

    get foo() {}

    set foo(value) {}

    static foo() {}

    static *foo() {}

    static get foo() {}

    static set foo(value) {}
}
```

Examples of **correct** code for this rule:

```js
/*eslint no-empty-function: "error"*/
/*eslint-env es6*/

function foo() {
    // do nothing.
}

var foo = function() {
    // any clear comments.
};

var foo = () => {
    bar();
};

function* foo() {
    // do nothing.
}

var foo = function*() {
    // do nothing.
};

var obj = {
    foo: function() {
        // do nothing.
    },

    foo: function*() {
        // do nothing.
    },

    foo() {
        // do nothing.
    },

    *foo() {
        // do nothing.
    },

    get foo() {
        // do nothing.
    },

    set foo(value) {
        // do nothing.
    }
};

class A {
    constructor() {
        // do nothing.
    }

    foo() {
        // do nothing.
    }

    *foo() {
        // do nothing.
    }

    get foo() {
        // do nothing.
    }

    set foo(value) {
        // do nothing.
    }

    static foo() {
        // do nothing.
    }

    static *foo() {
        // do nothing.
    }

    static get foo() {
        // do nothing.
    }

    static set foo(value) {
        // do nothing.
    }
}
```

## Options

This rule has an option to allow specific kinds of functions to be empty.

* `allow` (`string[]`) - A list of kind to allow empty functions. List items are some of the following strings. An empty array (`[]`) by default.
    * `"functions"` - Normal functions.
    * `"arrowFunctions"` - Arrow functions.
    * `"generatorFunctions"` - Generator functions.
    * `"methods"` - Class methods and method shorthands of object literals.
    * `"generatorMethods"` - Class methods and method shorthands of object literals with generator.
    * `"getters"` - Getters.
    * `"setters"` - Setters.
    * `"constructors"` - Class constructors.

#### allow: functions

Examples of **correct** code for the `{ "allow": ["functions"] }` option:

```js
/*eslint no-empty-function: ["error", { "allow": ["functions"] }]*/

function foo() {}

var foo = function() {};

var obj = {
    foo: function() {}
};
```

#### allow: arrowFunctions

Examples of **correct** code for the `{ "allow": ["arrowFunctions"] }` option:

```js
/*eslint no-empty-function: ["error", { "allow": ["arrowFunctions"] }]*/
/*eslint-env es6*/

var foo = () => {};
```

#### allow: generatorFunctions

Examples of **correct** code for the `{ "allow": ["generatorFunctions"] }` option:

```js
/*eslint no-empty-function: ["error", { "allow": ["generatorFunctions"] }]*/
/*eslint-env es6*/

function* foo() {}

var foo = function*() {};

var obj = {
    foo: function*() {}
};
```

#### allow: methods

Examples of **correct** code for the `{ "allow": ["methods"] }` option:

```js
/*eslint no-empty-function: ["error", { "allow": ["methods"] }]*/
/*eslint-env es6*/

var obj = {
    foo() {}
};

class A {
    foo() {}
    static foo() {}
}
```

#### allow: generatorMethods

Examples of **correct** code for the `{ "allow": ["generatorMethods"] }` option:

```js
/*eslint no-empty-function: ["error", { "allow": ["generatorMethods"] }]*/
/*eslint-env es6*/

var obj = {
    *foo() {}
};

class A {
    *foo() {}
    static *foo() {}
}
```

#### allow: getters

Examples of **correct** code for the `{ "allow": ["getters"] }` option:

```js
/*eslint no-empty-function: ["error", { "allow": ["getters"] }]*/
/*eslint-env es6*/

var obj = {
    get foo() {}
};

class A {
    get foo() {}
    static get foo() {}
}
```

#### allow: setters

Examples of **correct** code for the `{ "allow": ["setters"] }` option:

```js
/*eslint no-empty-function: ["error", { "allow": ["setters"] }]*/
/*eslint-env es6*/

var obj = {
    set foo(value) {}
};

class A {
    set foo(value) {}
    static set foo(value) {}
}
```

#### allow: constructors

Examples of **correct** code for the `{ "allow": ["constructors"] }` option:

```js
/*eslint no-empty-function: ["error", { "allow": ["constructors"] }]*/
/*eslint-env es6*/

class A {
    constructor() {}
}
```

## When Not To Use It

If you don't want to be notified about empty functions, then it's safe to disable this rule.

## Related Rules

* [no-empty](./no-empty.md)
