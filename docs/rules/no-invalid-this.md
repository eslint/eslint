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

Otherwise are considered warnings.

### The following patterns are considered warnings:

This rule warns below **only** under the strict mode.
Please note your code in ES2015 Modules/Classes is always the strict mode.

```js
this.a = 0;
baz(() => this);
```

```js
(function() {
    this.a = 0;
    baz(() => this);
})();
```

```js
function foo() {
    this.a = 0;
    baz(() => this);
}
```

```js
var foo = function() {
    this.a = 0;
    baz(() => this);
};
```

```js
foo(function() {
    this.a = 0;
    baz(() => this);
});
```

```js
obj.foo = () => {
    // `this` of arrow functions is the outer scope's.
    this.a = 0;
};
```

```js
var obj = {
    aaa: function() {
        return function foo() {
            // There is in a method `aaa`, but `foo` is not a method.
            this.a = 0;
            baz(() => this);
        };
    }
};
```

```js
class Foo {
    static foo() {
        this.a = 0;
        baz(() => this);
    }
}
```

```js
foo.forEach(function() {
    this.a = 0;
    baz(() => this);
});
```

### The following patterns are not considered warnings:

```js
function Foo() {
    // OK, this is in a legacy style constructor.
    this.a = 0;
    baz(() => this);
}
```

```js
class Foo {
    constructor() {
        // OK, this is in a constructor.
        this.a = 0;
        baz(() => this);
    }
}
```

```js
var obj = {
    foo: function foo() {
        // OK, this is in a method (this function is on object literal).
        this.a = 0;
    }
};
```

```js
var obj = {
    foo() {
        // OK, this is in a method (this function is on object literal).
        this.a = 0;
    }
};
```

```js
var obj = {
    get foo() {
        // OK, this is in a method (this function is on object literal).
        return this.a;
    }
};
```

```js
var obj = Object.create(null, {
    foo: {value: function foo() {
        // OK, this is in a method (this function is on object literal).
        this.a = 0;
    }}
});
```

```js
Object.defineProperty(obj, "foo", {
    value: function foo() {
        // OK, this is in a method (this function is on object literal).
        this.a = 0;
    }
};
```

```js
Object.defineProperties(obj, {
    foo: {value: function foo() {
        // OK, this is in a method (this function is on object literal).
        this.a = 0;
    }}
};
```

```js
function Foo() {
    this.foo = function foo() {
        // OK, this is in a method (this function assigns to a property).
        this.a = 0;
        baz(() => this);
    };
}
```

```js
obj.foo = function foo() {
    // OK, this is in a method (this function assigns to a property).
    this.a = 0;
};
```

```js
Foo.prototype.foo = function foo() {
    // OK, this is in a method (this function assigns to a property).
    this.a = 0;
};
```

```js
class Foo {
    foo() {
        // OK, this is in a method.
        this.a = 0;
        baz(() => this);
    }
}
```

```js
var foo = (function foo() {
    // OK, the `bind` method of this function is called directly.
    this.a = 0;
}).bind(obj);
```

```js
foo.forEach(function() {
    // OK, `thisArg` of `.forEach()` is given.
    this.a = 0;
    baz(() => this);
}, thisArg);
```

```js
/** @this Foo */
function foo() {
    // OK, this function has a `@this` tag in its JSDoc comment.
    this.a = 0;
}
```

## When Not To Use It

If you don't want to be notified about usage of `this` keyword outside of classes or class-like objects, you can safely disable this rule.
