# Disallow use of `this`/`super` before calling `super()` in constructors. (no-this-before-super)

In the constructor of derived classes, if `this`/`super` are used before `super()` calls, it raises a reference error.

This rule checks `this`/`super` keywords in constructors, then reports those that are before `super()`.

## Rule Details

This rule is aimed to flag `this`/`super` keywords before `super()` callings.

The following patterns are considered warnings:

```js
class A extends B {
    constructor() {
        this.a = 0; // this is before `super()`.
        super();
    }
}
```

```js
class A extends B {
    constructor() {
        this.foo(); // this is before `super()`.
        super();
    }
}
```

```js
class A extends B {
    constructor() {
        super.foo(); // this is before `super()`.
        super();
    }
}
```

```js
class A extends B {
    constructor() {
        super(this.foo()); // `super()` is not called yet.
    }
}
```

The following patterns are not considered warnings:

```js
class A {
    constructor() {
        this.a = 0; // OK, this class doesn't have an `extends` clause.
    }
}
```

```js
class A extends B {
    constructor() {
        super();
        this.a = 0; // OK, this is after `super()`.
    }
}
```

```js
class A extends B {
    foo() {
        this.a = 0; // OK. this is not in a constructor.
    }
}
```

## When Not to Use It

If you don't want to be notified about using `this`/`super` before `super()` in constructors, you can safely disable this rule.
