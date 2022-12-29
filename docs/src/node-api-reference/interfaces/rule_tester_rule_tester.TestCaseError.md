[ESLint Node.js API Reference](../index.md) / [rule-tester/rule-tester](../modules/rule_tester_rule_tester.md) / TestCaseError

# Interface: TestCaseError<\>

[rule-tester/rule-tester](../modules/rule_tester_rule_tester.md).TestCaseError

## Table of contents

### Properties

* [column](rule_tester_rule_tester.TestCaseError.md#column)
* [data](rule_tester_rule_tester.TestCaseError.md#data)
* [endColumn](rule_tester_rule_tester.TestCaseError.md#endcolumn)
* [endLine](rule_tester_rule_tester.TestCaseError.md#endline)
* [line](rule_tester_rule_tester.TestCaseError.md#line)
* [message](rule_tester_rule_tester.TestCaseError.md#message)
* [messageId](rule_tester_rule_tester.TestCaseError.md#messageid)
* [type](rule_tester_rule_tester.TestCaseError.md#type)

## Properties

### column

• **column**: `number`

The 1-based column number of the reported start location.

#### Defined in

[rule-tester/rule-tester.js:107](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L107)

___

### data

• **data**: `Object`

The data used to fill the message template.

#### Index signature

▪ [name: `string`]: `string`

#### Defined in

[rule-tester/rule-tester.js:105](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L105)

___

### endColumn

• **endColumn**: `number`

The 1-based column number of the reported end location.

#### Defined in

[rule-tester/rule-tester.js:109](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L109)

___

### endLine

• **endLine**: `number`

The 1-based line number of the reported end location.

#### Defined in

[rule-tester/rule-tester.js:108](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L108)

___

### line

• **line**: `number`

The 1-based line number of the reported start location.

#### Defined in

[rule-tester/rule-tester.js:106](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L106)

___

### message

• **message**: `string` \| `RegExp`

Message.

#### Defined in

[rule-tester/rule-tester.js:102](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L102)

___

### messageId

• **messageId**: `string`

Message ID.

#### Defined in

[rule-tester/rule-tester.js:103](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L103)

___

### type

• **type**: `string`

The type of the reported AST node.

#### Defined in

[rule-tester/rule-tester.js:104](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/rule-tester/rule-tester.js#L104)
