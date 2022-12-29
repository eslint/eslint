[ESLint Node.js API Reference](../index.md) / [rule-tester/flat-rule-tester](../modules/rule_tester_flat_rule_tester.md) / LanguageOptions

# Interface: LanguageOptions<\>

[rule-tester/flat-rule-tester](../modules/rule_tester_flat_rule_tester.md).LanguageOptions

## Table of contents

### Properties

* [ecmaVersion](rule_tester_flat_rule_tester.LanguageOptions.md#ecmaversion)
* [globals](rule_tester_flat_rule_tester.LanguageOptions.md#globals)
* [parser](rule_tester_flat_rule_tester.LanguageOptions.md#parser)
* [parserOptions](rule_tester_flat_rule_tester.LanguageOptions.md#parseroptions)
* [sourceType](rule_tester_flat_rule_tester.LanguageOptions.md#sourcetype)

## Properties

### ecmaVersion

• **ecmaVersion**: `number` \| ``"latest"``

The ECMAScript version (or revision number).

#### Defined in

[shared/types.js:31](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L31)

___

### globals

• **globals**: `Record`<`string`, `GlobalConf`\>

The global variable settings.

#### Defined in

[shared/types.js:32](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L32)

___

### parser

• **parser**: `any`

The parser to use.

#### Defined in

[shared/types.js:34](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L34)

___

### parserOptions

• **parserOptions**: `any`

The parser options to use.

#### Defined in

[shared/types.js:35](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L35)

___

### sourceType

• **sourceType**: ``"script"`` \| ``"module"`` \| ``"commonjs"``

The source code type.

#### Defined in

[shared/types.js:33](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L33)
