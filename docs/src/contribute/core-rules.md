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

For full reference information on writing rules, refer to [Custom Rules](../extend/custom-rules). Both custom rules and core rules have the same API. The primary difference between core and custom rules are:

1. Core rules are included in the `eslint` package.
1. Core rules must adhere to the conventions documented on this page.

## File Structure

Each core rule in ESLint has three files named with its identifier (for example, `no-extra-semi`).

* in the `lib/rules` directory: a source file (for example, `no-extra-semi.js`)
* in the `tests/lib/rules` directory: a test file (for example, `no-extra-semi.js`)
* in the `docs/src/rules` directory: a Markdown documentation file (for example, `no-extra-semi.md`)

**Important:** If you submit a core rule to the ESLint repository, you **must** follow the conventions explained below.

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

/** @type {import('../shared/types').Rule} */
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

To learn how to profile the performance of individual rules, refer to [Profile Rule Performance](../extend/custom-rules#profile-rule-performance) in the custom rules documentation.

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

## Rule Naming Conventions

The rule naming conventions for ESLint are as follows:

* Use dashes between words.
* If your rule only disallows something, prefix it with `no-` such as `no-eval` for disallowing `eval()` and `no-debugger` for disallowing `debugger`.
* If your rule is enforcing the inclusion of something, use a short name without a special prefix.
