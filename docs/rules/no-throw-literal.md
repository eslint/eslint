# Restrict what can be thrown as an exception (no-throw-literal)

It is considered good practice to only `throw` the `Error` object itself or an object using the `Error` object as base objects for user-defined exceptions.
The fundamental benefit of `Error` objects is that they automatically keep track of where they were built and originated.

This rule restricts what can be thrown as an exception.  When it was first created, it only prevented literals from being thrown (hence the name), but it has now been expanded to only allow expressions which have a possibility of being an `Error` object.

## Rule Details

This rule is aimed at maintaining consistency when throwing exception by disallowing to throw literals and other expressions which cannot possibly be an `Error` object.

Examples of **incorrect** code for this rule:

```js
/*eslint no-throw-literal: "error"*/
/*eslint-env es6*/

throw "error";

throw 0;

throw undefined;

throw null;

var err = new Error();
throw "an " + err;
// err is recast to a string literal

var err = new Error();
throw `${err}`

```

Examples of **correct** code for this rule:

```js
/*eslint no-throw-literal: "error"*/

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

## Known Limitations

Due to the limits of static analysis, this rule cannot guarantee that you will only throw `Error` objects.

Examples of **correct** code for this rule, but which do not throw an `Error` object:

```js
/*eslint no-throw-literal: "error"*/

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
