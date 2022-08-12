---
title: Correct and incorrect code usage 
---

To indicate correct and incorrect code usage, some code blocks can have correct and incorrect icons added to them, respectively.

## Usage

To indicate that a code block is correct or incorrect, wrap the code block in a container labeled either `correct` or `incorrect`.

Make sure to leave space above and below the markdown code block to ensure it is rendered correctly.

```text
::: correct

`` `js
function() {
    const another = [];
}
`` `
:::

::: incorrect

`` `js
function() {
    const another = [];
}
`` `
:::
```

## Examples

Correct usage:

::: correct

```js
const { ESLint } = require("eslint");

(async function main() {
  // 1. Create an instance with the `fix` option.
  const eslint = new ESLint({ fix: true });

  // 2. Lint files. This doesn't modify target files.
  const results = await eslint.lintFiles(["lib/**/*.js"]);

  // 3. Modify the files with the fixed code.
  await ESLint.outputFixes(results);

  // 4. Format the results.
  const formatter = await eslint.loadFormatter("stylish");
  const resultText = formatter.format(results);

  // 5. Output it.
  console.log(resultText);
})().catch((error) => {
  process.exitCode = 1;
  console.error(error);
});
```

:::

Incorrect usage:

::: incorrect

```js
const { ESLint } = require("eslint");

(async function main() {
  // 1. Create an instance with the `fix` option.
  const eslint = new ESLint({ fix: true });

  // 2. Lint files. This doesn't modify target files.
  const results = await eslint.lintFiles(["lib/**/*.js"]);

  // 3. Modify the files with the fixed code.
  await ESLint.outputFixes(results);

  // 4. Format the results.
  const formatter = await eslint.loadFormatter("stylish");
  const resultText = formatter.format(results);

  // 5. Output it.
  console.log(resultText);
})().catch((error) => {
  process.exitCode = 1;
  console.error(error);
});
```

:::
