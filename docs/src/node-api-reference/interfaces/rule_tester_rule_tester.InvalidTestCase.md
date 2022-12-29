[ESLint Node.js API Reference](../index.md) / [rule-tester/rule-tester](../modules/rule_tester_rule_tester.md) / InvalidTestCase

# Interface: InvalidTestCase<\>

[rule-tester/rule-tester](../modules/rule_tester_rule_tester.md).InvalidTestCase

## Table of contents

### Properties

* [code](rule_tester_rule_tester.InvalidTestCase.md#code)
* [env](rule_tester_rule_tester.InvalidTestCase.md#env)
* [errors](rule_tester_rule_tester.InvalidTestCase.md#errors)
* [filename](rule_tester_rule_tester.InvalidTestCase.md#filename)
* [globals](rule_tester_rule_tester.InvalidTestCase.md#globals)
* [name](rule_tester_rule_tester.InvalidTestCase.md#name)
* [only](rule_tester_rule_tester.InvalidTestCase.md#only)
* [options](rule_tester_rule_tester.InvalidTestCase.md#options)
* [output](rule_tester_rule_tester.InvalidTestCase.md#output)
* [parser](rule_tester_rule_tester.InvalidTestCase.md#parser)
* [parserOptions](rule_tester_rule_tester.InvalidTestCase.md#parseroptions)
* [settings](rule_tester_rule_tester.InvalidTestCase.md#settings)

## Properties

### code

• **code**: `string`

Code for the test case.

#### Defined in

[rule-tester/rule-tester.js:86](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L86)

___

### env

• **env**: `Object`

Environments for the test case.

#### Index signature

▪ [name: `string`]: `boolean`

#### Defined in

[rule-tester/rule-tester.js:95](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L95)

___

### errors

• **errors**: `number` \| (`string` \| `RegExp` \| [`TestCaseError`](rule_tester_rule_tester.TestCaseError.md))[]

Expected errors.

#### Defined in

[rule-tester/rule-tester.js:87](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L87)

___

### filename

• **filename**: `string`

The fake filename for the test case. Useful for rules that make assertion about filenames.

#### Defined in

[rule-tester/rule-tester.js:91](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L91)

___

### globals

• **globals**: `Object`

The additional global variables.

#### Index signature

▪ [name: `string`]: ``"readonly"`` \| ``"writable"`` \| ``"off"``

#### Defined in

[rule-tester/rule-tester.js:94](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L94)

___

### name

• **name**: `string`

Name for the test case.

#### Defined in

[rule-tester/rule-tester.js:85](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L85)

___

### only

• **only**: `boolean`

Run only this test case or the subset of test cases with this property.

#### Defined in

[rule-tester/rule-tester.js:96](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L96)

___

### options

• **options**: `any`[]

Options for the test case.

#### Defined in

[rule-tester/rule-tester.js:89](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L89)

___

### output

• **output**: `string`

The expected code after autofixes are applied. If set to `null`, the test runner will assert that no autofix is suggested.

#### Defined in

[rule-tester/rule-tester.js:88](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L88)

___

### parser

• **parser**: `string`

The absolute path for the parser.

#### Defined in

[rule-tester/rule-tester.js:92](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L92)

___

### parserOptions

• **parserOptions**: `Object`

Options for the parser.

#### Index signature

▪ [name: `string`]: `any`

#### Defined in

[rule-tester/rule-tester.js:93](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L93)

___

### settings

• **settings**: `Object`

Settings for the test case.

#### Index signature

▪ [name: `string`]: `any`

#### Defined in

[rule-tester/rule-tester.js:90](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L90)
