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
/*eslint-env es6*/

for (let i = 0; i < 10; i++) {
    funcs[i] = function() {
        return i;
    };
}
```

In this case, each function created within the loop returns a different number as expected.


## Rule Details

This error is raised to highlight a piece of code that may not work as you expect it to and could also indicate a misunderstanding of how the language works. Your code may run without any problems if you do not fix this error, but in some situations it could behave unexpectedly.

This rule disallows any function within a loop that contains unsafe references (e.g. to modified variables from the outer scope).

Examples of **incorrect** code for this rule:

```js
/*eslint no-loop-func: "error"*/
/*eslint-env es6*/

for (var i=10; i; i--) {
    (function() { return i; })();
}

while(i) {
    var a = function() { return i; };
    a();
}

do {
    function a() { return i; };
    a();
} while (i);

let foo = 0;
for (let i = 0; i < 10; ++i) {
    //Bad, `foo` is not in the loop-block's scope and `foo` is modified in/after the loop
    setTimeout(() => console.log(foo));
    foo += 1;
}

for (let i = 0; i < 10; ++i) {
    //Bad, `foo` is not in the loop-block's scope and `foo` is modified in/after the loop
    setTimeout(() => console.log(foo));
}
foo = 100;
```

Examples of **correct** code for this rule:

```js
/*eslint no-loop-func: "error"*/
/*eslint-env es6*/

var a = function() {};

for (var i=10; i; i--) {
    a();
}

for (var i=10; i; i--) {
    var a = function() {}; // OK, no references to variables in the outer scopes.
    a();
}

for (let i=10; i; i--) {
    var a = function() { return i; }; // OK, all references are referring to block scoped variables in the loop.
    a();
}

var foo = 100;
for (let i=10; i; i--) {
    var a = function() { return foo; }; // OK, all references are referring to never modified variables.
    a();
}
//... no modifications of foo after this loop ...
```
