# Disallow `this` keywords outside of classes or class-like objects. (no-invalid-this)

Under the strict mode, `this` keywords outside of classes or class-like objects might be `undefined` and raise a `TypeError`.

## Rule Details

This rule aims to flag usage of `this` keywords outside of classes or class-like objects.

Basically, this rule checks whether or not a function containing `this` keyword is a constructor or a method.

This rule judges from following conditions whether or not the function is a constructor:

* The name of the function starts with uppercase.
* The function is assigned to a variable which starts with an uppercase letter.
* The function is a constructor of ES2015 Classes.

This rule judges from following conditions whether or not the function is a method:

* The function is on an object literal.
* The function is assigned to a property.
* The function is a method/getter/setter of ES2015 Classes. (excepts static methods)

And this rule allows `this` keywords in functions below:

* The `call/apply/bind` method of the function is called directly.
* The function is a callback of array methods (such as `.forEach()`) if `thisArg` is given.
* The function has `@this` tag in its JSDoc comment.

Otherwise are considered problems.

This rule applies **only** in strict mode.
With `"parserOptions": { "sourceType": "module" }` in the ESLint configuration, your code is in strict mode even without a `"use strict"` directive.

Examples of **incorrect** code for this rule in strict mode:

```js
/*eslint no-invalid-this: "error"*/
/*eslint-env es6*/

"use strict";

this.a = 0;
baz(() => this);

(function() {
    this.a = 0;
    baz(() => this);
})();

function foo() {
    this.a = 0;
    baz(() => this);
}

var foo = function() {
    this.a = 0;
    baz(() => this);
};

foo(function() {
    this.a = 0;
    baz(() => this);
});

obj.foo = () => {
    // `this` of arrow functions is the outer scope's.
    this.a = 0;
};

var obj = {
    aaa: function() {
        return function foo() {
            // There is in a method `aaa`, but `foo` is not a method.
            this.a = 0;
            baz(() => this);
        };
    }
};

foo.forEach(function() {
    this.a = 0;
    baz(() => this);
});
```

Examples of **correct** code for this rule in strict mode:

```js
/*eslint no-invalid-this: "error"*/
/*eslint-env es6*/

"use strict";

function Foo() {
    // OK, this is in a legacy style constructor.
    this.a = 0;
    baz(() => this);
}

class Foo {
    constructor() {
        // OK, this is in a constructor.
        this.a = 0;
        baz(() => this);
    }
}

var obj = {
    foo: function foo() {
        // OK, this is in a method (this function is on object literal).
        this.a = 0;
    }
};

var obj = {
    foo() {
        // OK, this is in a method (this function is on object literal).
        this.a = 0;
    }
};

var obj = {
    get foo() {
        // OK, this is in a method (this function is on object literal).
        return this.a;
    }
};

var obj = Object.create(null, {
    foo: {value: function foo() {
        // OK, this is in a method (this function is on object literal).
        this.a = 0;
    }}
});

Object.defineProperty(obj, "foo", {
    value: function foo() {
        // OK, this is in a method (this function is on object literal).
        this.a = 0;
    }
});

Object.defineProperties(obj, {
    foo: {value: function foo() {
        // OK, this is in a method (this function is on object literal).
        this.a = 0;
    }}
});

function Foo() {
    this.foo = function foo() {
        // OK, this is in a method (this function assigns to a property).
        this.a = 0;
        baz(() => this);
    };
}

obj.foo = function foo() {
    // OK, this is in a method (this function assigns to a property).
    this.a = 0;
};

Foo.prototype.foo = function foo() {
    // OK, this is in a method (this function assigns to a property).
    this.a = 0;
};

class Foo {
    foo() {
        // OK, this is in a method.
        this.a = 0;
        baz(() => this);
    }

    static foo() {
        // OK, this is in a method (static methods also have valid this).
        this.a = 0;
        baz(() => this);
    }
}

var foo = (function foo() {
    // OK, the `bind` method of this function is called directly.
    this.a = 0;
}).bind(obj);

foo.forEach(function() {
    // OK, `thisArg` of `.forEach()` is given.
    this.a = 0;
    baz(() => this);
}, thisArg);

/** @this Foo */
function foo() {
    // OK, this function has a `@this` tag in its JSDoc comment.
    this.a = 0;
}
```

## When Not To Use It

If you don't want to be notified about usage of `this` keyword outside of classes or class-like objects, you can safely disable this rule.
