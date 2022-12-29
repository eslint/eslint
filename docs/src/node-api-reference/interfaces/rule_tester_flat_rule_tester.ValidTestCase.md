[ESLint Node.js API Reference](../index.md) / [rule-tester/flat-rule-tester](../modules/rule_tester_flat_rule_tester.md) / ValidTestCase

# Interface: ValidTestCase<\>

[rule-tester/flat-rule-tester](../modules/rule_tester_flat_rule_tester.md).ValidTestCase

## Table of contents

### Properties

* [code](rule_tester_flat_rule_tester.ValidTestCase.md#code)
* [filename](rule_tester_flat_rule_tester.ValidTestCase.md#filename)
* [languageOptions](rule_tester_flat_rule_tester.ValidTestCase.md#languageoptions)
* [name](rule_tester_flat_rule_tester.ValidTestCase.md#name)
* [only](rule_tester_flat_rule_tester.ValidTestCase.md#only)
* [options](rule_tester_flat_rule_tester.ValidTestCase.md#options)
* [settings](rule_tester_flat_rule_tester.ValidTestCase.md#settings)

## Properties

### code

• **code**: `string`

Code for the test case.

#### Defined in

[rule-tester/flat-rule-tester.js:41](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L41)

___

### filename

• **filename**: `string`

The fake filename for the test case. Useful for rules that make assertion about filenames.

#### Defined in

[rule-tester/flat-rule-tester.js:45](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L45)

___

### languageOptions

• **languageOptions**: [`LanguageOptions`](rule_tester_flat_rule_tester.LanguageOptions.md)

The language options to use in the test case.

#### Defined in

[rule-tester/flat-rule-tester.js:43](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L43)

___

### name

• **name**: `string`

Name for the test case.

#### Defined in

[rule-tester/flat-rule-tester.js:40](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L40)

___

### only

• **only**: `boolean`

Run only this test case or the subset of test cases with this property.

#### Defined in

[rule-tester/flat-rule-tester.js:46](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L46)

___

### options

• **options**: `any`[]

Options for the test case.

#### Defined in

[rule-tester/flat-rule-tester.js:42](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L42)

___

### settings

• **settings**: `Object`

Settings for the test case.

#### Index signature

▪ [name: `string`]: `any`

#### Defined in

[rule-tester/flat-rule-tester.js:44](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L44)
