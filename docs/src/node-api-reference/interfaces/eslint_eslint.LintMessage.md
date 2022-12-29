[ESLint Node.js API Reference](../index.md) / [eslint/eslint](../modules/eslint_eslint.md) / LintMessage

# Interface: LintMessage<\>

[eslint/eslint](../modules/eslint_eslint.md).LintMessage

## Table of contents

### Properties

* [column](eslint_eslint.LintMessage.md#column)
* [endColumn](eslint_eslint.LintMessage.md#endcolumn)
* [endLine](eslint_eslint.LintMessage.md#endline)
* [fatal](eslint_eslint.LintMessage.md#fatal)
* [fix](eslint_eslint.LintMessage.md#fix)
* [line](eslint_eslint.LintMessage.md#line)
* [message](eslint_eslint.LintMessage.md#message)
* [ruleId](eslint_eslint.LintMessage.md#ruleid)
* [severity](eslint_eslint.LintMessage.md#severity)
* [suggestions](eslint_eslint.LintMessage.md#suggestions)

## Properties

### column

• **column**: `number`

The 1-based column number.

#### Defined in

[shared/types.js:96](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L96)

___

### endColumn

• **endColumn**: `number`

The 1-based column number of the end location.

#### Defined in

[shared/types.js:97](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L97)

___

### endLine

• **endLine**: `number`

The 1-based line number of the end location.

#### Defined in

[shared/types.js:98](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L98)

___

### fatal

• **fatal**: `boolean`

If `true` then this is a fatal error.

#### Defined in

[shared/types.js:99](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L99)

___

### fix

• **fix**: `Object`

Information for autofix.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `range` | [`number`, `number`] |
| `text` | `string` |

#### Defined in

[shared/types.js:100](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L100)

___

### line

• **line**: `number`

The 1-based line number.

#### Defined in

[shared/types.js:101](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L101)

___

### message

• **message**: `string`

The error message.

#### Defined in

[shared/types.js:102](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L102)

___

### ruleId

• **ruleId**: `string`

The ID of the rule which makes this message.

#### Defined in

[shared/types.js:103](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L103)

___

### severity

• **severity**: ``0`` \| ``1`` \| ``2``

The severity of this message.

#### Defined in

[shared/types.js:104](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L104)

___

### suggestions

• **suggestions**: { `desc?`: `string` ; `fix`: { `range`: [`number`, `number`] ; `text`: `string`  } ; `messageId?`: `string`  }[]

Information for suggestions.

#### Defined in

[shared/types.js:105](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L105)
