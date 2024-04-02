---
title: no-restricted-syntax
---

This file contains rule example code with syntax errors and other problems.

<!-- markdownlint-capture -->
<!-- markdownlint-disable MD040 -->
::: incorrect { "sourceType": "script" }

```
export default "foo";
```

:::
<!-- markdownlint-restore -->

:::correct

````ts
const foo = "bar";

const foo = "baz";
````

:::

:::correct

```js
/* eslint another-rule: error */
```

:::

:::correct

```js
/* eslint no-restricted-syntax: "error" */

/* eslint doesn't allow this comment */
```

:::

:::correct

```js
/* eslint no-restricted-syntax: "error" */

/* eslint no-restricted-syntax: ["error", "ArrayPattern"] */
```

:::

:::correct { "ecmaVersion": "latest" }

```js
/* eslint no-restricted-syntax: ["error", "ArrayPattern"] */
```

:::

:::correct { "ecmaVersion": 6 }

```js
/* eslint no-restricted-syntax: ["error", "ArrayPattern"] */
```

:::

:::correct

```js
/* eslint no-restricted-syntax: ["error", "ArrayPattern"] */
/* eslint-env es6 */

/*eslint-env node */
/*eslint-env*/
```

:::
