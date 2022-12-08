---
title: Migrating to v1.0.0

---

ESLint v1.0.0 is the first major version release. As a result, there are some significant changes between how ESLint worked during its life in 0.x and how it will work going forward. These changes are the direct result of feedback from the ESLint community of users and were not made without due consideration for the upgrade path. We believe that these changes make ESLint even better, and while some work is necessary to upgrade, we hope the pain of this upgrade is small enough that you will see the benefit of upgrading.

## All Rules Off by Default

The most important difference in v1.0.0 is that all rules are off by default. We made this change after numerous requests to allow turning off the default rules from within configuration files. While that wasn't technically feasible, it was feasible to have all rules off by default and then re-enable rules in configuration files using `extends`. As such, we've made the `--reset` behavior the default and removed this command line option.

When using `--init`, your configuration file will automatically include the following line:

```json
{
    "extends": "eslint:recommended"
}
```

This setting mimics some of the default behavior from 0.x, but not all. If you don't want to use any of the recommended rules, you can delete this line.

**To address:** If you are currently using `--reset`, then you should stop passing `--reset` on the command line; no other changes are necessary. If you are not using `--reset`, then you should review your configuration to determine which rules should be on by default. You can partially restore some of the default behavior by adding the following to your configuration file:

The `"eslint:recommended"` configuration contains many of the same default rule settings from 0.x, but not all. These rules are no longer on by default, so you should review your settings to ensure they are still as you expect:

* [no-alert](../rules/no-alert)
* [no-array-constructor](../rules/no-array-constructor)
* [no-caller](../rules/no-caller)
* [no-catch-shadow](../rules/no-catch-shadow)
* [no-empty-label](../rules/no-empty-label)
* [no-eval](../rules/no-eval)
* [no-extend-native](../rules/no-extend-native)
* [no-extra-bind](../rules/no-extra-bind)
* [no-extra-strict](../rules/no-extra-strict)
* [no-implied-eval](../rules/no-implied-eval)
* [no-iterator](../rules/no-iterator)
* [no-label-var](../rules/no-label-var)
* [no-labels](../rules/no-labels)
* [no-lone-blocks](../rules/no-lone-blocks)
* [no-loop-func](../rules/no-loop-func)
* [no-multi-spaces](../rules/no-multi-spaces)
* [no-multi-str](../rules/no-multi-str)
* [no-native-reassign](../rules/no-native-reassign)
* [no-new](../rules/no-new)
* [no-new-func](../rules/no-new-func)
* [no-new-object](../rules/no-new-object)
* [no-new-wrappers](../rules/no-new-wrappers)
* [no-octal-escape](../rules/no-octal-escape)
* [no-process-exit](../rules/no-process-exit)
* [no-proto](../rules/no-proto)
* [no-return-assign](../rules/no-return-assign)
* [no-script-url](../rules/no-script-url)
* [no-sequences](../rules/no-sequences)
* [no-shadow](../rules/no-shadow)
* [no-shadow-restricted-names](../rules/no-shadow-restricted-names)
* [no-spaced-func](../rules/no-spaced-func)
* [no-trailing-spaces](../rules/no-trailing-spaces)
* [no-undef-init](../rules/no-undef-init)
* [no-underscore-dangle](../rules/no-underscore-dangle)
* [no-unused-expressions](../rules/no-unused-expressions)
* [no-use-before-define](../rules/no-use-before-define)
* [no-with](../rules/no-with)
* [no-wrap-func](../rules/no-wrap-func)
* [camelcase](../rules/camelcase)
* [comma-spacing](../rules/comma-spacing)
* [consistent-return](../rules/consistent-return)
* [curly](../rules/curly)
* [dot-notation](../rules/dot-notation)
* [eol-last](../rules/eol-last)
* [eqeqeq](../rules/eqeqeq)
* [key-spacing](../rules/key-spacing)
* [new-cap](../rules/new-cap)
* [new-parens](../rules/new-parens)
* [quotes](../rules/quotes)
* [semi](../rules/semi)
* [semi-spacing](../rules/semi-spacing)
* [space-infix-ops](../rules/space-infix-ops)
* [space-return-throw-case](../rules/space-return-throw-case)
* [space-unary-ops](../rules/space-unary-ops)
* [strict](../rules/strict)
* [yoda](../rules/yoda)

