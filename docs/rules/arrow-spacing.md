# Require space before/after arrow function's arrow (arrow-spacing)

(fixable) The `--fix` option on the [command line](../user-guide/command-line-interface#fix) automatically fixes problems reported by this rule.

This rule normalize style of spacing before/after an arrow function's arrow(`=>`).

```js
/*eslint-env es6*/

// { "before": true, "after": true }
(a) => {}

// { "before": false, "after": false }
(a)=>{}
```

## Rule Details

This rule takes an object argument with `before` and `after` properties, each with a Boolean value.

The default configuration is `{ "before": true, "after": true }`.

`true` means there should be **one or more spaces** and `false` means **no spaces**.

The following patterns are considered problems if `{ "before": true, "after": true }`.

```js
/*eslint arrow-spacing: "error"*/
/*eslint-env es6*/

()=> {};
() =>{};
(a)=> {};
(a) =>{};
a =>a;
a=> a;
()=> {'\n'};
() =>{'\n'};
```

The following patterns are not considered problems if `{ "before": true, "after": true }`.

```js
/*eslint arrow-spacing: "error"*/
/*eslint-env es6*/

() => {};
(a) => {};
a => a;
() => {'\n'};
```

The following patterns are not considered problems if `{ "before": false, "after": false }`.

```js
/*eslint arrow-spacing: ["error", { "before": false, "after": false }]*/
/*eslint-env es6*/

()=>{};
(a)=>{};
a=>a;
()=>{'\n'};
```

The following patterns are not considered problems if `{ "before": true, "after": false }`.

```js
/*eslint arrow-spacing: ["error", { "before": true, "after": false }]*/
/*eslint-env es6*/

() =>{};
(a) =>{};
a =>a;
() =>{'\n'};
```

The following patterns are not considered problems if `{ "before": false, "after": true }`.

```js
/*eslint arrow-spacing: ["error", { "before": false, "after": true }]*/
/*eslint-env es6*/

()=> {};
(a)=> {};
a=> a;
()=> {'\n'};
```
