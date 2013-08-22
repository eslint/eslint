# curly

JavaScript allows the omition of curly braces when a block contains only one statement. However, it is considered by many to be best practice to _never_ omit curly braces around blocks, even when they optional, because it can lead to bugs and reduces code clarity.

```js
if (foo) return;
```

## Rule Details

This rule is aimed at preventing bugs and increasing code clarity by ensuring that block statments are wrapped in curly braces. It will warn when it encounters blocks that omit curly braces.

The following patterns are considered warnings:

```js
if (foo) return;

while (bar)
    baz();

if (foo) {
    baz();
} else qux();
```

The following patterns are not considered warnings:

```js
if (foo) {
    return;
}

while (bar) {
    baz();
}

if (foo) {
    baz();
} else {
    qux();
}
```
