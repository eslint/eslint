[ESLint Node.js API Reference](../index.md) / [eslint/eslint](../modules/eslint_eslint.md) / LintResult

# Interface: LintResult<\>

[eslint/eslint](../modules/eslint_eslint.md).LintResult

## Table of contents

### Properties

* [errorCount](eslint_eslint.LintResult.md#errorcount)
* [fatalErrorCount](eslint_eslint.LintResult.md#fatalerrorcount)
* [filePath](eslint_eslint.LintResult.md#filepath)
* [fixableErrorCount](eslint_eslint.LintResult.md#fixableerrorcount)
* [fixableWarningCount](eslint_eslint.LintResult.md#fixablewarningcount)
* [messages](eslint_eslint.LintResult.md#messages)
* [output](eslint_eslint.LintResult.md#output)
* [source](eslint_eslint.LintResult.md#source)
* [suppressedMessages](eslint_eslint.LintResult.md#suppressedmessages)
* [usedDeprecatedRules](eslint_eslint.LintResult.md#useddeprecatedrules)
* [warningCount](eslint_eslint.LintResult.md#warningcount)

## Properties

### errorCount

• **errorCount**: `number`

Number of errors for the result.

#### Defined in

[shared/types.js:183](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L183)

___

### fatalErrorCount

• **fatalErrorCount**: `number`

Number of fatal errors for the result.

#### Defined in

[shared/types.js:184](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L184)

___

### filePath

• **filePath**: `string`

The path to the file that was linted.

#### Defined in

[shared/types.js:180](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L180)

___

### fixableErrorCount

• **fixableErrorCount**: `number`

Number of fixable errors for the result.

#### Defined in

[shared/types.js:186](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L186)

___

### fixableWarningCount

• **fixableWarningCount**: `number`

Number of fixable warnings for the result.

#### Defined in

[shared/types.js:187](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L187)

___

### messages

• **messages**: [`LintMessage`](eslint_eslint.LintMessage.md)[]

All of the messages for the result.

#### Defined in

[shared/types.js:181](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L181)

___

### output

• **output**: `string`

The source code of the file that was linted, with as many fixes applied as possible.

#### Defined in

[shared/types.js:189](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L189)

___

### source

• **source**: `string`

The source code of the file that was linted.

#### Defined in

[shared/types.js:188](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L188)

___

### suppressedMessages

• **suppressedMessages**: [`SuppressedLintMessage`](eslint_eslint.SuppressedLintMessage.md)[]

All of the suppressed messages for the result.

#### Defined in

[shared/types.js:182](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L182)

___

### usedDeprecatedRules

• **usedDeprecatedRules**: [`DeprecatedRuleInfo`](eslint_eslint.DeprecatedRuleInfo.md)[]

The list of used deprecated rules.

#### Defined in

[shared/types.js:190](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L190)

___

### warningCount

• **warningCount**: `number`

Number of warnings for the result.

#### Defined in

[shared/types.js:185](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/shared/types.js#L185)
