# Require Constructors to Use Initial Caps (new-cap)

The `new` operator in JavaScript creates a new instance of a particular type of object. That type of object is represented by a constructor function. Since constructor functions are just regular functions, the only defining characteristic is that `new` is being used as part of the call. Native JavaScript functions begin with an uppercase letter to distinguish those functions that are to be used as constructors from functions that are not. Many style guides recommend following this pattern to more easily determine which functions are to be used as constructors.

```js
var friend = new Person();
```

## Rule Details

This rule is aimed at helping to distinguish regular functions from constructor functions. As such, it warns whenever it sees `new` followed by an identifier that isn't capitalized or whenever it sees capitalized function called directly without `new` operator.

The following patterns are considered problems:

```js
/*eslint new-cap: 2*/

var friend = new person(); /*error A constructor name should not start with a lowercase letter.*/
var colleague = Person();  /*error A function with a name starting with an uppercase letter should only be used as a constructor.*/
```

The following patterns are not considered problems:

```js
/*eslint new-cap: 2*/

var friend = new Person();
var colleague = person();
```

```js
/*eslint new-cap: [2, {"capIsNewExceptions": ["Person"]}]*/

var colleague = Person();
var colleague = foo.Person();
var colleague = foo.bar.Person();
```

```js
/*eslint new-cap: [2, {"capIsNewExceptions": ["foo.Person"]}]*/

var colleague = foo.Person();
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

Array of uppercase-starting function names that are permitted to be used without the `new` operator. If not provided, `capIsNewExceptions` defaults to the following:

* `Array`
* `Boolean`
* `Date`
* `Error`
* `Function`
* `Number`
* `Object`
* `RegExp`
* `String`
* `Symbol`

If provided, it must be an `Array`. The default values will continue to be excluded when `capIsNewExceptions` is provided.

### properties

By default, this rule will check properties such as `object.Property` using the other options (default value is `true`). When set to `false`, this rule will not check properties so `new object.property()` is valid even when `newIsCap` is `true`.

## When Not To Use It

If you have conventions that don't require an uppercase letter for constructors, or don't require capitalized functions be only used as constructors, turn this rule off.
