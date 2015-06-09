# Disallow modifying variables of class declarations (no-class-assign)

`ClassDeclaration` creates a variable, and we can modify the variable.

```js
class A { }
A = 0;
```

But the modification is a mistake in most case.

## Rule Details

This rule is aimed to flag modifying variables of class declarations.

The following patterns are considered warnings:

```js
class A { }
A = 0;
```

```js
A = 0;
class A { }
```

```js
class A {
    b() {
        A = 0;
    }
}
```

```js
let A = class A {
    b() {
        A = 0; // `let A` is shadowed by the class name.
    }
}
```

The following patterns are not considered warnings:

```js
let A = class A { }
A = 0; // A is a variable.
```

```js
let A = class {
    b() {
        A = 0; // A is a variable.
    }
}
```

```js
class A {
    b(A) {
        A = 0; // A is a parameter.
    }
}
```

## When Not to Use It

If you don't want to be notified about modifying variables of class declarations, you can safely disable this rule.
