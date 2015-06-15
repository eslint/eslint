# Verify `super()` callings in constructors (constructor-super)

Constructors of derived classes must call `super()`.
Constructors of non derived classes must not call `super()`.
If not so, it will raise a runtime error.

This rule checks whether or not there is valid `super()` calling.

## Rule Details

This rule is aimed to flag invalid/missing `super()` callings.

The following patterns are considered warnings:

```js
class A {
    constructor() {
        super(); // unexpected `super()`.
    }
}
```

```js
class A extends null {
    constructor() {
        super(); // unexpected `super()`.
    }
}
```

```js
class A extends B {
    constructor() { } // requires `super()`.
}
```

The following patterns are not considered warnings:

```js
class A {
    constructor() { }
}
```

```js
class A extends null {
    constructor() { }
}
```

```js
class A extends B {
    constructor() {
        super();
    }
}
```

## When Not to Use It

If you don't want to be notified about invalid/missing `super()` callings in constructors, you can safely disable this rule.
