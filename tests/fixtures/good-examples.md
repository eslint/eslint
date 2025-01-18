This file contains rule example code without syntax errors.

::: incorrect

```js
export default⏎
"foo";
```

:::

::: correct { "parserOptions": { "ecmaFeatures": { "jsx": true } } }

```jsx
const foo = <bar></bar>;
```

:::

A test with multiple spaces after 'correct':
<!-- markdownlint-disable-next-line no-trailing-spaces -->
:::correct  

```js
```

:::

The following code block is not a rule example, so it won't be checked:

```js
!@#$%^&*()
```

:::correct { "ecmaVersion": 3, "sourceType": "script" }

```js
var x;
```

:::

:::correct { "ecmaVersion": 5, "sourceType": "script" }

```js
var x = { import: 5 };
```

:::

:::correct { "ecmaVersion": 2015 }

```js
let x;
```

:::

:::correct { "ecmaVersion": 2024 }

```js
let x = /a/v;
```

:::
