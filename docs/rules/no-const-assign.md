# Disallow modifying variables that are declared using `const` (no-const-assign)

We cannot modify variables that are declared using `const` keyword.
It will raise a runtime error.

Under non ES2015 environment, it might be ignored merely.

## Rule Details

This rule is aimed to flag modifying variables that are declared using `const` keyword.

The following patterns are considered problems:

```js
/*eslint no-const-assign: 2*/
/*eslint-env es6*/

const a = 0;
a = 1;       /*error `a` is constant.*/
```

```js
/*eslint no-const-assign: 2*/
/*eslint-env es6*/

const a = 0;
a += 1;      /*error `a` is constant.*/
```

```js
/*eslint no-const-assign: 2*/
/*eslint-env es6*/

const a = 0;
++a;         /*error `a` is constant.*/
```

The following patterns are not considered problems:

```js
/*eslint no-const-assign: 2*/
/*eslint-env es6*/

const a = 0;
console.log(a);
```

```js
/*eslint no-const-assign: 2*/
/*eslint-env es6*/

for (const a in [1, 2, 3]) { // `a` is re-defined (not modified) on each loop step.
    console.log(a);
}
```

```js
/*eslint no-const-assign: 2*/
/*eslint-env es6*/

for (const a of [1, 2, 3]) { // `a` is re-defined (not modified) on each loop step.
    console.log(a);
}
```

## When Not to Use It

If you don't want to be notified about modifying variables that are declared using `const` keyword, you can safely disable this rule.
