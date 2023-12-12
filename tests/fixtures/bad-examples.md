---
title: no-restricted-syntax
---

This file contains rule example code with syntax errors.

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
