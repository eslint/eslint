# Prefer destructuring from arrays and objects (prefer-destructuring)

With JavaScript ES6, a new syntax was added for creating variables from an array index or object property, called [destructuring](#further-reading).  This rule enforces usage of destructuring instead of accessing a property through a member expression.

## Rule Details

Examples of **incorrect** code for this rule:

```javascript
// With `array` enabled
var foo = array[0];

// With `object` enabled
var foo = object.foo;
var foo = object['foo'];
```

Examples of **correct** code for this rule:

```javascript
// With `array` enabled
var [ foo ] = array;
var foo = array[someIndex];

// With `object` enabled
var { foo } = object;
var foo = object.bar;
```

### Options

This rule takes two sets of configuration objects; the first controls the types that the rule is applied to, and the second controls the way those objects are evaluated.

The first has two properties, `array` and `object`, which can be used to turn on or off the destructuring requirement for each of those types independently.  By default, both are `true`.

The second has a single property, `enforceForRenamedProperties`, that controls whether or not the `object` destructuring rules are applied in cases where the variable requires the property being access to be renamed.

Examples of **incorrect** code when `enforceForRenamedProperties` is enabled:

```javascript
var foo = object.bar;
```

Examples of **correct** code when `enforceForRenamedProperties` is enabled:

```javascript
var { bar: foo } = object;
```

An example configuration, with the defaults filled in, looks like this:

```json
{
  "rules": {
    "prefer-destructuring": ["error", {
      "array": true,
      "object": true
    }, {
      "enforceForRenamedProperties": false
    }]
  }
}
```

## When Not To Use It

If you want to be able to access array indices or object properties directly, you can either configure the rule to your tastes or disable the rule entirely.

Additionally, if you intend to access large array indices directly, like:

```javascript
var foo = array[100];
```

Then the `array` part of this rule is not recommended, as destructuring does not match this use case very well.


## Further Reading

If you want to learn more about destructuring, check out the links below:

- [Destructuring Assignment (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
- [Destructuring and parameter handling in ECMAScript 6 (2ality blog)](http://www.2ality.com/2015/01/es6-destructuring.html)
