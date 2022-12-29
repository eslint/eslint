[ESLint Node.js API Reference](../index.md) / [eslint/eslint](../modules/eslint_eslint.md) / ESLintOptions

# Interface: ESLintOptions<\>

[eslint/eslint](../modules/eslint_eslint.md).ESLintOptions

## Table of contents

### Properties

* [allowInlineConfig](eslint_eslint.ESLintOptions.md#allowinlineconfig)
* [baseConfig](eslint_eslint.ESLintOptions.md#baseconfig)
* [cache](eslint_eslint.ESLintOptions.md#cache)
* [cacheLocation](eslint_eslint.ESLintOptions.md#cachelocation)
* [cacheStrategy](eslint_eslint.ESLintOptions.md#cachestrategy)
* [cwd](eslint_eslint.ESLintOptions.md#cwd)
* [errorOnUnmatchedPattern](eslint_eslint.ESLintOptions.md#erroronunmatchedpattern)
* [extensions](eslint_eslint.ESLintOptions.md#extensions)
* [fix](eslint_eslint.ESLintOptions.md#fix)
* [fixTypes](eslint_eslint.ESLintOptions.md#fixtypes)
* [globInputPaths](eslint_eslint.ESLintOptions.md#globinputpaths)
* [ignore](eslint_eslint.ESLintOptions.md#ignore)
* [ignorePath](eslint_eslint.ESLintOptions.md#ignorepath)
* [overrideConfig](eslint_eslint.ESLintOptions.md#overrideconfig)
* [overrideConfigFile](eslint_eslint.ESLintOptions.md#overrideconfigfile)
* [plugins](eslint_eslint.ESLintOptions.md#plugins)
* [reportUnusedDisableDirectives](eslint_eslint.ESLintOptions.md#reportunuseddisabledirectives)
* [resolvePluginsRelativeTo](eslint_eslint.ESLintOptions.md#resolvepluginsrelativeto)
* [rulePaths](eslint_eslint.ESLintOptions.md#rulepaths)
* [useEslintrc](eslint_eslint.ESLintOptions.md#useeslintrc)

## Properties

### allowInlineConfig

• **allowInlineConfig**: `boolean`

Enable or disable inline configuration comments.

#### Defined in

[eslint/eslint.js:50](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/eslint.js#L50)

___

### baseConfig

• **baseConfig**: [`ConfigData`](eslint_eslint.ConfigData.md)

Base config object, extended by all configs used with this instance

#### Defined in

[eslint/eslint.js:51](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/eslint.js#L51)

___

### cache

• **cache**: `boolean`

Enable result caching.

#### Defined in

[eslint/eslint.js:52](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/eslint.js#L52)

___

### cacheLocation

• **cacheLocation**: `string`

The cache file to use instead of .eslintcache.

#### Defined in

[eslint/eslint.js:53](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/eslint.js#L53)

___

### cacheStrategy

• **cacheStrategy**: ``"metadata"`` \| ``"content"``

The strategy used to detect changed files.

#### Defined in

[eslint/eslint.js:54](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/eslint.js#L54)

___

### cwd

• **cwd**: `string`

The value to use for the current working directory.

#### Defined in

[eslint/eslint.js:55](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/eslint.js#L55)

___

### errorOnUnmatchedPattern

• **errorOnUnmatchedPattern**: `boolean`

If `false` then `ESLint#lintFiles()` doesn't throw even if no target files found. Defaults to `true`.

#### Defined in

[eslint/eslint.js:56](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/eslint.js#L56)

___

### extensions

• **extensions**: `string`[]

An array of file extensions to check.

#### Defined in

[eslint/eslint.js:57](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/eslint.js#L57)

___

### fix

• **fix**: `boolean` \| `Function`

Execute in autofix mode. If a function, should return a boolean.

#### Defined in

[eslint/eslint.js:58](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/eslint.js#L58)

___

### fixTypes

• **fixTypes**: `string`[]

Array of rule types to apply fixes for.

#### Defined in

[eslint/eslint.js:59](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/eslint.js#L59)

___

### globInputPaths

• **globInputPaths**: `boolean`

Set to false to skip glob resolution of input file paths to lint (default: true). If false, each input file paths is assumed to be a non-glob path to an existing file.

#### Defined in

[eslint/eslint.js:60](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/eslint.js#L60)

___

### ignore

• **ignore**: `boolean`

False disables use of .eslintignore.

#### Defined in

[eslint/eslint.js:61](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/eslint.js#L61)

___

### ignorePath

• **ignorePath**: `string`

The ignore file to use instead of .eslintignore.

#### Defined in

[eslint/eslint.js:62](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/eslint.js#L62)

___

### overrideConfig

• **overrideConfig**: [`ConfigData`](eslint_eslint.ConfigData.md)

Override config object, overrides all configs used with this instance

#### Defined in

[eslint/eslint.js:63](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/eslint.js#L63)

___

### overrideConfigFile

• **overrideConfigFile**: `string`

The configuration file to use.

#### Defined in

[eslint/eslint.js:64](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/eslint.js#L64)

___

### plugins

• **plugins**: `Record`<`string`, [`Plugin`](eslint_eslint.Plugin.md)\>

Preloaded plugins. This is a map-like object, keys are plugin IDs and each value is implementation.

#### Defined in

[eslint/eslint.js:65](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/eslint.js#L65)

___

### reportUnusedDisableDirectives

• **reportUnusedDisableDirectives**: ``"off"`` \| ``"warn"`` \| ``"error"``

the severity to report unused eslint-disable directives.

#### Defined in

[eslint/eslint.js:66](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/eslint.js#L66)

___

### resolvePluginsRelativeTo

• **resolvePluginsRelativeTo**: `string`

The folder where plugins should be resolved from, defaulting to the CWD.

#### Defined in

[eslint/eslint.js:67](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/eslint.js#L67)

___

### rulePaths

• **rulePaths**: `string`[]

An array of directories to load custom rules from.

#### Defined in

[eslint/eslint.js:68](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/eslint.js#L68)

___

### useEslintrc

• **useEslintrc**: `boolean`

False disables looking for .eslintrc.* files.

#### Defined in

[eslint/eslint.js:69](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/eslint/eslint.js#L69)
