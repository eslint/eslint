# Require Guarding for-in (guard-for-in)

Looping over objects with a `for in` loop will include properties that are inherited through the prototype chain. This behavior can lead to unexpected items in your for loop.

```js
for (key in foo) {
    doSomething(key);
}
```

Note that simply checking `foo.hasOwnProperty(key)` is likely to cause an error in some cases; see [no-prototype-builtins](no-prototype-builtins.md).

## Rule Details

This rule is aimed at preventing unexpected behavior that could arise from using a `for in` loop without filtering the results in the loop. As such, it will warn when `for in` loops do not filter their results with an `if` statement.

Examples of **incorrect** code for this rule:

```js
/*eslint guard-for-in: "error"*/

for (key in foo) {
    doSomething(key);
}
```

Examples of **correct** code for this rule:

```js
/*eslint guard-for-in: "error"*/

for (key in foo) {
    if (Object.prototype.hasOwnProperty.call(foo, key)) {
        doSomething(key);
    }
}

for (key in foo) {
    if ({}.hasOwnProperty.call(foo, key)) {
        doSomething(key);
    }
}
```

## Related Rules

* [no-prototype-builtins](no-prototype-builtins.md)

## Further Reading

* [Exploring JavaScript for-in loops](https://javascriptweblog.wordpress.com/2011/01/04/exploring-javascript-for-in-loops/)
* [The pitfalls of using objects as maps in JavaScript](http://2ality.com/2012/01/objects-as-maps.html)
