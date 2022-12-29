[ESLint Node.js API Reference](../index.md) / [rule-tester/flat-rule-tester](../modules/rule_tester_flat_rule_tester.md) / TestCaseError

# Interface: TestCaseError<\>

[rule-tester/flat-rule-tester](../modules/rule_tester_flat_rule_tester.md).TestCaseError

## Table of contents

### Properties

* [column](rule_tester_flat_rule_tester.TestCaseError.md#column)
* [data](rule_tester_flat_rule_tester.TestCaseError.md#data)
* [endColumn](rule_tester_flat_rule_tester.TestCaseError.md#endcolumn)
* [endLine](rule_tester_flat_rule_tester.TestCaseError.md#endline)
* [line](rule_tester_flat_rule_tester.TestCaseError.md#line)
* [message](rule_tester_flat_rule_tester.TestCaseError.md#message)
* [messageId](rule_tester_flat_rule_tester.TestCaseError.md#messageid)
* [type](rule_tester_flat_rule_tester.TestCaseError.md#type)

## Properties

### column

• **column**: `number`

The 1-based column number of the reported start location.

#### Defined in

[rule-tester/flat-rule-tester.js:71](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L71)

___

### data

• **data**: `Object`

The data used to fill the message template.

#### Index signature

▪ [name: `string`]: `string`

#### Defined in

[rule-tester/flat-rule-tester.js:69](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L69)

___

### endColumn

• **endColumn**: `number`

The 1-based column number of the reported end location.

#### Defined in

[rule-tester/flat-rule-tester.js:73](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L73)

___

### endLine

• **endLine**: `number`

The 1-based line number of the reported end location.

#### Defined in

[rule-tester/flat-rule-tester.js:72](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L72)

___

### line

• **line**: `number`

The 1-based line number of the reported start location.

#### Defined in

[rule-tester/flat-rule-tester.js:70](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L70)

___

### message

• **message**: `string` \| `RegExp`

Message.

#### Defined in

[rule-tester/flat-rule-tester.js:66](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L66)

___

### messageId

• **messageId**: `string`

Message ID.

#### Defined in

[rule-tester/flat-rule-tester.js:67](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L67)

___

### type

• **type**: `string`

The type of the reported AST node.

#### Defined in

[rule-tester/flat-rule-tester.js:68](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/flat-rule-tester.js#L68)
