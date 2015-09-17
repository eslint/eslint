# Require Consistent This (consistent-this)

It is often necessary to capture the current execution context in order to make it available subsequently. A prominent example of this are jQuery callbacks:

```js
var self = this;
jQuery('li').click(function (event) {
    // here, "this" is the HTMLElement where the click event occurred
    self.setFoo(42);
});
```

There are many commonly used aliases for `this` such as `self`, `that` or `me`. It is desirable to ensure that whichever alias the team agrees upon is used consistently throughout the application.

## Rule Details

This rule designates a variable as the chosen alias for `this`. It then enforces two things:

* if a variable with the designated name is declared or assigned to, it *must* explicitly be assigned the current execution context, i.e. `this`
* if `this` is explicitly assigned to a variable, the name of that variable must be the designated one

### Options

This rule takes one option, a string, which is the designated `this` variable.

#### Usage

You can set the rule configuration like this:

```json
"consistent-this": [2, "self"]
```

The following patterns are considered problems:

```js
/*eslint consistent-this: [2, "self"]*/

var self = 42;   /*error Designated alias 'self' is not assigned to 'this'.*/

var that = this; /*error Unexpected alias 'that' for 'this'.*/

self = 42;       /*error Designated alias 'self' is not assigned to 'this'.*/

that = this;     /*error Unexpected alias 'that' for 'this'.*/
```

The following patterns are not considered problems:

```js
/*eslint consistent-this: [2, "self"]*/

var self = this;

var that = 42;

var that;

self = this;

foo.bar = this;
```

A declaration of an alias does not need to assign `this` in the declaration, but it must perform an appropriate assignment in the same scope as the declaration. The following patterns are also considered okay:

```js
/*eslint consistent-this: [2, "self"]*/

var self;
self = this;

var foo, self;
foo = 42;
self = this;
```

But the following pattern is considered a warning:

```js
/*eslint consistent-this: [2, "self"]*/

var self;        /*error Designated alias 'self' is not assigned to 'this'.*/
function f() {
    self = this;
}
```

## When Not To Use It

If you need to capture nested context, `consistent-this` is going to be problematic. Code of that nature is usually difficult to read and maintain and you should consider refactoring it.
