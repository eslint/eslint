---
title: no-empty-function
rule_type: suggestion
related_rules:
- no-empty
---


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

::: incorrect

```js
/*eslint no-empty-function: "error"*/

function foo() {}

const bar = function() {};

const bar1 = () => {};

function* baz() {}

const bar2 = function*() {};

const obj = {
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

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-empty-function: "error"*/

function foo() {
    // do nothing.
}

const baz = function() {
    // any clear comments.
};

const baz1 = () => {
    bar();
};

function* foobar() {
    // do nothing.
}

const baz2 = function*() {
    // do nothing.
};

const obj = {
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

:::

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
    * `"asyncFunctions"` - Async functions.
    * `"asyncMethods"` - Async class methods and method shorthands of object literals.
    * `"privateConstructors"` - Private class constructors. (TypeScript only)
    * `"protectedConstructors"` - Protected class constructors. (TypeScript only)
    * `"decoratedFunctions"` - Class methods with decorators. (TypeScript only)
    * `"overrideMethods"` - Methods that use the override keyword. (TypeScript only)

### allow: functions

Examples of **correct** code for the `{ "allow": ["functions"] }` option:

::: correct

```js
/*eslint no-empty-function: ["error", { "allow": ["functions"] }]*/

function foo() {}

const bar = function() {};

const obj = {
    foo: function() {}
};
```

:::

### allow: arrowFunctions

Examples of **correct** code for the `{ "allow": ["arrowFunctions"] }` option:

::: correct

```js
/*eslint no-empty-function: ["error", { "allow": ["arrowFunctions"] }]*/

const foo = () => {};
```

:::

### allow: generatorFunctions

Examples of **correct** code for the `{ "allow": ["generatorFunctions"] }` option:

::: correct

```js
/*eslint no-empty-function: ["error", { "allow": ["generatorFunctions"] }]*/

function* foo() {}

const bar = function*() {};

const obj = {
    foo: function*() {}
};
```

:::

### allow: methods

Examples of **correct** code for the `{ "allow": ["methods"] }` option:

::: correct

```js
/*eslint no-empty-function: ["error", { "allow": ["methods"] }]*/

const obj = {
    foo() {}
};

class A {
    foo() {}
    static foo() {}
}
```

:::

### allow: generatorMethods

Examples of **correct** code for the `{ "allow": ["generatorMethods"] }` option:

::: correct

```js
/*eslint no-empty-function: ["error", { "allow": ["generatorMethods"] }]*/

const obj = {
    *foo() {}
};

class A {
    *foo() {}
    static *foo() {}
}
```

:::

### allow: getters

Examples of **correct** code for the `{ "allow": ["getters"] }` option:

::: correct

```js
/*eslint no-empty-function: ["error", { "allow": ["getters"] }]*/

const obj = {
    get foo() {}
};

class A {
    get foo() {}
    static get foo() {}
}
```

:::

### allow: setters

Examples of **correct** code for the `{ "allow": ["setters"] }` option:

::: correct

```js
/*eslint no-empty-function: ["error", { "allow": ["setters"] }]*/

const obj = {
    set foo(value) {}
};

class A {
    set foo(value) {}
    static set foo(value) {}
}
```

:::

### allow: constructors

Examples of **correct** code for the `{ "allow": ["constructors"] }` option:

::: correct

```js
/*eslint no-empty-function: ["error", { "allow": ["constructors"] }]*/

class A {
    constructor() {}
}
```

:::

### allow: asyncFunctions

Examples of **correct** code for the `{ "allow": ["asyncFunctions"] }` options:

::: correct

```js
/*eslint no-empty-function: ["error", { "allow": ["asyncFunctions"] }]*/

async function a(){}
```

:::

### allow: asyncMethods

Examples of **correct** code for the `{ "allow": ["asyncMethods"] }` options:

::: correct

```js
/*eslint no-empty-function: ["error", { "allow": ["asyncMethods"] }]*/

const obj = {
    async foo() {}
};

class A {
    async foo() {}
    static async foo() {}
}
```

:::

### allow: privateConstructors

Examples of **correct** TypeScript code for the `{ "allow": ["privateConstructors"] }` option:

::: correct

```ts
/*eslint no-empty-function: ["error", { "allow": ["privateConstructors"] }]*/

class A {
    private constructor() {}
}
```

:::

### allow: protectedConstructors

Examples of **correct** TypeScript code for the `{ "allow": ["protectedConstructors"] }` option:

::: correct

```ts
/*eslint no-empty-function: ["error", { "allow": ["protectedConstructors"] }]*/

class A {
    protected constructor() {}
}
```

:::

### allow: decoratedFunctions

Examples of **correct** TypeScript code for the `{ "allow": ["decoratedFunctions"] }` option:

::: correct

```ts
/*eslint no-empty-function: ["error", { "allow": ["decoratedFunctions"] }]*/

class A {
    @decorator
    foo() {}
}
```

:::

### allow: overrideMethods

Examples of **correct** TypeScript code for the `{ "allow": ["overrideMethods"] }` option:

::: correct

```ts
/*eslint no-empty-function: ["error", { "allow": ["overrideMethods"] }]*/

abstract class Base {
    abstract method(): void;
}

class Derived extends Base {
    override method() {}
}
```

:::

## When Not To Use It

If you don't want to be notified about empty functions, then it's safe to disable this rule.
