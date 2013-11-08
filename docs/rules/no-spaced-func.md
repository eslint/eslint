# no spaced func

The no-spaced-func rule does not allow gaps between the function identifier and application.

```js
fn ()
```

The following patterns are considered warnings:

```js
fn ()
```

```js
fn
()
```

The following patterns are not warnings:

```js
fn()
```

