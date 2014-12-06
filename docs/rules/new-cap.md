# Require Constructors to Use Initial Caps (new-cap)

The `new` operator in JavaScript creates a new instance of a particular type of object. That type of object is represented by a constructor function. Since constructor functions are just regular functions, the only defining characteristic is that `new` is being used as part of the call. Native JavaScript functions begin with an uppercase letter to distinguish those functions that are to be used as constructors from functions that are not. Many style guides recommend following this pattern to more easily determine which functions are to be used as constructors.

```js
var friend = new Person();
```

## Rule Details

This rule is aimed at helping to distinguish regular functions from constructor functions. As such, it warns whenever it sees `new` followed by an identifier that isn't capitalized or whenever it sees capitalized function called directly without `new` operator.

The following patterns are considered warnings:

```js
var friend = new person();
var colleague = Person();
```

The following patterns are considered okay and do not cause warnings:

```js
var friend = new Person();
var colleague = person();
```

## Options

By default both `newIsCap` and `capIsNew` options are set to `true`.

### newIsCap

When `true`, rule checks if all `new` operators are called only with uppercase-started functions.

### capIsNew

When `true`, rule checks if all uppercase-started functions are called only with `new` operator.

### newIsCapExceptions

Array of lowercase function names that are permitted to be used with the `new` operator.
If provided, it must be an `Array`.

### capIsNewExceptions

Array of uppercase-starting function names that are permitted to be used without the `new` operator.
If provided, it must be an `Array`.
If not provided, `capIsNewExceptions` defaults to the following:
 - `Object`
 - `Function`
 - `Number`
 - `String`
 - `Boolean`
 - `Date`
 - `Array`
 - `Symbol`
 - `RegExp`

## When Not To Use It

If you have conventions that don't require an uppercase letter for constructors, or don't require capitalized functions be only used as constructors, turn this rule off.
