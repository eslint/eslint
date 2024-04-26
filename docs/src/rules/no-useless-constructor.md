---
title: no-useless-constructor
rule_type: suggestion
---


ES2015 provides a default class constructor if one is not specified. As such, it is unnecessary to provide an empty constructor or one that simply delegates into its parent class, as in the following examples:

```js
class A {
    constructor () {
    }
}

class B extends A {
    constructor (value) {
      super(value);
    }
}
```

## Rule Details

This rule flags class constructors that can be safely removed without changing how the class works.

## Examples

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-useless-constructor: "error"*/

class A {
    constructor () {
    }
}

class B extends A {
    constructor (...args) {
      super(...args);
    }
}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-useless-constructor: "error"*/

class A { }

class B {
    constructor () {
        doSomething();
    }
}

class C extends A {
    constructor() {
        super('foo');
    }
}

class D extends A {
    constructor() {
        super();
        doSomething();
    }
}
```

:::

## When Not To Use It

If you don't want to be notified about unnecessary constructors, you can safely disable this rule.
