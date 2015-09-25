# Restrict what can be thrown as an exception (no-throw-literal)

It is considered good practice to only `throw` the `Error` object itself or an object using the `Error` object as base objects for user-defined exceptions.
The fundamental benefit of `Error` objects is that they automatically keep track of where they were built and originated.

This rule restricts what can be thrown as an exception.  When it was first created, it only prevented literals from being thrown (hence the name), but it has now been expanded to only allow expressions which have a possibility of being an `Error` object.

## Rule Details

This rule is aimed at maintaining consistency when throwing exception by disallowing to throw literals and other expressions which cannot possibly be an `Error` object.

The following patterns are considered problems:

```js
/*eslint no-throw-literal: 2*/
/*eslint-env es6*/

throw "error";         /*error Expected an object to be thrown.*/

throw 0;               /*error Expected an object to be thrown.*/

throw undefined;       /*error Do not throw undefined.*/

throw null;            /*error Expected an object to be thrown.*/

var err = new Error();
throw "an " + err;     /*error Expected an object to be thrown.*/
// err is recast to a string literal

var err = new Error();
throw `${err}`         /*error Expected an object to be thrown.*/

```

The following patterns are not considered problems:

```js
/*eslint no-throw-literal: 2*/

throw new Error();

throw new Error("error");

var e = new Error("error");
throw e;

try {
    throw new Error("error");
} catch (e) {
    throw e;
}
```

### Known Limitations

Due to the limits of static analysis, this rule cannot guarantee that you will only throw `Error` objects.  For instance, the following cases do not throw an `Error` object, but they will not be considered problems:

```js
/*eslint no-throw-literal: 2*/

var err = "error";
throw err;

function foo(bar) {
    console.log(bar);
}
throw foo("error");

throw new String("error");

var foo = {
    bar: "error"
};
throw foo.bar;
```
