This file contains rule example code without syntax errors.

::: incorrect

```js
export default⏎
"foo";
```

:::

::: correct { "ecmaFeatures": { "jsx": true } }

```jsx
const foo = <bar></bar>;
```

:::

The following code block is not a rule example, so it won't be checked:

```js
!@#$%^&*()
```
