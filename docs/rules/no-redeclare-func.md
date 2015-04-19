# Disallow Duplicate Functions (no-redeclare-func)

It is seldom intentional to overrwrite a function declared earlier in the same file.
Declaring a function twice is an easy way to unintentionally override the original function's behavior instead of
extending it. The `no-redeclare-func` rule flags the overriding of a previously defined function.

The existing rule `no-redeclare` will catch instances of declaring the following types of function duplications:


```js
function foo() {
    // does something
}

function foo() {
    // does something else
}
```

and

```js
var foo = function () {
    // does something
};

var foo = function () {
    // does something else
};

```

However, it does not help in the cases of:

```js
var proto = {};

proto.foo = function () {
    // does something
};

proto.foo = function () {
    // does something else
};
```

or

```js
function Foo () {

}

Foo.prototype.bar = function () {
    // does something
};

Foo.prototype.bar = function () {
    // does something else
};
```

That's where `no-redeclare-func` comes in

## Rule Details

This rule is aimed at preventing possible errors and unexpected behavior that might arise from accidentally overriding
a function that was defined earlier in the file. As such, it warns whenever a function is overridden in the same file
it's defined in.

The following patterns are considered warnings:

```js
var proto = {};

proto.foo = function () {
    // does something
};

proto.foo = function () {
    // does something else
};
```

```js
function Foo () {

}

Foo.prototype.bar = function () {
    // does something
};

Foo.prototype.bar = function () {
    // does something else
};
```

The following patterns are considered okay and do not cause warnings:

```js
var proto = {};

proto.sayHi = function () {
    console.log('hi');
};

proto.sayHello = function () {
    console.log('hello');
};

```

```js
function Foo () {

}

Foo.prototype.sayHi = function () {
    console.log('hi');
};

Foo.prototype.sayHello() {
    console.log('hello');
}
```
