# Suggest using `const` (prefer-const)

If a variable is never modified, using the `const` declaration is better.

`const` declaration tells readers, "this variable is never modified," reducing cognitive load and improving maintainability.

## Rule Details

This rule is aimed at flagging variables that are declared using `let` keyword, but never modified after the initial assignment.

The following patterns are considered warnings:

```js
let a = 3;
console.log(a);
```

```js
for (let i in [1,2,3]) { // `i` is re-defined (not modified) on each loop step.
    console.log(i);
}
```

```js
for (let a of [1,2,3]) { // `a` is re-defined (not modified) on each loop step.
    console.log(a);
}
```

The following patterns are not considered warnings:

```js
let a; // there is no initialization.
console.log(a);
```

```js
for (let i = 0, end = 10; i < end; ++i) { // `end` is never modified, but we cannot separate the declarations without modifying the scope.
    console.log(a);
}
```

```js
var a = 3; // suggest to use `no-var` rule.
console.log(a);
```

## When Not to Use It

If you don't want to be notified about variables that are never modified after initial assignment, you can safely disable this rule.

## Related

* [no-var](no-var.md)
