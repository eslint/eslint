[ESLint Node.js API Reference](../index.md) / [rule-tester/flat-rule-tester](../modules/rule_tester_flat_rule_tester.md) / InvalidTestCase

# Interface: InvalidTestCase<\>

[rule-tester/flat-rule-tester](../modules/rule_tester_flat_rule_tester.md).InvalidTestCase

## Table of contents

### Properties

* [code](rule_tester_flat_rule_tester.InvalidTestCase.md#code)
* [errors](rule_tester_flat_rule_tester.InvalidTestCase.md#errors)
* [filename](rule_tester_flat_rule_tester.InvalidTestCase.md#filename)
* [languageOptions](rule_tester_flat_rule_tester.InvalidTestCase.md#languageoptions)
* [name](rule_tester_flat_rule_tester.InvalidTestCase.md#name)
* [only](rule_tester_flat_rule_tester.InvalidTestCase.md#only)
* [options](rule_tester_flat_rule_tester.InvalidTestCase.md#options)
* [output](rule_tester_flat_rule_tester.InvalidTestCase.md#output)
* [settings](rule_tester_flat_rule_tester.InvalidTestCase.md#settings)

## Properties

### code

• **code**: `string`

Code for the test case.

#### Defined in

[rule-tester/flat-rule-tester.js:53](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L53)

___

### errors

• **errors**: `number` \| (`string` \| `RegExp` \| [`TestCaseError`](rule_tester_flat_rule_tester.TestCaseError.md))[]

Expected errors.

#### Defined in

[rule-tester/flat-rule-tester.js:54](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L54)

___

### filename

• **filename**: `string`

The fake filename for the test case. Useful for rules that make assertion about filenames.

#### Defined in

[rule-tester/flat-rule-tester.js:58](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L58)

___

### languageOptions

• **languageOptions**: [`LanguageOptions`](rule_tester_flat_rule_tester.LanguageOptions.md)

The language options to use in the test case.

#### Defined in

[rule-tester/flat-rule-tester.js:59](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L59)

___

### name

• **name**: `string`

Name for the test case.

#### Defined in

[rule-tester/flat-rule-tester.js:52](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L52)

___

### only

• **only**: `boolean`

Run only this test case or the subset of test cases with this property.

#### Defined in

[rule-tester/flat-rule-tester.js:60](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L60)

___

### options

• **options**: `any`[]

Options for the test case.

#### Defined in

[rule-tester/flat-rule-tester.js:56](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L56)

___

### output

• **output**: `string`

The expected code after autofixes are applied. If set to `null`, the test runner will assert that no autofix is suggested.

#### Defined in

[rule-tester/flat-rule-tester.js:55](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L55)

___

### settings

• **settings**: `Object`

Settings for the test case.

#### Index signature

▪ [name: `string`]: `any`

#### Defined in

[rule-tester/flat-rule-tester.js:57](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L57)