See also: the [full diff](https://github.com/eslint/eslint/commit/e3e9dbd9876daf4bdeb4e15f8a76a9d5e6e03e39#diff-b01a5cfd9361ca9280a460fd6bb8edbbL1) where the defaults were changed.

Here's a configuration file with the closest equivalent of the old defaults:

```json
{
    "extends": "eslint:recommended",
    "rules": {
        "no-alert": 2,
        "no-array-constructor": 2,
        "no-caller": 2,
        "no-catch-shadow": 2,
        "no-empty-label": 2,
        "no-eval": 2,
        "no-extend-native": 2,
        "no-extra-bind": 2,
        "no-implied-eval": 2,
        "no-iterator": 2,
        "no-label-var": 2,
        "no-labels": 2,
        "no-lone-blocks": 2,
        "no-loop-func": 2,
        "no-multi-spaces": 2,
        "no-multi-str": 2,
        "no-native-reassign": 2,
        "no-new": 2,
        "no-new-func": 2,
        "no-new-object": 2,
        "no-new-wrappers": 2,
        "no-octal-escape": 2,
        "no-process-exit": 2,
        "no-proto": 2,
        "no-return-assign": 2,
        "no-script-url": 2,
        "no-sequences": 2,
        "no-shadow": 2,
        "no-shadow-restricted-names": 2,
        "no-spaced-func": 2,
        "no-trailing-spaces": 2,
        "no-undef-init": 2,
        "no-underscore-dangle": 2,
        "no-unused-expressions": 2,
        "no-use-before-define": 2,
        "no-with": 2,
        "camelcase": 2,
        "comma-spacing": 2,
        "consistent-return": 2,
        "curly": [2, "all"],
        "dot-notation": [2, { "allowKeywords": true }],
        "eol-last": 2,
        "no-extra-parens": [2, "functions"],
        "eqeqeq": 2,
        "key-spacing": [2, { "beforeColon": false, "afterColon": true }],
        "new-cap": 2,
        "new-parens": 2,
        "quotes": [2, "double"],
        "semi": 2,
        "semi-spacing": [2, {"before": false, "after": true}],
        "space-infix-ops": 2,
        "space-return-throw-case": 2,
        "space-unary-ops": [2, { "words": true, "nonwords": false }],
        "strict": [2, "function"],
        "yoda": [2, "never"]
    }
}
```

## Removed Rules

Over the past several releases, we have been deprecating rules and introducing new rules to take their place. The following is a list of the removed rules and their replacements:

* [generator-star](../rules/generator-star) is replaced by [generator-star-spacing](../rules/generator-star-spacing)
* [global-strict](../rules/global-strict) is replaced by [strict](../rules/strict)
* [no-comma-dangle](../rules/no-comma-dangle) is replaced by [comma-dangle](../rules/comma-dangle)
* [no-empty-class](../rules/no-empty-class) is replaced by [no-empty-character-class](../rules/no-empty-character-class)
* [no-extra-strict](../rules/no-extra-strict) is replaced by [strict](../rules/strict)
* [no-reserved-keys](../rules/no-reserved-keys) is replaced by [quote-props](../rules/quote-props)
* [no-space-before-semi](../rules/no-space-before-semi) is replaced by [semi-spacing](../rules/semi-spacing)
* [no-wrap-func](../rules/no-wrap-func) is replaced by [no-extra-parens](../rules/no-extra-parens)
* [space-after-function-name](../rules/space-after-function-name) is replaced by [space-before-function-paren](../rules/space-before-function-paren)
* [space-before-function-parentheses](../rules/space-before-function-parentheses) is replaced by [space-before-function-paren](../rules/space-before-function-paren)
* [space-in-brackets](../rules/space-in-brackets) is replaced by[object-curly-spacing](../rules/object-curly-spacing) and [array-bracket-spacing](../rules/array-bracket-spacing)
* [space-unary-word-ops](../rules/space-unary-word-ops) is replaced by [space-unary-ops](../rules/space-unary-ops)
* [spaced-line-comment](../rules/spaced-line-comment) is replaced by [spaced-comment](../rules/spaced-comment)

**To address:** You'll need to update your rule configurations to use the new rules. ESLint v1.0.0 will also warn you when you're using a rule that has been removed and will suggest the replacement rules. Hopefully, this will result in few surprises during the upgrade process.

## Column Numbers are 1-based

From the beginning, ESLint has reported errors using 0-based columns because that's what Esprima, and later Espree, reported. However, most tools and editors use 1-based columns, which made for some tricky integrations with ESLint. In v1.0.0, we've switched over to reporting errors using 1-based columns to fall into line with the tools developers use everyday.

**To address:** If you've created an editor integration, or a tool that had to correct the column number, you'll need to update to just pass through the column number from ESLint. Otherwise, no change is necessary.

## No Longer Exporting cli

In 0.x, the `cli` object was exported for use by external tools. It was later deprecated in favor of `CLIEngine`. In v1.0.0, we are no longer exporting `cli` as it should not be used by external tools. This will break existing tools that make use of it.

**To address:** If you are using the exported `cli` object, switch to using `CLIEngine` instead.

## Deprecating eslint-tester

The `eslint-tester` module, which has long been the primary tester for ESLint rules, has now been moved into the `eslint` module. This was the result of a difficult relationship between these two modules that created circular dependencies and was causing a lot of problems in rule tests. Moving the tester into the `eslint` module fixed a lot of those issues.

The replacement for `eslint-tester` is called `RuleTester`. It's a simplified version of `ESLintTester` that's designed to work with any testing framework. This object is exposed by the package.

**To address:** Convert all of your rule tests to use `RuleTester`. If you have this as a test using `ESLintTester`:

```js
var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/your-rule", {
    valid: [],
    invalid: []
});
```

Then you can change to:

```js
var rule = require("../../../lib/rules/your-rule"),
    RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester();
ruleTester.run("your-rule", rule, {
    valid: [],
    invalid: []
});
```
