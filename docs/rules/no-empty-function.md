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

The following patterns are considered problems:

```js
/*eslint no-empty-function: 2*/

function foo() {}             /*error Unexpected empty function.*/

var foo = function() {};      /*error Unexpected empty function.*/

var foo = () => {};           /*error Unexpected empty arrow function.*/

function* foo() {}            /*error Unexpected empty generator function.*/

var foo = function*() {};     /*error Unexpected empty generator function.*/

var obj = {
    foo: function() {},       /*error Unexpected empty function.*/

    foo: function*() {},      /*error Unexpected empty generator function.*/

    foo() {},                 /*error Unexpected empty method.*/

    *foo() {},                /*error Unexpected empty generator method.*/

    get foo() {},             /*error Unexpected empty getter.*/

    set foo(value) {}         /*error Unexpected empty setter.*/
};

class A {
    constructor() {}          /*error Unexpected empty constructor.*/

    foo() {}                  /*error Unexpected empty method.*/

    *foo() {}                 /*error Unexpected empty generator method.*/

    get foo() {}              /*error Unexpected empty getter.*/

    set foo(value) {}         /*error Unexpected empty setter.*/

    static foo() {}           /*error Unexpected empty method.*/

    static *foo() {}          /*error Unexpected empty generator method.*/

    static get foo() {}       /*error Unexpected empty getter.*/

    static set foo(value) {}  /*error Unexpected empty setter.*/
}
```

The following patterns are not considered problems:

```js
/*eslint no-empty-function: 2*/

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

```json
{
    "no-empty-function": [2, {"allow": []}]
}
```

This rule has an option to allow empty of specific kind's functions.

* `allow` (`string[]`) - A list of kind to allow empty functions. List items are some of the following strings. An empty array (`[]`) by default.
    * `"functions"` - Normal functions.
    * `"arrowFunctions"` - Arrow functions.
    * `"generatorFunctions"` - Generator functions.
    * `"methods"` - Class methods and method shorthands of object literals.
    * `"generatorMethods"` - Class methods and method shorthands of object literals with generator.
    * `"getters"` - Getters.
    * `"setters"` - Setters.
    * `"constructors"` - Class constructors.

The following patterns are not considered problems when configured with `{"allow": ["functions"]}`:

```js
/*eslint no-empty-function: [2, {"allow": ["functions"]}]*/

function foo() {}

var foo = function() {};

var obj = {
    foo: function() {}
};
```

The following patterns are not considered problems when configured with `{"allow": ["arrowFunctions"]}`:

```js
/*eslint no-empty-function: [2, {"allow": ["arrowFunctions"]}]*/

var foo = () => {};
```

The following patterns are not considered problems when configured with `{"allow": ["generatorFunctions"]}`:

```js
/*eslint no-empty-function: [2, {"allow": ["generatorFunctions"]}]*/

function* foo() {}

var foo = function*() {};

var obj = {
    foo: function*() {}
};
```

The following patterns are not considered problems when configured with `{"allow": ["methods"]}`:

```js
/*eslint no-empty-function: [2, {"allow": ["methods"]}]*/

var obj = {
    foo() {}
};

class A {
    foo() {}
    static foo() {}
}
```

The following patterns are not considered problems when configured with `{"allow": ["generatorMethods"]}`:

```js
/*eslint no-empty-function: [2, {"allow": ["generatorMethods"]}]*/

var obj = {
    *foo() {}
};

class A {
    *foo() {}
    static *foo() {}
}
```

The following patterns are not considered problems when configured with `{"allow": ["getters"]}`:

```js
/*eslint no-empty-function: [2, {"allow": ["getters"]}]*/

var obj = {
    get foo() {}
};

class A {
    get foo() {}
    static get foo() {}
}
```

The following patterns are not considered problems when configured with `{"allow": ["setters"]}`:

```js
/*eslint no-empty-function: [2, {"allow": ["setters"]}]*/

var obj = {
    set foo(value) {}
};

class A {
    set foo(value) {}
    static set foo(value) {}
}
```

The following patterns are not considered problems when configured with `{"allow": ["constructors"]}`:

```js
/*eslint no-empty-function: [2, {"allow": ["constructors"]}]*/

class A {
    constructor() {}
}
```

## When Not To Use It

If you don't want to be notified about empty functions, then it's safe to disable this rule.

## Related Rules

* [no-empty](./no-empty.md)
