# Disallow Extending of Native Objects (no-extend-native)

In JavaScript, you can extend any object, including builtin or "native" objects. Sometimes people change the behavior of these native objects in ways that break the assumptions made about them in other parts of the code.

For example here we are overriding a builtin method that will then affect all Objects, even other builtins.

```js
// seems harmless
Object.prototype.extra = 55;

// loop through some userIds
var users = {
    "123": "Stan",
    "456": "David"
};

// not what you'd expect
for (var id in users) {
    console.log(id); // "123", "456", "extra"
}
```

A common suggestion to avoid this problem would be to wrap the inside of the `for` loop with `users.hasOwnProperty(id)`. However, if this rule is strictly enforced throughout your codebase you won't need to take that step.

## Rule Details

Disallows directly modifying the prototype of builtin objects by looking for the following styles:

* `Object.prototype.a = "a";`
* `Object.defineProperty(Array.prototype, "times", {value: 999});`

It *does not* check for any of the following less obvious approaches:

* `var x = Object; x.prototype.thing = a;`
* `eval("Array.prototype.forEach = 'muhahaha'");`
* `with(Array) { prototype.thing = 'thing'; };`
* `window.Function.prototype.bind = 'tight';`

## Options

This rule accepts an `exceptions` option, which can be used to specify a list of builtins for which extensions will be allowed:

```json
{
    "rules": {
        "no-extend-native": [2, {"exceptions": ["Object"]}]
    }
}
```

## When Not To Use It

You may want to disable this rule when working with polyfills that try to patch older versions of JavaScript with the latest spec, such as those that might `Function.prototype.bind` or `Array.prototype.forEach` in a future-friendly way.

## Related Rules

* [no-native-reassign](no-native-reassign.md)
