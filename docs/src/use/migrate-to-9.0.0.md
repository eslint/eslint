---
title: Migrate to v9.x
eleventyNavigation:
    key: migrate to v9
    parent: use eslint
    title: Migrate to v9.x
    order: 7

---

ESLint v9.0.0 is a major release of ESLint, and as such, has several breaking changes that you need to be aware of. This guide is intended to walk you through the breaking changes.

The lists below are ordered roughly by the number of users each change is expected to affect, where the first items are expected to affect the most users.

## Table of Contents

### Breaking changes for users

* [Node.js < v18.18, v19 are no longer supported](#drop-old-node)
* [Removed multiple formatters](#removed-formatters)
* [Removed `require-jsdoc` and `valid-jsdoc` rules](#remove-jsdoc-rules)
* [`eslint:recommended` has been updated](#eslint-recommended)

### Breaking changes for plugin developers

* [Node.js < v18.18, v19 are no longer supported](#drop-old-node)
* [Removed multiple `context` methods](#removed-context-methods)
* [Removed `sourceCode.getComments()`](#removed-sourcecode-getcomments)

### Breaking changes for integration developers

* [Node.js < v18.18, v19 are no longer supported](#drop-old-node)

---

## <a name="drop-old-node"></a> Node.js < v18.18, v19 are no longer supported

ESLint is officially dropping support for these versions of Node.js starting with ESLint v9.0.0. ESLint now supports the following versions of Node.js:

* Node.js v18.18.0 and above
* Node.js v20.9.0 and above
* Node.js v21 and above

**To address:** Make sure you upgrade to at least Node.js v18.18.0 when using ESLint v9.0.0. One important thing to double check is the Node.js version supported by your editor when using ESLint via editor integrations. If you are unable to upgrade, we recommend continuing to use ESLint v8.56.0 until you are able to upgrade Node.js.

**Related issue(s):** [#17595](https://github.com/eslint/eslint/issues/17595)

## <a name="removed-formatters"></a> Removed multiple formatters

ESLint v9.0.0 has removed the following formatters from the core:

| **Removed Formatter** | **Replacement npm Package** |
|-----------------------|-----------------------------|
| `checkstyle` | `eslint-formatter-checkstyle` |
| `compact` | `eslint-formatter-compact` |
| `jslint-xml` | `eslint-formatter-jslint-xml` |
| `junit` | `eslint-formatter-junit` |
| `tap` | `eslint-formatter-tap` |
| `unix` | `eslint-formatter-unix` |
| `visualstudio` | `eslint-formatter-visualstudio` |

**To address:** If you are using any of these formatters via the `-f` command line flag, you'll need to install the respective package for the formatter.

**Related issue(s):** [#17524](https://github.com/eslint/eslint/issues/17524)

## <a name="remove-jsdoc-rules"></a> Removed `require-jsdoc` and `valid-jsdoc` rules

The `require-jsdoc` and `valid-jsdoc` rules have been removed in ESLint v9.0.0. These rules were initially deprecated in 2018.

**To address:** Use the [replacement rules](https://github.com/gajus/eslint-plugin-jsdoc/wiki/Comparison-with-deprecated-JSdoc-related-ESLint-rules) in `eslint-plugin-jsdoc`.

**Related issue(s):** [#15820](https://github.com/eslint/eslint/issues/15820)

## <a name="eslint-recommended"></a> `eslint:recommended` has been updated

Four new rules have been enabled in `eslint:recommended`:

* [`no-constant-binary-expression`](../rules/no-constant-binary-expression)
* [`no-empty-static-block`](../rules/no-empty-static-block)
* [`no-new-native-nonconstructor`](../rules/no-new-native-nonconstructor)
* [`no-unused-private-class-members`](../rules/no-unused-private-class-members)

Additionally, the following rules have been removed from `eslint:recommended`:

* [`no-extra-semi`](../rules/no-extra-semi)
* [`no-inner-declarations`](../rules/no-inner-declarations)
* [`no-mixed-spaces-and-tabs`](../rules/no-mixed-spaces-and-tabs)
* [`no-new-symbol`](../rules/no-new-symbol)

**To address:** Fix errors or disable these rules.

**Related issue(s):** [#15576](https://github.com/eslint/eslint/issues/15576), [#17446](https://github.com/eslint/eslint/issues/17446), [#17596](https://github.com/eslint/eslint/issues/17596)

## <a name="removed-context-methods"></a> Removed multiple `context` methods

ESLint v9.0.0 removes multiple deprecated methods from the `context` object and moves them onto the `SourceCode` object:

|**Removed on `context`**|**Replacement(s) on `SourceCode`**|
|-----------------------|--------------------------|
|`context.getSource()`|`sourceCode.getText()`|
|`context.getSourceLines()`|`sourceCode.getLines()`|
|`context.getAllComments()`|`sourceCode.getAllComments()`|
|`context.getNodeByRangeIndex()`|`sourceCode.getNodeByRangeIndex()`|
|`context.getComments()`|`sourceCode.getCommentsBefore()`, `sourceCode.getCommentsAfter()`, `sourceCode.getCommentsInside()`|
|`context.getCommentsBefore()`|`sourceCode.getCommentsBefore()`|
|`context.getCommentsAfter()`|`sourceCode.getCommentsAfter()`|
|`context.getCommentsInside()`|`sourceCode.getCommentsInside()`|
|`context.getJSDocComment()`|`sourceCode.getJSDocComment()`|
|`context.getFirstToken()`|`sourceCode.getFirstToken()`|
|`context.getFirstTokens()`|`sourceCode.getFirstTokens()`|
|`context.getLastToken()`|`sourceCode.getLastToken()`|
|`context.getLastTokens()`|`sourceCode.getLastTokens()`|
|`context.getTokenAfter()`|`sourceCode.getTokenAfter()`|
|`context.getTokenBefore()`|`sourceCode.getTokenBefore()`|
|`context.getTokenByRangeStart()`|`sourceCode.getTokenByRangeStart()`|
|`context.getTokens()`|`sourceCode.getTokens()`|
|`context.getTokensAfter()`|`sourceCode.getTokensAfter()`|
|`context.getTokensBefore()`|`sourceCode.getTokensBefore()`|
|`context.getTokensBetween()`|`sourceCode.getTokensBetween()`|
|`context.parserServices`|`sourceCode.parserServices`|

**To address:** Following the recommendations in the [blog post](https://eslint.org/blog/2023/09/preparing-custom-rules-eslint-v9/#from-context-to-sourcecode).

**Related Issues(s):** [#16999](https://github.com/eslint/eslint/issues/16999), [#13481](https://github.com/eslint/eslint/issues/13481)

## <a name="removed-sourcecode-getcomments"></a> Removed `sourceCode.getComments()`

ESLint v9.0.0 removes the deprecated `sourceCode.getComments()` method.

**To address:** Replace with `sourceCode.getCommentsBefore()`, `sourceCode.getCommentsAfter()`, or `sourceCode.getCommentsInside()`.

**Related Issues(s):** [#14744](https://github.com/eslint/eslint/issues/14744)
