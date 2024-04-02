---
title: no-this-before-super
rule_type: problem
handled_by_typescript: true
---



In the constructor of derived classes, if `this`/`super` are used before `super()` calls, it raises a reference error.

This rule checks `this`/`super` keywords in constructors, then reports those that are before `super()`.

## Rule Details

This rule is aimed to flag `this`/`super` keywords before `super()` callings.

## Examples

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-this-before-super: "error"*/

class A1 extends B {
    constructor() {
        this.a = 0;
        super();
    }
}

class A2 extends B {
    constructor() {
        this.foo();
        super();
    }
}

class A3 extends B {
    constructor() {
        super.foo();
        super();
    }
}

class A4 extends B {
    constructor() {
        super(this.foo());
    }
}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-this-before-super: "error"*/

class A1 {
    constructor() {
        this.a = 0; // OK, this class doesn't have an `extends` clause.
    }
}

class A2 extends B {
    constructor() {
        super();
        this.a = 0; // OK, this is after `super()`.
    }
}

class A3 extends B {
    foo() {
        this.a = 0; // OK. this is not in a constructor.
    }
}
```

:::

## When Not To Use It

If you don't want to be notified about using `this`/`super` before `super()` in constructors, you can safely disable this rule.
