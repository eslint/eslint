# Prefer destructuring from arrays and objects (prefer-destructuring)

With JavaScript ES6, a new syntax was added for creating variables from an array index of object property, called [destructuring](#further-reading).  This rule enforces usage of destructuring instead of accessing a property through a member expression.

## Rule Details

The following patterns are considered warnings:

```javascript
// With `array` enabled
var foo = array[0];

// With `object` enabled
var foo = object.foo;
var foo = object['foo'];
```

The following patterns are not warnings:

```javascript
// With `array` enabled
var [ foo ] = array;

// With `object` enabled
var { foo } = object;
```

### Options

This rule takes two properties, `array` and `object`, which can be used to turn on or off the destructuring requirement for each of those types independently.  By default, both are `true`.  If you want to change the behavior, you can configure the rule like so:

```json
{
  "rules": {
    "ember-suave/prefer-destructuring": ["error", {
      "array": true,
      "object": true
    }]
  }
}
```

## When Not To Use It

If you want to be able to access array indices or object properties directly, you can either configure the rule to your tastes or disable the rule entirely.

## Further Reading

If you want to learn more about destructuring, check out the links below:

- [Destructuring Assignment (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
- [Destructuring and parameter handling in ECMAScript 6 (2ality blog)](http://www.2ality.com/2015/01/es6-destructuring.html)
