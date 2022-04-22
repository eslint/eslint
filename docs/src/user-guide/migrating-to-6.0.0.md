---
title: Migrating to v6.0.0
layout: doc
edit_link: https://github.com/eslint/eslint/edit/main/docs/src/user-guide/migrating-to-6.0.0.md

---

ESLint v6.0.0 is a major release of ESLint. We have made a few breaking changes in this release. This guide is intended to walk you through the breaking changes.

The lists below are ordered roughly by the number of users each change is expected to affect, where the first items are expected to affect the most users.

## Breaking changes for users

1. [Node.js 6 is no longer supported](#drop-node-6)
1. [`eslint:recommended` has been updated](#eslint-recommended-changes)
1. [Plugins and shareable configs are no longer affected by ESLint's location](#package-loading-simplification)
1. [The default parser now validates options more strictly](#espree-validation)
1. [Rule configuration are validated more strictly](#rule-config-validating)
1. [The `no-redeclare` rule is now more strict by default](#no-redeclare-updates)
1. [The `comma-dangle` rule is now more strict by default](#comma-dangle-updates)
1. [The `no-confusing-arrow` rule is now more lenient by default](#no-confusing-arrow-updates)
1. [Overrides in a config file can now match dotfiles](#overrides-dotfiles)
1. [Overrides in an extended config file can now be overridden by a parent config file](#overrides-precedence)
1. [Configuration values for globals are now validated](#globals-validation)
1. [The deprecated `experimentalObjectRestSpread` option has been removed](#experimental-object-rest-spread)
1. [User-provided regular expressions in rule options are parsed with the unicode flag](#unicode-regexes)

## Breaking changes for plugin/custom rule developers

1. [Plugin authors may need to update installation instructions](#plugin-documentation)
1. [`RuleTester` now validates against invalid `default` keywords in rule schemas](#rule-tester-defaults)
1. [`RuleTester` now requires an absolute path on `parser` option](#rule-tester-parser)
1. [The `eslintExplicitGlobalComment` scope analysis property has been removed](#eslintExplicitGlobalComment)

## Breaking changes for integration developers

1. [Plugins and shareable configs are no longer affected by ESLint's location](#package-loading-simplification)
1. [`Linter` no longer tries to load missing parsers from the filesystem](#linter-parsers)

---

## <a name="drop-node-6"></a> Node.js 6 is no longer supported

As of April 2019, Node.js 6 will be at EOL and will no longer be receiving security updates. As a result, we have decided to drop support for it in ESLint v6. We now support the following versions of Node.js:

* Node.js 8 (8.10.0 and above)
* Node.js 10 (10.13.0 and above)
* Anything above Node.js 11.10.1

**To address:** Make sure you upgrade to at least Node.js 8 when using ESLint v6. If you are unable to upgrade, we recommend continuing to use ESLint v5.x until you are able to upgrade Node.js.

**Related issue(s):** [eslint/eslint#11546](https://github.com/eslint/eslint/issues/11456)

## <a name="eslint-recommended-changes"></a> `eslint:recommended` has been updated

The following rules have been added to the [`eslint:recommended`](https://eslint.org/docs/user-guide/configuring#using-eslintrecommended) config:

* [`no-async-promise-executor`](https://eslint.org/docs/rules/no-async-promise-executor) disallows using an `async` function as the argument to the `Promise` constructor, which is usually a bug.
* [`no-misleading-character-class`](https://eslint.org/docs/rules/no-misleading-character-class) reports character classes in regular expressions that might not behave as expected.
* [`no-prototype-builtins`](https://eslint.org/docs/rules/no-prototype-builtins) reports method calls like `foo.hasOwnProperty("bar")` (which are a frequent source of bugs), and suggests that they be replaced with `Object.prototype.hasOwnProperty.call(foo, "bar")` instead.
* [`no-shadow-restricted-names`](https://eslint.org/docs/rules/no-shadow-restricted-names) disallows shadowing variables like `undefined` (e.g. with code like `let undefined = 5;`), since is likely to confuse readers.
* [`no-useless-catch`](https://eslint.org/docs/rules/no-useless-catch) reports `catch` clauses that are redundant and can be removed from the code without changing its behavior.
* [`no-with`](https://eslint.org/docs/rules/no-with) disallows use of the [`with` statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/with), which can make code difficult to understand and cause compatibility problems.
* [`require-atomic-updates`](https://eslint.org/docs/rules/require-atomic-updates) reports race condition bugs that can occur when reassigning variables in async functions.

Additionally, the following rule has been *removed* from `eslint:recommended`:

* [`no-console`](https://eslint.org/docs/rules/no-console) disallows calling functions like `console.log`. While this rule is useful in many cases (e.g. to avoid inadvertently leaving debugging statements in production code), it is not as broadly applicable as the other rules in `eslint:recommended`, and it was a source of false positives in cases where `console.log` is acceptable (e.g. in CLI applications).

Finally, in ESLint v5 `eslint:recommended` would explicitly disable all core rules that were not considered "recommended". This could cause confusing behavior if `eslint:recommended` was loaded after another config, since `eslint:recommended` would have the effect of turning off some rules. In ESLint v6, `eslint:recommended` has no effect on non-recommended rules.

**To address:** To mimic the `eslint:recommended` behavior from 5.x, you can explicitly disable/enable rules in a config file as follows:

```json
{
  "extends": "eslint:recommended",

  "rules": {
    "no-async-promise-executor": "off",
    "no-misleading-character-class": "off",
    "no-prototype-builtins": "off",
    "no-shadow-restricted-names": "off",
    "no-useless-catch": "off",
    "no-with": "off",
    "require-atomic-updates": "off",

    "no-console": "error"
  }
}
```

In rare cases (if you were relying on the previous behavior where `eslint:recommended` disables core rules), you might need to disable additional rules to restore the previous behavior.

**Related issue(s):** [eslint/eslint#10768](https://github.com/eslint/eslint/issues/10768), [eslint/eslint#10873](https://github.com/eslint/eslint/issues/10873)

## <a name="package-loading-simplification"></a> Plugins and shareable configs are no longer affected by ESLint's location

Previously, ESLint loaded plugins relative to the location of the ESLint package itself. As a result, we suggested that users with global ESLint installations should also install plugins globally, and users with local ESLint installations should install plugins locally. However, due to a design bug, this strategy caused ESLint to randomly fail to load plugins and shareable configs under certain circumstances, particularly when using package management tools like [`lerna`](https://github.com/lerna/lerna) and [Yarn Plug n' Play](https://yarnpkg.com/lang/en/docs/pnp/).

As a rule of thumb: With ESLint v6, plugins should always be installed locally, even if ESLint was installed globally. More precisely, ESLint v6 resolves plugins relative to the end user's project by default, and always resolves shareable configs and parsers relative to the location of the config file that imports them.

**To address:** If you use a global installation of ESLint (e.g. installed with `npm install eslint --global`) along with plugins, you should install those plugins locally in the projects where you run ESLint. If your config file extends shareable configs and/or parsers, you should ensure that those packages are installed as dependencies of the project containing the config file.

If you use a config file located outside of a local project (with the `--config` flag), consider installing the plugins as dependencies of that config file, and setting the [`--resolve-plugins-relative-to`](./command-line-interface#--resolve-plugins-relative-to) flag to the location of the config file.

**Related issue(s):** [eslint/eslint#10125](https://github.com/eslint/eslint/issues/10125), [eslint/rfcs#7](https://github.com/eslint/rfcs/pull/7)

## <a name="espree-validation"></a> The default parser now validates options more strictly

`espree`, the default parser used by ESLint, will now raise an error in the following cases:

* The `ecmaVersion` parser option is set to something other than a number, such as the string `"2015"`. (Previously, a non-number option would simply be ignored.)
* The `sourceType: "module"` parser option is set while `ecmaVersion` is set to `5` or left unspecified. (Previously, setting `sourceType: "module"` would implicitly cause `ecmaVersion` to be set to a minimum of 2015, which could be surprising.)
* The `sourceType` is set to anything other than `"script"` or `"module"`.

**To address:** If your config sets `ecmaVersion` to something other than a number, you can restore the previous behavior by removing `ecmaVersion`. (However, you may want to double-check that your config is actually working as expected.) If your config sets `parserOptions: { sourceType: "module" }` without also setting `parserOptions.ecmaVersion`, you should add `parserOptions: { ecmaVersion: 2015 }` to restore the previous behavior.

**Related issue(s):** [eslint/eslint#9687](https://github.com/eslint/eslint/issues/9687), [eslint/espree#384](https://github.com/eslint/espree/issues/384)

## <a name="rule-config-validating"></a> Rule configuration are validated more strictly

To catch config errors earlier, ESLint v6 will report a linting error if you are trying to configure a non-existent rule.

config | ESLint v5 | ESLint v6
------------- | ------------- | -------------
`/*eslint-enable foo*/`  | no error | linting error
`/*eslint-disable(-line) foo*/`  | no error | linting error
`/*eslint foo: 0*/` | no error | linting error
`{rules: {foo: 0}}` | no error | no error
`{rules: {foo: 1}` | linting warning | linting error

**To address:** You can remove the non-existent rule in your (inline) config.

**Related issue(s):** [eslint/eslint#9505](https://github.com/eslint/eslint/issues/9505)

## <a name="no-redeclare-updates"></a> The `no-redeclare` rule is now more strict by default

The default options for the [`no-redeclare`](https://eslint.org/docs/rules/no-redeclare) rule have changed from `{ builtinGlobals: false }` to `{ builtinGlobals: true }`. Additionally, the `no-redeclare` rule will now report an error for globals enabled by comments like `/* global foo */` if those globals were already enabled through configuration anyway.

**To address:**

To restore the previous options for the rule, you can configure it as follows:

```json
{
  "rules": {
    "no-redeclare": ["error", { "builtinGlobals": false }]
  }
}
```

Additionally, if you see new errors for `global` comments in your code, you should remove those comments.

**Related issue(s):** [eslint/eslint#11370](https://github.com/eslint/eslint/issues/11370), [eslint/eslint#11405](https://github.com/eslint/eslint/issues/11405)

## <a name="comma-dangle-updates"></a> The `comma-dangle` rule is now more strict by default

Previously, the [`comma-dangle`](https://eslint.org/docs/rules/comma-dangle) rule would ignore trailing function arguments and parameters, unless explicitly configured to check for function commas. In ESLint v6, function commas are treated the same way as other types of trailing commas.

**To address:** You can restore the previous default behavior of the rule with:

```json
{
  "rules": {
    "comma-dangle": ["error", {
        "arrays": "never",
        "objects": "never",
        "imports": "never",
        "exports": "never",
        "functions": "ignore"
    }]
  }
}
```

To restore the previous behavior of a string option like `"always-multiline"`, replace `"never"` with `"always-multiline"` in the example above.

**Related issue(s):** [eslint/eslint#11502](https://github.com/eslint/eslint/issues/11502)

## <a name="no-confusing-arrow-updates"></a> The `no-confusing-arrow` rule is now more lenient by default

The default options for the [`no-confusing-arrow`](https://eslint.org/docs/rules/no-confusing-arrow) rule have changed from `{ allowParens: false }` to `{ allowParens: true }`.

**To address:** You can restore the previous default behavior of the rule with:

```json
{
  "rules": {
    "no-confusing-arrow": ["error", { "allowParens": false }]
  }
}
```

**Related issue(s):** [eslint/eslint#11503](https://github.com/eslint/eslint/issues/11503)

## <a name="overrides-dotfiles"></a> Overrides in a config file can now match dotfiles

Due to a bug, the glob patterns in a `files` list in an `overrides` section of a config file would never match dotfiles, making it impossible to have overrides apply to files starting with a dot. This bug has been fixed in ESLint v6.

**To address:** If you don't want dotfiles to be matched by an override, consider adding something like `excludedFiles: [".*"]` to that `overrides` section. See the [documentation](https://eslint.org/docs/user-guide/configuring#configuration-based-on-glob-patterns) for more details.

**Related issue(s):** [eslint/eslint#11201](https://github.com/eslint/eslint/issues/11201)

## <a name="overrides-precedence"></a> Overrides in an extended config file can now be overridden by a parent config file

Due to a bug, it was previously the case that an `overrides` block in a shareable config had precedence over the top level of a parent config. For example, with the following config setup, the `semi` rule would end up enabled even though it was explicitly disabled in the end user's config:

```js
// .eslintrc.js
module.exports = {
  extends: ["foo"],
  rules: {
    semi: "off"
  }
};
```

```js
// eslint-config-foo/index.js
module.exports = {
  overrides: {
    files: ["*.js"],
    rules: {
      semi: "error"
    }
  }
};
```

In ESLint v6.0.0, a parent config always has precedence over extended configs, even with `overrides` blocks.

**To address:** We expect the impact of this issue to be very low because most shareable configs don't use `overrides` blocks. However, if you use a shareable config with `overrides` blocks, you might encounter a change in behavior due to something that is explicitly specified in your config but was inactive until now. If you would rather inherit the behavior from the shareable config, simply remove the corresponding entry from your own config. (In the example above, the previous behavior could be restored by removing `semi: "off"` from `.eslintrc.js`.)

**Related issue(s):** [eslint/eslint#11510](https://github.com/eslint/eslint/issues/11510)

## <a name="globals-validation"></a> Configuration values for globals are now validated

Previously, when configuring a set of global variables with an object, it was possible to use anything as the values of the object. An unknown value would be treated the same as `"writable"`.

```js
// .eslintrc.js
module.exports = {
  globals: {
    foo: "readonly",
    bar: "writable",
    baz: "hello!" // ???
  }
};
```

With this change, any unknown values in a `globals` object result in a config validation error.

**To address:** If you see config validation errors related to globals after updating, ensure that all values configured for globals are either `readonly`, `writable`, or `off`. (ESLint also accepts some alternate spellings and variants for compatibility.)

## <a name="experimental-object-rest-spread"></a> The deprecated `experimentalObjectRestSpread` option has been removed

Previously, when using the default parser, a config could use the `experimentalObjectRestSpread` option to enable parsing support for object rest/spread properties:

```json
{
  "parserOptions": {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true
    }
  }
}
```

Since ESLint v5, `ecmaFeatures: { experimentalObjectRestSpread: true }` has been equivalent to `ecmaVersion: 2018`, and has also emitted a deprecation warning. In ESLint v6, the `experimentalObjectRestSpread` feature has been removed entirely and has no effect. If your config was relying on `experimentalObjectRestSpread` to enable ES2018 parsing, you might start seeing parsing errors for recent syntax.

**To address:** If you use the `experimentalObjectRestSpread` option, you should change your config to contain this instead:

```json
{
  "parserOptions": {
    "ecmaVersion": 2018
  }
}
```

If you're not sure which config file needs to be updated, it may be useful to run ESLint v5 and look at what config file is mentioned in the deprecation warning.

**Related issue(s):** [eslint/eslint#9990](https://github.com/eslint/eslint/issues/9990)

## <a name="unicode-regexes"></a> User-provided regular expressions in rule options are parsed with the unicode flag

Rules like [`max-len`](/docs/rules/max-len) accept a string option which is interpreted as a regular expression. In ESLint v6.0.0, these regular expressions are interpreted with the [unicode flag](https://mathiasbynens.be/notes/es6-unicode-regex), which should exhibit more reasonable behavior when matching characters like astral symbols. Unicode regexes also validate escape sequences more strictly than non-unicode regexes.

**To address:** If you get rule option validation errors after upgrading, ensure that any regular expressions in your rule options have no invalid escape sequences.

**Related issue(s):** [eslint/eslint#11423](https://github.com/eslint/eslint/issues/11423)

---

## <a name="plugin-documentation"></a> Plugin authors may need to update installation instructions

If you maintain a plugin and provide installation instructions, you should ensure that the installation instructions are up to date with the [user-facing changes to how plugins are loaded](#package-loading-simplification). In particular, if your plugin was generated with the [`generator-eslint`](https://github.com/eslint/generator-eslint) package, it likely contains outdated instructions for how to use the plugin with global ESLint installations.

**Related issue(s):** [eslint/rfcs#7](https://github.com/eslint/rfcs/pull/7)

## <a name="rule-tester-defaults"></a> `RuleTester` now validates against invalid `default` keywords in rule schemas

In some cases, rule schemas can use the `default` keyword to automatically specify default values for rule options. However, the `default` keyword is only effective in certain schema locations, and is ignored elsewhere, which creates a risk of bugs if a rule incorrectly expects a default value to be provided as a rule option. In ESLint v6.0.0, `RuleTester` will raise an error if a rule has an invalid `default` keyword in its schema.

**To address:** If `RuleTester` starts reporting an error about an invalid default, you can remove the `default` property at the indicated location in your rule schema, and the rule will behave the same way. (If this happens, you might also want to verify that the rule behaves correctly when no option value is provided in that location.)

**Related issue(s):** [eslint/eslint#11473](https://github.com/eslint/eslint/issues/11473)

## <a name="rule-tester-parser"></a> `RuleTester` now requires an absolute path on `parser` option

To use custom parsers in tests, we could use `parser` property with a package name or file path. However, if a package name was given, it's unclear where the tester should load the parser package from because the tester doesn't know which files are running the tester. In ESLint v6.0.0, `RuleTester` disallows `parser` property with a package name.

**To address:** If you use `parser` property with package names in test cases, update it with `require.resolve()` function to resolve the package name to the absolute path to the package.

**Related issue(s):** [eslint/eslint#11728](https://github.com/eslint/eslint/issues/11728), [eslint/eslint#10125](https://github.com/eslint/eslint/issues/10125), [eslint/rfcs#7](https://github.com/eslint/rfcs/pull/7)

## <a name="eslintExplicitGlobalComment"></a> The `eslintExplicitGlobalComment` scope analysis property has been removed

Previously, ESLint would add an `eslintExplicitGlobalComment` property to `Variable` objects in scope analysis to indicate that a variable was introduced as a result of a `/* global */` comment. This property was undocumented, and the ESLint team was unable to find any usage of the property outside of ESLint core. The property has been removed in ESLint v6, and replaced with the `eslintExplicitGlobalComments` property, which can contain a list of all `/* global */` comments if a variable was declared with more than one of them.

**To address:** If you maintain a rule that uses the `eslintExplicitGlobalComment` property, update it to use the `eslintExplicitGlobalComments` property as a list instead.

**Related issue(s):** [eslint/rfcs#17](https://github.com/eslint/rfcs/pull/17)

---

## <a name="linter-parsers"></a> `Linter` no longer tries to load missing parsers from the filesystem

Previously, when linting code with a parser that had not been previously defined, the `Linter` API would attempt to load the parser from the filesystem. However, this behavior was confusing because `Linter` never access the filesystem in any other cases, and it was difficult to ensure that the correct parser would be found when loading the parser from the filesystem.

In ESLint v6, `Linter` will no longer perform any filesystem operations, including loading parsers.

**To address:** If you're using `Linter` with a custom parser, use [`Linter#defineParser`](https://eslint.org/docs/developer-guide/nodejs-api#linterdefineparser) to explicitly define the parser before linting any code.

**Related issue(s):** [eslint/rfcs#7](https://github.com/eslint/rfcs/pull/7)
