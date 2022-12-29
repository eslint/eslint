[ESLint Node.js API Reference](../index.md) / [eslint/eslint](../modules/eslint_eslint.md) / CLIEngineLintReport

# Interface: CLIEngineLintReport<\>

[eslint/eslint](../modules/eslint_eslint.md).CLIEngineLintReport

## Table of contents

### Properties

* [errorCount](eslint_eslint.CLIEngineLintReport.md#errorcount)
* [fatalErrorCount](eslint_eslint.CLIEngineLintReport.md#fatalerrorcount)
* [fixableErrorCount](eslint_eslint.CLIEngineLintReport.md#fixableerrorcount)
* [fixableWarningCount](eslint_eslint.CLIEngineLintReport.md#fixablewarningcount)
* [results](eslint_eslint.CLIEngineLintReport.md#results)
* [usedDeprecatedRules](eslint_eslint.CLIEngineLintReport.md#useddeprecatedrules)
* [warningCount](eslint_eslint.CLIEngineLintReport.md#warningcount)

## Properties

### errorCount

• **errorCount**: `number`

Number of errors for the result.

#### Defined in

[cli-engine/cli-engine.js:110](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/cli-engine/cli-engine.js#L110)

___

### fatalErrorCount

• **fatalErrorCount**: `number`

Number of fatal errors for the result.

#### Defined in

[cli-engine/cli-engine.js:111](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/cli-engine/cli-engine.js#L111)

___

### fixableErrorCount

• **fixableErrorCount**: `number`

Number of fixable errors for the result.

#### Defined in

[cli-engine/cli-engine.js:113](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/cli-engine/cli-engine.js#L113)

___

### fixableWarningCount

• **fixableWarningCount**: `number`

Number of fixable warnings for the result.

#### Defined in

[cli-engine/cli-engine.js:114](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/cli-engine/cli-engine.js#L114)

___

### results

• **results**: `LintResult`[]

All of the result.

#### Defined in

[cli-engine/cli-engine.js:109](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/cli-engine/cli-engine.js#L109)

___

### usedDeprecatedRules

• **usedDeprecatedRules**: [`DeprecatedRuleInfo`](eslint_eslint.DeprecatedRuleInfo.md)[]

The list of used deprecated rules.

#### Defined in

[cli-engine/cli-engine.js:115](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/cli-engine/cli-engine.js#L115)

___

### warningCount

• **warningCount**: `number`

Number of warnings for the result.

#### Defined in

[cli-engine/cli-engine.js:112](https://github.com/bpmutter/eslint/blob/fd0ad7338/lib/cli-engine/cli-engine.js#L112)
