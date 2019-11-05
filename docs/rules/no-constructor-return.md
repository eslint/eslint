# Disallow returning value in constructor (no-constructor-return)

In JavaScript returning value in constructor is allowed, however this looks meaningless. Forbidding this pattern prevents mistake resulting from unfamiliarity with the language or copy-paste error.

Note that returning nothing with flow control is allowed.

## Rule Details

This rule disallows return statement in constructor of a class.

Examples of **incorrect** code for this rule:

```js
/*eslint no-constructor-return: "error"*/

class A {
    constructor() {
        return 'a';
    }
}

class B {
    constructor(f) {
        if (!f) {
            return 'falsy';
        }
    }
}
```

Examples of **correct** code for this rule:

```js
/*eslint no-constructor-return: "error"*/

class C {
    constructor() { }
}

class D {
    constructor(f) {
        if (!f) {
            return;  // Flow control.
        }

        f();
    }
}
```
