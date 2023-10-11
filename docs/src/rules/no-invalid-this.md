---
title: no-invalid-this
rule_type: suggestion
handled_by_typescript: true
extra_typescript_info: Note that, technically, TypeScript will only catch this if you have the `strict` or `noImplicitThis` flags enabled. These are enabled in most TypeScript projects, since they are considered to be best practice.
---


Under the strict mode, `this` keywords outside of classes or class-like objects might be `undefined` and raise a `TypeError`.

## Rule Details

This rule aims to flag usage of `this` keywords in contexts where the value of `this` is `undefined`.

Top-level `this` in scripts is always considered valid because it refers to the global object regardless of the strict mode.

Top-level `this` in ECMAScript modules is always considered invalid because its value is `undefined`.

For `this` inside functions, this rule basically checks whether or not the function containing `this` keyword is a constructor or a method. Note that arrow functions have lexical `this`, and that therefore this rule checks their enclosing contexts.

This rule judges from following conditions whether or not the function is a constructor:

* The name of the function starts with uppercase.
* The function is assigned to a variable which starts with an uppercase letter.
* The function is a constructor of ES2015 Classes.

This rule judges from following conditions whether or not the function is a method:

* The function is on an object literal.
* The function is assigned to a property.
* The function is a method/getter/setter of ES2015 Classes.

And this rule allows `this` keywords in functions below:

* The `call/apply/bind` method of the function is called directly.
* The function is a callback of array methods (such as `.forEach()`) if `thisArg` is given.
* The function has `@this` tag in its JSDoc comment.

And this rule always allows `this` keywords in the following contexts:

* At the top level of scripts.
* In class field initializers.
* In class static blocks.

Otherwise are considered problems.

This rule applies **only** in strict mode.
With `"parserOptions": { "sourceType": "module" }` in the ESLint configuration, your code is in strict mode even without a `"use strict"` directive.

Examples of **incorrect** code for this rule in strict mode:

::: incorrect { "sourceType": "script" }

```js
/*eslint no-invalid-this: "error"*/
/*eslint-env es6*/

"use strict";

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

:::

Examples of **correct** code for this rule in strict mode:

::: correct { "sourceType": "script" }

```js
/*eslint no-invalid-this: "error"*/
/*eslint-env es6*/

"use strict";

this.a = 0;
baz(() => this);

function Foo() {
    // OK, this is in a legacy style constructor.
    this.a = 0;
    baz(() => this);
}

class Bar {
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

class Baz {

    // OK, this is in a class field initializer.
    a = this.b;

    // OK, static initializers also have valid this.
    static a = this.b;

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

    static {
        // OK, static blocks also have valid this.
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

:::

## Options

This rule has an object option, with one option:

* `"capIsConstructor": false` (default `true`) disables the assumption that a function which name starts with an uppercase is a constructor.

### capIsConstructor

By default, this rule always allows the use of `this` in functions which name starts with an uppercase and anonymous functions that are assigned to a variable which name starts with an uppercase, assuming that those functions are used as constructor functions.

Set `"capIsConstructor"` to `false` if you want those functions to be treated as 'regular' functions.

Examples of **incorrect** code for this rule with `"capIsConstructor"` option set to `false`:

::: incorrect { "sourceType": "script" }

```js
/*eslint no-invalid-this: ["error", { "capIsConstructor": false }]*/

"use strict";

function Foo() {
    this.a = 0;
}

var bar = function Foo() {
    this.a = 0;
}

var Bar = function() {
    this.a = 0;
};

Baz = function() {
    this.a = 0;
};
```

:::

Examples of **correct** code for this rule with `"capIsConstructor"` option set to `false`:

::: correct { "sourceType": "script" }

```js
/*eslint no-invalid-this: ["error", { "capIsConstructor": false }]*/

"use strict";

obj.Foo = function Foo() {
    // OK, this is in a method.
    this.a = 0;
};
```

:::

## When Not To Use It

If you don't want to be notified about usage of `this` keyword outside of classes or class-like objects, you can safely disable this rule.
