# Require file to end with single newline (eol-last)

Having newline at the end of file is not mandatory requirement, like in other
languages, but still a good practice. It protects you from side effects if
you ever decide to concatenate files in post-processors. Another practical
reason is removing red markers, when you look diffs at github.

Also, this rule checks, that there a no tail of multiple empty lines at the end.

## Rule Details

The following patterns are considered warnings:

```js
function doSmth() {
  ...
}
```

```js
function doSmth() {
  ...
}



```

The following patterns are not warnings:

```js
function doSmth() {
  ...
}

```
