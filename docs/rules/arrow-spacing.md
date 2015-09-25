# Require space before/after arrow function's arrow (arrow-spacing)

This rule normalize style of spacing before/after an arrow function's arrow(`=>`).

```js
/*eslint-env es6*/

// { "before": true, "after": true }
(a) => {}

// { "before": false, "after": false }
(a)=>{}
```

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

This rule takes an object argument with `before` and `after` properties, each with a Boolean value.

The default configuration is `{ "before": true, "after": true }`.

`true` means there should be **one or more spaces** and `false` means **no spaces**.

The following patterns are considered problems if `{ "before": true, "after": true }`.

```js
/*eslint arrow-spacing: 2*/
/*eslint-env es6*/

()=> {};     /*error Missing space before =>*/
() =>{};     /*error Missing space after =>*/
(a)=> {};    /*error Missing space before =>*/
(a) =>{};    /*error Missing space after =>*/
a =>a;       /*error Missing space after =>*/
a=> a;       /*error Missing space before =>*/
()=> {'\n'}; /*error Missing space before =>*/
() =>{'\n'}; /*error Missing space after =>*/
```

The following patterns are not considered problems if `{ "before": true, "after": true }`.

```js
/*eslint arrow-spacing: 2*/
/*eslint-env es6*/

() => {};
(a) => {};
a => a;
() => {'\n'};
```

The following patterns are not considered problems if `{ "before": false, "after": false }`.

```js
/*eslint arrow-spacing: [2, { "before": false, "after": false }]*/
/*eslint-env es6*/

()=>{};
(a)=>{};
a=>a;
()=>{'\n'};
```

The following patterns are not considered problems if `{ "before": true, "after": false }`.

```js
/*eslint arrow-spacing: [2, { "before": true, "after": false }]*/
/*eslint-env es6*/

() =>{};
(a) =>{};
a =>a;
() =>{'\n'};
```

The following patterns are not considered problems if `{ "before": false, "after": true }`.

```js
/*eslint arrow-spacing: [2, { "before": false, "after": true }]*/
/*eslint-env es6*/

()=> {};
(a)=> {};
a=> a;
()=> {'\n'};
```
