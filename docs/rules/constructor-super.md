# Verify calls of `super()` in constructors (constructor-super)

Constructors of derived classes must call `super()`.
Constructors of non derived classes must not call `super()`.
If this is not observed, the javascript engine will raise a runtime error.

This rule checks whether or not there is a valid `super()` call.

## Rule Details

This rule is aimed to flag invalid/missing `super()` calls.

The following patterns are considered problems:

```js
/*eslint constructor-super: 2*/
/*eslint-env es6*/

class A {
    constructor() {
        super();       /*error unexpected `super()`.*/
    }
}

class A extends null {
    constructor() {
        super();       /*error unexpected `super()`.*/
    }
}

class A extends B {
    constructor() { }  /*error this constructor requires `super()`.*/
}
```

The following patterns are not considered problems:

```js
/*eslint constructor-super: 2*/
/*eslint-env es6*/

class A {
    constructor() { }
}

class A extends null {
    constructor() { }
}

class A extends B {
    constructor() {
        super();
    }
}
```

## When Not to Use It

If you don't want to be notified about invalid/missing `super()` callings in constructors, you can safely disable this rule.
