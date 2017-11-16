# Verify calls of `super()` in constructors (constructor-super)

Constructors of derived classes must call `super()`.
Constructors of non derived classes must not call `super()`.
If this is not observed, the JavaScript engine will raise a runtime error.

This rule checks whether or not there is a valid `super()` call.

## Rule Details

This rule is aimed to flag invalid/missing `super()` calls.

Examples of **incorrect** code for this rule:

```js
/*eslint constructor-super: "error"*/
/*eslint-env es6*/

class A {
    constructor() {
        super();  // This is a SyntaxError.
    }
}

class A extends B {
    constructor() { }  // Would throw a ReferenceError.
}

// Classes which inherits from a non constructor are always problems.
class A extends null {
    constructor() {
        super();  // Would throw a TypeError.
    }
}

class A extends null {
    constructor() { }  // Would throw a ReferenceError.
}
```

Examples of **correct** code for this rule:

```js
/*eslint constructor-super: "error"*/
/*eslint-env es6*/

class A {
    constructor() { }
}

class A extends B {
    constructor() {
        super();
    }
}
```

## When Not To Use It

If you don't want to be notified about invalid/missing `super()` callings in constructors, you can safely disable this rule.
