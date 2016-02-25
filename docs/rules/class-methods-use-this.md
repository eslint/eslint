# Enforce that class methods utilize `this`. (class-methods-use-this)

If a class method does not use this, it can safely be made a static function.

## Rule Details

This rule is aimed to flag class methods that do not use `this`.

```js
/*eslint class-methods-use-this: 2*/
/*eslint-env es6*/

class A {
    foo() {
        console.log("Hello World");     /*error Expected 'this' to be used by class method 'foo'.*/
    }
}
```

The following patterns are not considered problems:

```js
/*eslint class-methods-use-this: 2*/
/*eslint-env es6*/
class A {
    foo() {
        this.bar = "Hello World"; // OK, this is used
    }
}

class A {
    constructor() {
        super(); // OK. constructor is exempt
    }
}

class A {
    static foo = function () {
        // OK. static methods aren't expected to use this.
    }
}
```
