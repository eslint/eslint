# new cap

The `new` operator in JavaScript creates a new instance of a particular type of object. That type of object is represented by a constructor function. Since constructor functions are just regular functions, the only defining characteristic is that `new` is being used as part of the call. Native JavaScript functions begin with an uppercase letter to distinguish those functions that are to be used as constructors from functions that are not. Many style guides recommend following this pattern to more easily determine which functions are to e used as constructors.

```js
var friend = new Person();
```

## Rule Details

This rule is aimed at helping to distinguish regular functions from constructor functions. As such, it warns whenever it sees `new` followed by an identifier that isn't capitalized.

The following patterns are considered warnings:

```js
var friend = new person();
```

The following patterns are considered okay and do not cause warnings:

```js
var friend = new Person();
```

## When Not To Use It

If you have conventions that don't require an uppercase letter for constructors, turn this rule off.
