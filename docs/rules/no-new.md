# Disallow new For Side Effects (no-new)

The goal of using `new` with a constructor is typically to create an object of a particular type and store that object in a variable, such as:

```js
var person = new Person();
```

It's less common to use `new` and not store the result, such as:

```js
new Person();
```

In this case, the created object is thrown away because its reference isn't stored anywhere, and in many cases, this means that the constructor should be replaced with a function that doesn't require `new` to be used.

## Rule Details

This rule is aimed at maintaining consistency and convention by disallowing constructor calls using the `new` keyword that do not assign the resulting object to a variable.

The following patterns are considered problems:

```js
/*eslint no-new: 2*/

new Thing(); /*error Do not use 'new' for side effects.*/
```

The following patterns are not considered problems:

```js
/*eslint no-new: 2*/

var thing = new Thing();

Thing();
```
