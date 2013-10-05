# no logical expressions outside tests

## Rule Details

This error is raised to highlight the use of a bad practice. Logical expressions outside if, for, while and do decrease readability of the code and can lead to confusion.

The following patterns are considered warnings:

```js
v && arr.push(v)
```

The following patterns are not considered warnings:

```js
if (v) {
    arr.push(v);
}

if (v && arr.push(v)) {
    ...
}
```
