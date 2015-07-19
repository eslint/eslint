# Require space before/after arrow functions arrow (arrow-spacing)

This rule normalize style of spacing before/after of arrow functions arrow(`=>`).

```js
// { "before": true, "after": true }
(a) => {}

// { "before": false, "after": false }
(a)=>{}
```

## Rule Details

This rule takes an object argument with `before` and `after` properties, each with a Boolean value.

default configuration is `{ "before": true, "after": true }`.

`true` means there should be **one or more spaces** and `false` means **no spaces**.

The following patterns are considered warnings if `{ "before": true, "after": true }`.

```js
()=> {}
() =>{}
(a)=> {}
(a) =>{}
a =>a
a=> a
()=> {\n}
() =>{\n}
```

The following patterns are not warnings if `{ "before": true, "after": true }`.

```js
() => {}
(a) => {}
a => a
() => {\n}
```

The following patterns are not warnings if `{ "before": false, "after": false }`.

```js
()=>{}
(a)=>{}
a=>a
()=>{\n}
```

The following patterns are not warnings if `{ "before": true, "after": false }`.

```js
() =>{}
(a) =>{}
a =>a
() =>{\n}
```

The following patterns are not warnings if `{ "before": false, "after": true }`.

```js
()=> {}
(a)=> {}
a=> a
()=> {\n}
```
