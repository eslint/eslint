---
title: Contribute to Core Rules
eleventyNavigation:
    key: contribute core rule
    parent: contribute to eslint
    title: Contribute to Core Rules
    order: 11
---

The ESLint core rules are the rules included in the ESLint package.

## Rule Writing Documentation

For full reference information on writing rules, refer to [Custom Rules](../extend/custom-rules). Both custom rules and core rules have the same structure and API. The primary difference between core and custom rules are:

1. Core rules are included in the `eslint` package.
1. Core rules must adhere to the structure documented on this page.

## Core Rule Structure

Each core rule in ESLint has three files named with its identifier (for example, `no-extra-semi`).

* in the `lib/rules` directory: a source file (for example, `no-extra-semi.js`)
* in the `tests/lib/rules` directory: a test file (for example, `no-extra-semi.js`)
* in the `docs/src/rules` directory: a Markdown documentation file (for example, `no-extra-semi.md`)

**Important:** If you submit a **core** rule to the ESLint repository, you **must** follow some conventions explained below.

Here is the basic format of the source file for a rule:

```js
/**
 * @fileoverview Rule to disallow unnecessary semicolons
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "disallow unnecessary semicolons",
            recommended: true,
            url: "https://eslint.org/docs/rules/no-extra-semi"
        },
        fixable: "code",
        schema: [] // no options
    },
    create: function(context) {
        return {
            // callback functions
        };
    }
};
```

## Rule Unit Tests

Each bundled rule for ESLint core must have a set of unit tests submitted with it to be accepted. The test file is named the same as the source file but lives in `tests/lib/`. For example, if the rule source file is `lib/rules/foo.js` then the test file should be `tests/lib/rules/foo.js`.

ESLint provides the [`RuleTester`](../integrate/nodejs-api#ruletester) utility to make it easy to write tests for rules.

## Performance Testing

To keep the linting process efficient and unobtrusive, it is useful to verify the performance impact of new rules or modifications to existing rules.

### Overall Performance

When developing in the ESLint core repository, the `npm run perf` command gives a high-level overview of ESLint running time with all core rules enabled.

```bash
$ git checkout main
Switched to branch 'main'

$ npm run perf
CPU Speed is 2200 with multiplier 7500000
Performance Run #1:  1394.689313ms
Performance Run #2:  1423.295351ms
Performance Run #3:  1385.09515ms
Performance Run #4:  1382.406982ms
Performance Run #5:  1409.68566ms
Performance budget ok:  1394.689313ms (limit: 3409.090909090909ms)

$ git checkout my-rule-branch
Switched to branch 'my-rule-branch'

$ npm run perf
CPU Speed is 2200 with multiplier 7500000
Performance Run #1:  1443.736547ms
Performance Run #2:  1419.193291ms
Performance Run #3:  1436.018228ms
Performance Run #4:  1473.605485ms
Performance Run #5:  1457.455283ms
Performance budget ok:  1443.736547ms (limit: 3409.090909090909ms)
```

### Per-rule Performance

ESLint has a built-in method to track performance of individual rules. Setting the `TIMING` environment variable will trigger the display, upon linting completion, of the ten longest-running rules, along with their individual running time (rule creation + rule execution) and relative performance impact as a percentage of total rule processing time (rule creation + rule execution).

```bash
$ TIMING=1 eslint lib
Rule                    | Time (ms) | Relative
:-----------------------|----------:|--------:
no-multi-spaces         |    52.472 |     6.1%
camelcase               |    48.684 |     5.7%
no-irregular-whitespace |    43.847 |     5.1%
valid-jsdoc             |    40.346 |     4.7%
handle-callback-err     |    39.153 |     4.6%
space-infix-ops         |    35.444 |     4.1%
no-undefined            |    25.693 |     3.0%
no-shadow               |    22.759 |     2.7%
no-empty-class          |    21.976 |     2.6%
semi                    |    19.359 |     2.3%
```

To test one rule explicitly, combine the `--no-eslintrc`, and `--rule` options:

```bash
$ TIMING=1 eslint --no-eslintrc --rule "quotes: [2, 'double']" lib
Rule   | Time (ms) | Relative
:------|----------:|--------:
quotes |    18.066 |   100.0%
```

To see a longer list of results (more than 10), set the environment variable to another value such as `TIMING=50` or `TIMING=all`.

## Rule Naming Conventions

The rule naming conventions for ESLint are fairly simple:

* If your rule is disallowing something, prefix it with `no-` such as `no-eval` for disallowing `eval()` and `no-debugger` for disallowing `debugger`.
* If your rule is enforcing the inclusion of something, use a short name without a special prefix.
* Use dashes between words.
