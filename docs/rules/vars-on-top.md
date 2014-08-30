# Require var Statements to be at the Top of Functions (vars-on-top)

The `vars-on-top` rule generates warnings when variable declarations are not used serially at the top of a function scope.
By default variable declarations are always moved (“hoisted”) invisibly to the top of their containing scope by the JavaScript interpreter.
Even declaring variables inside various blocks (for, if-else, while, etc) would always get moved to the top.

Declaring variable inside blocks and then using them outside that block (as they are variable there too because of hoisting),
sometimes leads to errors by misuse of variable by different parts of the code.

## Rule Details

This rule aims to keep all variable declarations to the top of functions.
Allowing multiple helps promote maintainability and reduces syntax.

No variable declarations in if

```js
// BAD
function doSomething() {
    var first;
    if (true) {
        first = true;
    }
    var second; //not declared at the top
}

// GOOD
function doSomething() {
    var first;
    var second; //multiple declarations are allowed at thet op
    if (true) {
        first = true;
    }
}
```

No variable declarations in for

```js
// BAD
function doSomething() {
    for (var i=0; i<10; i++) {}
}

// GOOD
function doSomething() {
    var i;
    for (i=0; i<10; i++) {}
}
```

No variable declarations in for in

```js
// BAD
function doSomething() {
    var list = [1,2,3];
    for (var num in list) {}
}

// GOOD
function doSomething() {
    var list = [1,2,3];
    var num;
    for (num in list) {}
}
```

No variable declarations in try/catch

```js
// BAD
function doAnother() {
    try {
        var build = 1;
    } catch (e) {
        var f = build;
    }
}

// GOOD
function doAnother() {
    var build, f;
    try {
        build = 1;
    } catch (e) {
        f = build;
    }
}
```

Comments can naturally describe variables.

```js
// GOOD
function doSomething() {
    var first;
    var second
}

//ALSO GOOD
function doSomething() {
    // this is the first var.
    var first;
    // this is the second var.
    var second
}
```

## Further Reading

* [JavaScript Scoping and Hoisting](http://www.adequatelygood.com/JavaScript-Scoping-and-Hoisting.html)
* [var Hoisting](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var#var_hoisting)
* [A criticism of the Single Var Pattern in JavaScript, and a simple alternative](http://danielhough.co.uk/blog/single-var-pattern-rant/)
* [Multiple var statements in JavaScript, not superfluous](http://benalman.com/news/2012/05/multiple-var-statements-javascript/)
