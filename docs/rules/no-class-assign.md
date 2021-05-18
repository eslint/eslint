# Disallow modifying variables of class declarations (no-class-assign)

`ClassDeclaration` creates a variable, and we can modify the variable.

```js
/*eslint-env es6*/

class A { }
A = 0;
```

But the modification is a mistake in most cases.

## Rule Details

This rule is aimed to flag modifying variables of class declarations.

Examples of **incorrect** code for this rule:

```js
/*eslint no-class-assign: "error"*/
/*eslint-env es6*/

class A { }
A = 0;
```

```js
/*eslint no-class-assign: "error"*/
/*eslint-env es6*/

A = 0;
class A { }
```

```js
/*eslint no-class-assign: "error"*/
/*eslint-env es6*/

class A {
    b() {
        A = 0;
    }
}
```

```js
/*eslint no-class-assign: "error"*/
/*eslint-env es6*/

let A = class A {
    b() {
        A = 0;
        // `let A` is shadowed by the class name.
    }
}
```

Examples of **correct** code for this rule:

```js
/*eslint no-class-assign: "error"*/
/*eslint-env es6*/

let A = class A { }
A = 0; // A is a variable.
```

```js
/*eslint no-class-assign: "error"*/
/*eslint-env es6*/

let A = class {
    b() {
        A = 0; // A is a variable.
    }
}
```

```js
/*eslint no-class-assign: 2*/
/*eslint-env es6*/

class A {
    b(A) {
        A = 0; // A is a parameter.
    }
}
```

## When Not To Use It

If you don't want to be notified about modifying variables of class declarations, you can safely disable this rule.
