# Disallow negated left operand of `in` operator (no-negated-in-lhs)

## Rule Details

This error is raised to highlight a potential error. Commonly, when a developer intends to write

```js
if(!(a in b)) {
    // do something
}
```

they will instead write

```js
if(!a in b) {
    // do something
}
```

If one intended the original behaviour, the left operand should be explicitly coerced to a string like below.

```js
if(('' + !a) in b) {
    // do something
}
```

The following patterns are considered problems:

```js
/*eslint no-negated-in-lhs: 2*/

if(!a in b) {       /*error The `in` expression's left operand is negated*/
    // do something
}
```

The following patterns are not considered problems:

```js
/*eslint no-negated-in-lhs: 2*/

if(!(a in b)) {
    // do something
}

if(('' + !a) in b) {
    // do something
}
```

## When Not To Use It

Never.

## Further Reading

None.
