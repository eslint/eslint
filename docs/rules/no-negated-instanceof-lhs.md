# Disallow negated left operand of `instanceof` operator (no-negated-instanceof-lhs)

## Rule Details

This error is raised to highlight a potential error. Commonly, when a developer intends to write

```js
if(!(a instanceof b)) // do something
```

they will instead write

```js
if(!a instanceof b) // do something
```

This is very often not what the developer wants and should be avoided.

## When Not To Use It

Never.

## Further Reading

None.
