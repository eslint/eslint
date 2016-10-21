# Enforce that class methods utilize `this` (class-methods-use-this)

If a class method does not use `this`, it can safely be made a static function.

It's possible to have a class method which doesn't use `this`, such as:

```js
class A {
    constructor() {
        this.a = "hi";
    }

    print() {
        console.log(this.a);
    }

    sayHi() {
        console.log("hi");
    }
}

let a = new A();
a.sayHi(); // => "hi"
```

In the example above, the `sayHi` method doesn't use `this`, so we can make it a static method:

```js
class A {
    constructor() {
        this.a = "hi";
    }

    print() {
        console.log(this.a);
    }

    static sayHi() {
        console.log("hi");
    }
}

A.sayHi(); // => "hi"
```

Also note in the above examples that the code calling the function on an *instance* of the class (`let a = new A(); a.sayHi();`) changes to calling it on the *class* itself (`A.sayHi();`).

## Rule Details

This rule is aimed to flag class methods that do not use `this`.

Examples of **incorrect** code for this rule:

```js
/*eslint class-methods-use-this: "error"*/
/*eslint-env es6*/

class A {
    foo() {
        console.log("Hello World");     /*error Expected 'this' to be used by class method 'foo'.*/
    }
}
```

Examples of **correct** code for this rule:

```js
/*eslint class-methods-use-this: "error"*/
/*eslint-env es6*/
class A {
    foo() {
        this.bar = "Hello World"; // OK, this is used
    }
}

class A {
    constructor() {
        // OK. constructor is exempt
    }
}

class A {
    static foo() {
        // OK. static methods aren't expected to use this.
    }
}
```

## Options

### Exceptions

```
"class-methods-use-this": [<enabled>, { "exceptMethods": [<...exceptions>] }]
```

The `exceptMethods` option allows you to pass an array of method names for which you would like to ignore warnings.

Examples of **incorrect** code for this rule when used without exceptMethods:

```js
/*eslint class-methods-use-this: "error"*/

class A {
    foo() {
    }
}
```

Examples of **correct** code for this rule when used with exceptMethods:

```js
/*eslint class-methods-use-this: ["error", { "exceptMethods": ["foo"] }] */

class A {
    foo() {
    }
}
```
