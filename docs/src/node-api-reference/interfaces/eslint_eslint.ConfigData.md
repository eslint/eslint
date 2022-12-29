[ESLint Node.js API Reference](../index.md) / [eslint/eslint](../modules/eslint_eslint.md) / ConfigData

# Interface: ConfigData<\>

[eslint/eslint](../modules/eslint_eslint.md).ConfigData

## Table of contents

### Properties

* [env](eslint_eslint.ConfigData.md#env)
* [extends](eslint_eslint.ConfigData.md#extends)
* [globals](eslint_eslint.ConfigData.md#globals)
* [ignorePatterns](eslint_eslint.ConfigData.md#ignorepatterns)
* [noInlineConfig](eslint_eslint.ConfigData.md#noinlineconfig)
* [overrides](eslint_eslint.ConfigData.md#overrides)
* [parser](eslint_eslint.ConfigData.md#parser)
* [parserOptions](eslint_eslint.ConfigData.md#parseroptions)
* [plugins](eslint_eslint.ConfigData.md#plugins)
* [processor](eslint_eslint.ConfigData.md#processor)
* [reportUnusedDisableDirectives](eslint_eslint.ConfigData.md#reportunuseddisabledirectives)
* [root](eslint_eslint.ConfigData.md#root)
* [rules](eslint_eslint.ConfigData.md#rules)
* [settings](eslint_eslint.ConfigData.md#settings)

## Properties

### env

• **env**: `Record`<`string`, `boolean`\>

The environment settings.

#### Defined in

[shared/types.js:40](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L40)

___

### extends

• **extends**: `string` \| `string`[]

The path to other config files or the package name of shareable configs.

#### Defined in

[shared/types.js:41](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L41)

___

### globals

• **globals**: `Record`<`string`, `GlobalConf`\>

The global variable settings.

#### Defined in

[shared/types.js:42](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L42)

___

### ignorePatterns

• **ignorePatterns**: `string` \| `string`[]

The glob patterns that ignore to lint.

#### Defined in

[shared/types.js:43](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L43)

___

### noInlineConfig

• **noInlineConfig**: `boolean`

The flag that disables directive comments.

#### Defined in

[shared/types.js:44](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L44)

___

### overrides

• **overrides**: `OverrideConfigData`[]

The override settings per kind of files.

#### Defined in

[shared/types.js:45](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L45)

___

### parser

• **parser**: `string`

The path to a parser or the package name of a parser.

#### Defined in

[shared/types.js:46](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L46)

___

### parserOptions

• **parserOptions**: [`ParserOptions`](eslint_flat_eslint.ParserOptions.md)

The parser options.

#### Defined in

[shared/types.js:47](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L47)

___

### plugins

• **plugins**: `string`[]

The plugin specifiers.

#### Defined in

[shared/types.js:48](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L48)

___

### processor

• **processor**: `string`

The processor specifier.

#### Defined in

[shared/types.js:49](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L49)

___

### reportUnusedDisableDirectives

• **reportUnusedDisableDirectives**: `boolean`

The flag to report unused `eslint-disable` comments.

#### Defined in

[shared/types.js:50](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L50)

___

### root

• **root**: `boolean`

The root flag.

#### Defined in

[shared/types.js:51](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L51)

___

### rules

• **rules**: `Record`<`string`, [`RuleConf`](../modules/eslint_flat_eslint.md#ruleconf)\>

The rule settings.

#### Defined in

[shared/types.js:52](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L52)

___

### settings

• **settings**: `any`

The shared settings.

#### Defined in

[shared/types.js:53](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L53)
