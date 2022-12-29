[ESLint Node.js API Reference](../index.md) / [rule-tester/rule-tester](../modules/rule_tester_rule_tester.md) / ValidTestCase

# Interface: ValidTestCase<\>

[rule-tester/rule-tester](../modules/rule_tester_rule_tester.md).ValidTestCase

## Table of contents

### Properties

* [code](rule_tester_rule_tester.ValidTestCase.md#code)
* [env](rule_tester_rule_tester.ValidTestCase.md#env)
* [filename](rule_tester_rule_tester.ValidTestCase.md#filename)
* [globals](rule_tester_rule_tester.ValidTestCase.md#globals)
* [name](rule_tester_rule_tester.ValidTestCase.md#name)
* [only](rule_tester_rule_tester.ValidTestCase.md#only)
* [options](rule_tester_rule_tester.ValidTestCase.md#options)
* [parser](rule_tester_rule_tester.ValidTestCase.md#parser)
* [parserOptions](rule_tester_rule_tester.ValidTestCase.md#parseroptions)
* [settings](rule_tester_rule_tester.ValidTestCase.md#settings)

## Properties

### code

• **code**: `string`

Code for the test case.

#### Defined in

[rule-tester/rule-tester.js:71](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L71)

___

### env

• **env**: `Object`

Environments for the test case.

#### Index signature

▪ [name: `string`]: `boolean`

#### Defined in

[rule-tester/rule-tester.js:78](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L78)

___

### filename

• **filename**: `string`

The fake filename for the test case. Useful for rules that make assertion about filenames.

#### Defined in

[rule-tester/rule-tester.js:74](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L74)

___

### globals

• **globals**: `Object`

The additional global variables.

#### Index signature

▪ [name: `string`]: ``"readonly"`` \| ``"writable"`` \| ``"off"``

#### Defined in

[rule-tester/rule-tester.js:77](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L77)

___

### name

• **name**: `string`

Name for the test case.

#### Defined in

[rule-tester/rule-tester.js:70](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L70)

___

### only

• **only**: `boolean`

Run only this test case or the subset of test cases with this property.

#### Defined in

[rule-tester/rule-tester.js:79](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L79)

___

### options

• **options**: `any`[]

Options for the test case.

#### Defined in

[rule-tester/rule-tester.js:72](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L72)

___

### parser

• **parser**: `string`

The absolute path for the parser.

#### Defined in

[rule-tester/rule-tester.js:75](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L75)

___

### parserOptions

• **parserOptions**: `Object`

Options for the parser.

#### Index signature

▪ [name: `string`]: `any`

#### Defined in

[rule-tester/rule-tester.js:76](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L76)

___

### settings

• **settings**: `Object`

Settings for the test case.

#### Index signature

▪ [name: `string`]: `any`

#### Defined in

[rule-tester/rule-tester.js:73](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L73)
