# Disallow Functions in Loops (no-loop-func)

Writing functions within loops tends to result in errors due to the way the function creates a closure around the loop. For example:

```js
for (var i = 0; i < 10; i++) {
    funcs[i] = function() {
        return i;
    };
}
```

In this case, you would expect each function created within the loop to return a different number. In reality, each function returns 10, because that was the last value of `i` in the scope.

`let` or `const` mitigate this problem.

```js
for (let i = 0; i < 10; i++) {
    funcs[i] = function() {
        return i;
    };
}
```

In this case, each function created within the loop returns a different number as expected.


## Rule Details

This error is raised to highlight a piece of code that may not work as you expect it to and could also indicate a misunderstanding of how the language works. Your code may run without any problems if you do not fix this error, but in some situations it could behave unexpectedly.

The following patterns are considered warnings:

```js
for (var i=10; i; i--) {
    (function() { return i; })();
}
```

```js
while(i) {
    var a = function() { return i; };
    a();
}
```

```js
do {
    function a() { return i; };
    a();
} while (i);
```

```js
let foo = 0;
for (let i=10; i; i--) {
    var a = function() { return foo; }; // Bad, function is referencing block scoped variable in the outer scope.
    a();
}
```

The following patterns are considered okay and do not cause warnings:

```js
var a = function() {};

for (var i=10; i; i--) {
    a();
}
```

```js
for (var i=10; i; i--) {
    var a = function() {}; // OK, no references to variables in the outer scopes.
    a();
}
```

```js
for (let i=10; i; i--) {
    var a = function() { return i; }; // OK, all references are referring to block scoped variable in the loop.
    a();
}
```

## Further Reading

* [Don't make functions within a loop](http://jslinterrors.com/dont-make-functions-within-a-loop/)
