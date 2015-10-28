# Disallow `this` keywords outside of classes or class-like objects. (no-invalid-this)

Under the strict mode, `this` keywords outside of classes or class-like objects might be `undefined` and raise a `TypeError`.

## Rule Details

This rule aims to flag usage of `this` keywords outside of classes or class-like objects.

Basically this rule checks whether or not a function which are containing `this` keywords is a constructor or a method.

This rule judges from following conditions whether or not the function is a constructor:

* The name of the function starts with uppercase.
* The function is a constructor of ES2015 Classes.

This rule judges from following conditions whether or not the function is a method:

* The function is on an object literal.
* The function assigns to a property.
* The function is a method/getter/setter of ES2015 Classes. (excepts static methods)

And this rule allows `this` keywords in functions below:

* The `call/apply/bind` method of the function is called directly.
* The function is a callback of array methods (such as `.forEach()`) if `thisArg` is given.
* The function has `@this` tag in its JSDoc comment.

Otherwise are considered problems.

### The following patterns are considered problems:

This rule warns below **only** under the strict mode.
Please note your code in ES2015 Modules/Classes is always the strict mode.

```js
/*eslint no-invalid-this: 2*/
/*eslint-env es6*/

this.a = 0;            /*error Unexpected `this`.*/
baz(() => this);       /*error Unexpected `this`.*/

(function() {
    this.a = 0;        /*error Unexpected `this`.*/
    baz(() => this);   /*error Unexpected `this`.*/
})();

function foo() {
    this.a = 0;        /*error Unexpected `this`.*/
    baz(() => this);   /*error Unexpected `this`.*/
}

var foo = function() {
    this.a = 0;        /*error Unexpected `this`.*/
    baz(() => this);   /*error Unexpected `this`.*/
};

foo(function() {
    this.a = 0;        /*error Unexpected `this`.*/
    baz(() => this);   /*error Unexpected `this`.*/
});

obj.foo = () => {
    // `this` of arrow functions is the outer scope's.
    this.a = 0;        /*error Unexpected `this`.*/
};

var obj = {
    aaa: function() {
        return function foo() {
            // There is in a method `aaa`, but `foo` is not a method.
            this.a = 0;      /*error Unexpected `this`.*/
            baz(() => this); /*error Unexpected `this`.*/
        };
    }
};

class Foo {
    static foo() {
        this.a = 0;      /*error Unexpected `this`.*/
        baz(() => this); /*error Unexpected `this`.*/
    }
}

foo.forEach(function() {
    this.a = 0;          /*error Unexpected `this`.*/
    baz(() => this);     /*error Unexpected `this`.*/
});
```

### The following patterns are not considered problems:

```js
/*eslint no-invalid-this: 2*/
/*eslint-env es6*/

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
