---
title: no-class-assign
rule_type: problem
---



`ClassDeclaration` creates a variable, and we can modify the variable.

```js
class A { }
A = 0;
```

But the modification is a mistake in most cases.

## Rule Details

This rule is aimed to flag modifying variables of class declarations.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-class-assign: "error"*/

class A { }
A = 0;
```

:::

::: incorrect

```js
/*eslint no-class-assign: "error"*/

A = 0;
class A { }
```

:::

::: incorrect

```js
/*eslint no-class-assign: "error"*/

class A {
    b() {
        A = 0;
    }
}
```

:::

::: incorrect

```js
/*eslint no-class-assign: "error"*/

let A = class A {
    b() {
        A = 0;
        // `let A` is shadowed by the class name.
    }
}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-class-assign: "error"*/

let A = class A { }
A = 0; // A is a variable.
```

:::

::: correct

```js
/*eslint no-class-assign: "error"*/

let A = class {
    b() {
        A = 0; // A is a variable.
    }
}
```

:::

::: correct

```js
/*eslint no-class-assign: 2*/

class A {
    b(A) {
        A = 0; // A is a parameter.
    }
}
```

:::

## When Not To Use It

If you don't want to be notified about modifying variables of class declarations, you can safely disable this rule.
