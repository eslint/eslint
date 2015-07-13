# Disallow Reassignment of Native Objects (no-native-reassign)

Reports an error when they encounter an attempt to assign a value to built-in native object.

```js
String = "hello world";
var String;
```

## Rule Details

The native objects reported by this rule are the `builtin` variables from [globals](https://github.com/sindresorhus/globals/).

The following patterns are considered warnings:

```js
String = new Object();
```

```js
var String;
```

## Options

This rule accepts an `exceptions` option, which can be used to specify a list of builtins for which reassignments will be allowed:

```js
{
    "rules": {
        "no-native-reassign": [2, {"exceptions": ["Object"]}]
    }
}
```

## When Not To Use It

If you are trying to override one of the native objects.

## Related Rules

* [no-extend-native](no-extend-native.md)
