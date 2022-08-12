---
title: Formatters
layout: doc
eleventyNavigation:
    key: formatters
    parent: user guide
    title: Formatters
    order: 5
edit_link: https://github.com/eslint/eslint/edit/main/templates/formatter-examples.md.ejs
---

ESLint comes with several built-in formatters to control the appearance of the linting results, and supports third-party formatters as well.

You can specify a formatter using the `--format` or `-f` flag on the command line. For example, `--format json` uses the `json` formatter.

The built-in formatter options are:

* [checkstyle](#checkstyle)
* [compact](#compact)
* [html](#html)
* [jslint-xml](#jslint-xml)
* [json-with-metadata](#json-with-metadata)
* [json](#json)
* [junit](#junit)
* [stylish](#stylish)
* [tap](#tap)
* [unix](#unix)
* [visualstudio](#visualstudio)

## Example Source

Examples of each formatter were created from linting `fullOfProblems.js` using the `.eslintrc` configuration shown below.

### `fullOfProblems.js`

```js
function addOne(i) {
    if (i != NaN) {
        return i ++
    } else {
      return
    }
};
```

### `.eslintrc`:

```json
{
    "extends": "eslint:recommended",
    "rules": {
        "consistent-return": 2,
        "indent"           : [1, 4],
        "no-else-return"   : 1,
        "semi"             : [1, "always"],
        "space-unary-ops"  : 2
    }
}
```

## Output Examples

### checkstyle

```text
&lt;?xml version=&#34;1.0&#34; encoding=&#34;utf-8&#34;?&gt;&lt;checkstyle version=&#34;4.3&#34;&gt;&lt;file name=&#34;/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems.js&#34;&gt;&lt;error line=&#34;1&#34; column=&#34;10&#34; severity=&#34;error&#34; message=&#34;&amp;apos;addOne&amp;apos; is defined but never used. (no-unused-vars)&#34; source=&#34;eslint.rules.no-unused-vars&#34; /&gt;&lt;error line=&#34;2&#34; column=&#34;9&#34; severity=&#34;error&#34; message=&#34;Use the isNaN function to compare with NaN. (use-isnan)&#34; source=&#34;eslint.rules.use-isnan&#34; /&gt;&lt;error line=&#34;3&#34; column=&#34;16&#34; severity=&#34;error&#34; message=&#34;Unexpected space before unary operator &amp;apos;++&amp;apos;. (space-unary-ops)&#34; source=&#34;eslint.rules.space-unary-ops&#34; /&gt;&lt;error line=&#34;3&#34; column=&#34;20&#34; severity=&#34;warning&#34; message=&#34;Missing semicolon. (semi)&#34; source=&#34;eslint.rules.semi&#34; /&gt;&lt;error line=&#34;4&#34; column=&#34;12&#34; severity=&#34;warning&#34; message=&#34;Unnecessary &amp;apos;else&amp;apos; after &amp;apos;return&amp;apos;. (no-else-return)&#34; source=&#34;eslint.rules.no-else-return&#34; /&gt;&lt;error line=&#34;5&#34; column=&#34;1&#34; severity=&#34;warning&#34; message=&#34;Expected indentation of 8 spaces but found 6. (indent)&#34; source=&#34;eslint.rules.indent&#34; /&gt;&lt;error line=&#34;5&#34; column=&#34;7&#34; severity=&#34;error&#34; message=&#34;Function &amp;apos;addOne&amp;apos; expected a return value. (consistent-return)&#34; source=&#34;eslint.rules.consistent-return&#34; /&gt;&lt;error line=&#34;5&#34; column=&#34;13&#34; severity=&#34;warning&#34; message=&#34;Missing semicolon. (semi)&#34; source=&#34;eslint.rules.semi&#34; /&gt;&lt;error line=&#34;7&#34; column=&#34;2&#34; severity=&#34;error&#34; message=&#34;Unnecessary semicolon. (no-extra-semi)&#34; source=&#34;eslint.rules.no-extra-semi&#34; /&gt;&lt;/file&gt;&lt;/checkstyle&gt;
```

### compact

```text
/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems.js: line 1, col 10, Error - &#39;addOne&#39; is defined but never used. (no-unused-vars)
/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems.js: line 2, col 9, Error - Use the isNaN function to compare with NaN. (use-isnan)
/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems.js: line 3, col 16, Error - Unexpected space before unary operator &#39;++&#39;. (space-unary-ops)
/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems.js: line 3, col 20, Warning - Missing semicolon. (semi)
/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems.js: line 4, col 12, Warning - Unnecessary &#39;else&#39; after &#39;return&#39;. (no-else-return)
/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems.js: line 5, col 1, Warning - Expected indentation of 8 spaces but found 6. (indent)
/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems.js: line 5, col 7, Error - Function &#39;addOne&#39; expected a return value. (consistent-return)
/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems.js: line 5, col 13, Warning - Missing semicolon. (semi)
/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems.js: line 7, col 2, Error - Unnecessary semicolon. (no-extra-semi)

9 problems
```

### html

<iframe src="html-formatter-example.html" width="100%" height="460px"></iframe>

### jslint-xml

```text
&lt;?xml version=&#34;1.0&#34; encoding=&#34;utf-8&#34;?&gt;&lt;jslint&gt;&lt;file name=&#34;/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems.js&#34;&gt;&lt;issue line=&#34;1&#34; char=&#34;10&#34; evidence=&#34;&#34; reason=&#34;&amp;apos;addOne&amp;apos; is defined but never used. (no-unused-vars)&#34; /&gt;&lt;issue line=&#34;2&#34; char=&#34;9&#34; evidence=&#34;&#34; reason=&#34;Use the isNaN function to compare with NaN. (use-isnan)&#34; /&gt;&lt;issue line=&#34;3&#34; char=&#34;16&#34; evidence=&#34;&#34; reason=&#34;Unexpected space before unary operator &amp;apos;++&amp;apos;. (space-unary-ops)&#34; /&gt;&lt;issue line=&#34;3&#34; char=&#34;20&#34; evidence=&#34;&#34; reason=&#34;Missing semicolon. (semi)&#34; /&gt;&lt;issue line=&#34;4&#34; char=&#34;12&#34; evidence=&#34;&#34; reason=&#34;Unnecessary &amp;apos;else&amp;apos; after &amp;apos;return&amp;apos;. (no-else-return)&#34; /&gt;&lt;issue line=&#34;5&#34; char=&#34;1&#34; evidence=&#34;&#34; reason=&#34;Expected indentation of 8 spaces but found 6. (indent)&#34; /&gt;&lt;issue line=&#34;5&#34; char=&#34;7&#34; evidence=&#34;&#34; reason=&#34;Function &amp;apos;addOne&amp;apos; expected a return value. (consistent-return)&#34; /&gt;&lt;issue line=&#34;5&#34; char=&#34;13&#34; evidence=&#34;&#34; reason=&#34;Missing semicolon. (semi)&#34; /&gt;&lt;issue line=&#34;7&#34; char=&#34;2&#34; evidence=&#34;&#34; reason=&#34;Unnecessary semicolon. (no-extra-semi)&#34; /&gt;&lt;/file&gt;&lt;/jslint&gt;
```

### json-with-metadata

```text
{&#34;results&#34;:[{&#34;filePath&#34;:&#34;/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems.js&#34;,&#34;messages&#34;:[{&#34;ruleId&#34;:&#34;no-unused-vars&#34;,&#34;severity&#34;:2,&#34;message&#34;:&#34;&#39;addOne&#39; is defined but never used.&#34;,&#34;line&#34;:1,&#34;column&#34;:10,&#34;nodeType&#34;:&#34;Identifier&#34;,&#34;messageId&#34;:&#34;unusedVar&#34;,&#34;endLine&#34;:1,&#34;endColumn&#34;:16},{&#34;ruleId&#34;:&#34;use-isnan&#34;,&#34;severity&#34;:2,&#34;message&#34;:&#34;Use the isNaN function to compare with NaN.&#34;,&#34;line&#34;:2,&#34;column&#34;:9,&#34;nodeType&#34;:&#34;BinaryExpression&#34;,&#34;messageId&#34;:&#34;comparisonWithNaN&#34;,&#34;endLine&#34;:2,&#34;endColumn&#34;:17},{&#34;ruleId&#34;:&#34;space-unary-ops&#34;,&#34;severity&#34;:2,&#34;message&#34;:&#34;Unexpected space before unary operator &#39;++&#39;.&#34;,&#34;line&#34;:3,&#34;column&#34;:16,&#34;nodeType&#34;:&#34;UpdateExpression&#34;,&#34;messageId&#34;:&#34;unexpectedBefore&#34;,&#34;endLine&#34;:3,&#34;endColumn&#34;:20,&#34;fix&#34;:{&#34;range&#34;:[57,58],&#34;text&#34;:&#34;&#34;}},{&#34;ruleId&#34;:&#34;semi&#34;,&#34;severity&#34;:1,&#34;message&#34;:&#34;Missing semicolon.&#34;,&#34;line&#34;:3,&#34;column&#34;:20,&#34;nodeType&#34;:&#34;ReturnStatement&#34;,&#34;messageId&#34;:&#34;missingSemi&#34;,&#34;endLine&#34;:4,&#34;endColumn&#34;:1,&#34;fix&#34;:{&#34;range&#34;:[60,60],&#34;text&#34;:&#34;;&#34;}},{&#34;ruleId&#34;:&#34;no-else-return&#34;,&#34;severity&#34;:1,&#34;message&#34;:&#34;Unnecessary &#39;else&#39; after &#39;return&#39;.&#34;,&#34;line&#34;:4,&#34;column&#34;:12,&#34;nodeType&#34;:&#34;BlockStatement&#34;,&#34;messageId&#34;:&#34;unexpected&#34;,&#34;endLine&#34;:6,&#34;endColumn&#34;:6,&#34;fix&#34;:{&#34;range&#34;:[0,94],&#34;text&#34;:&#34;function addOne(i) {\n    if (i != NaN) {\n        return i ++\n    } \n      return\n    \n}&#34;}},{&#34;ruleId&#34;:&#34;indent&#34;,&#34;severity&#34;:1,&#34;message&#34;:&#34;Expected indentation of 8 spaces but found 6.&#34;,&#34;line&#34;:5,&#34;column&#34;:1,&#34;nodeType&#34;:&#34;Keyword&#34;,&#34;messageId&#34;:&#34;wrongIndentation&#34;,&#34;endLine&#34;:5,&#34;endColumn&#34;:7,&#34;fix&#34;:{&#34;range&#34;:[74,80],&#34;text&#34;:&#34;        &#34;}},{&#34;ruleId&#34;:&#34;consistent-return&#34;,&#34;severity&#34;:2,&#34;message&#34;:&#34;Function &#39;addOne&#39; expected a return value.&#34;,&#34;line&#34;:5,&#34;column&#34;:7,&#34;nodeType&#34;:&#34;ReturnStatement&#34;,&#34;messageId&#34;:&#34;missingReturnValue&#34;,&#34;endLine&#34;:5,&#34;endColumn&#34;:13},{&#34;ruleId&#34;:&#34;semi&#34;,&#34;severity&#34;:1,&#34;message&#34;:&#34;Missing semicolon.&#34;,&#34;line&#34;:5,&#34;column&#34;:13,&#34;nodeType&#34;:&#34;ReturnStatement&#34;,&#34;messageId&#34;:&#34;missingSemi&#34;,&#34;endLine&#34;:6,&#34;endColumn&#34;:1,&#34;fix&#34;:{&#34;range&#34;:[86,86],&#34;text&#34;:&#34;;&#34;}},{&#34;ruleId&#34;:&#34;no-extra-semi&#34;,&#34;severity&#34;:2,&#34;message&#34;:&#34;Unnecessary semicolon.&#34;,&#34;line&#34;:7,&#34;column&#34;:2,&#34;nodeType&#34;:&#34;EmptyStatement&#34;,&#34;messageId&#34;:&#34;unexpected&#34;,&#34;endLine&#34;:7,&#34;endColumn&#34;:3,&#34;fix&#34;:{&#34;range&#34;:[93,95],&#34;text&#34;:&#34;}&#34;}}],&#34;suppressedMessages&#34;:[],&#34;errorCount&#34;:5,&#34;fatalErrorCount&#34;:0,&#34;warningCount&#34;:4,&#34;fixableErrorCount&#34;:2,&#34;fixableWarningCount&#34;:4,&#34;source&#34;:&#34;function addOne(i) {\n    if (i != NaN) {\n        return i ++\n    } else {\n      return\n    }\n};&#34;}],&#34;metadata&#34;:{&#34;rulesMeta&#34;:{&#34;no-else-return&#34;:{&#34;type&#34;:&#34;suggestion&#34;,&#34;docs&#34;:{&#34;description&#34;:&#34;Disallow `else` blocks after `return` statements in `if` statements&#34;,&#34;recommended&#34;:false,&#34;url&#34;:&#34;https://eslint.org/docs/rules/no-else-return&#34;},&#34;schema&#34;:[{&#34;type&#34;:&#34;object&#34;,&#34;properties&#34;:{&#34;allowElseIf&#34;:{&#34;type&#34;:&#34;boolean&#34;,&#34;default&#34;:true}},&#34;additionalProperties&#34;:false}],&#34;fixable&#34;:&#34;code&#34;,&#34;messages&#34;:{&#34;unexpected&#34;:&#34;Unnecessary &#39;else&#39; after &#39;return&#39;.&#34;}},&#34;indent&#34;:{&#34;type&#34;:&#34;layout&#34;,&#34;docs&#34;:{&#34;description&#34;:&#34;Enforce consistent indentation&#34;,&#34;recommended&#34;:false,&#34;url&#34;:&#34;https://eslint.org/docs/rules/indent&#34;},&#34;fixable&#34;:&#34;whitespace&#34;,&#34;schema&#34;:[{&#34;oneOf&#34;:[{&#34;enum&#34;:[&#34;tab&#34;]},{&#34;type&#34;:&#34;integer&#34;,&#34;minimum&#34;:0}]},{&#34;type&#34;:&#34;object&#34;,&#34;properties&#34;:{&#34;SwitchCase&#34;:{&#34;type&#34;:&#34;integer&#34;,&#34;minimum&#34;:0,&#34;default&#34;:0},&#34;VariableDeclarator&#34;:{&#34;oneOf&#34;:[{&#34;oneOf&#34;:[{&#34;type&#34;:&#34;integer&#34;,&#34;minimum&#34;:0},{&#34;enum&#34;:[&#34;first&#34;,&#34;off&#34;]}]},{&#34;type&#34;:&#34;object&#34;,&#34;properties&#34;:{&#34;var&#34;:{&#34;oneOf&#34;:[{&#34;type&#34;:&#34;integer&#34;,&#34;minimum&#34;:0},{&#34;enum&#34;:[&#34;first&#34;,&#34;off&#34;]}]},&#34;let&#34;:{&#34;oneOf&#34;:[{&#34;type&#34;:&#34;integer&#34;,&#34;minimum&#34;:0},{&#34;enum&#34;:[&#34;first&#34;,&#34;off&#34;]}]},&#34;const&#34;:{&#34;oneOf&#34;:[{&#34;type&#34;:&#34;integer&#34;,&#34;minimum&#34;:0},{&#34;enum&#34;:[&#34;first&#34;,&#34;off&#34;]}]}},&#34;additionalProperties&#34;:false}]},&#34;outerIIFEBody&#34;:{&#34;oneOf&#34;:[{&#34;type&#34;:&#34;integer&#34;,&#34;minimum&#34;:0},{&#34;enum&#34;:[&#34;off&#34;]}]},&#34;MemberExpression&#34;:{&#34;oneOf&#34;:[{&#34;type&#34;:&#34;integer&#34;,&#34;minimum&#34;:0},{&#34;enum&#34;:[&#34;off&#34;]}]},&#34;FunctionDeclaration&#34;:{&#34;type&#34;:&#34;object&#34;,&#34;properties&#34;:{&#34;parameters&#34;:{&#34;oneOf&#34;:[{&#34;type&#34;:&#34;integer&#34;,&#34;minimum&#34;:0},{&#34;enum&#34;:[&#34;first&#34;,&#34;off&#34;]}]},&#34;body&#34;:{&#34;type&#34;:&#34;integer&#34;,&#34;minimum&#34;:0}},&#34;additionalProperties&#34;:false},&#34;FunctionExpression&#34;:{&#34;type&#34;:&#34;object&#34;,&#34;properties&#34;:{&#34;parameters&#34;:{&#34;oneOf&#34;:[{&#34;type&#34;:&#34;integer&#34;,&#34;minimum&#34;:0},{&#34;enum&#34;:[&#34;first&#34;,&#34;off&#34;]}]},&#34;body&#34;:{&#34;type&#34;:&#34;integer&#34;,&#34;minimum&#34;:0}},&#34;additionalProperties&#34;:false},&#34;StaticBlock&#34;:{&#34;type&#34;:&#34;object&#34;,&#34;properties&#34;:{&#34;body&#34;:{&#34;type&#34;:&#34;integer&#34;,&#34;minimum&#34;:0}},&#34;additionalProperties&#34;:false},&#34;CallExpression&#34;:{&#34;type&#34;:&#34;object&#34;,&#34;properties&#34;:{&#34;arguments&#34;:{&#34;oneOf&#34;:[{&#34;type&#34;:&#34;integer&#34;,&#34;minimum&#34;:0},{&#34;enum&#34;:[&#34;first&#34;,&#34;off&#34;]}]}},&#34;additionalProperties&#34;:false},&#34;ArrayExpression&#34;:{&#34;oneOf&#34;:[{&#34;type&#34;:&#34;integer&#34;,&#34;minimum&#34;:0},{&#34;enum&#34;:[&#34;first&#34;,&#34;off&#34;]}]},&#34;ObjectExpression&#34;:{&#34;oneOf&#34;:[{&#34;type&#34;:&#34;integer&#34;,&#34;minimum&#34;:0},{&#34;enum&#34;:[&#34;first&#34;,&#34;off&#34;]}]},&#34;ImportDeclaration&#34;:{&#34;oneOf&#34;:[{&#34;type&#34;:&#34;integer&#34;,&#34;minimum&#34;:0},{&#34;enum&#34;:[&#34;first&#34;,&#34;off&#34;]}]},&#34;flatTernaryExpressions&#34;:{&#34;type&#34;:&#34;boolean&#34;,&#34;default&#34;:false},&#34;offsetTernaryExpressions&#34;:{&#34;type&#34;:&#34;boolean&#34;,&#34;default&#34;:false},&#34;ignoredNodes&#34;:{&#34;type&#34;:&#34;array&#34;,&#34;items&#34;:{&#34;type&#34;:&#34;string&#34;,&#34;not&#34;:{&#34;pattern&#34;:&#34;:exit$&#34;}}},&#34;ignoreComments&#34;:{&#34;type&#34;:&#34;boolean&#34;,&#34;default&#34;:false}},&#34;additionalProperties&#34;:false}],&#34;messages&#34;:{&#34;wrongIndentation&#34;:&#34;Expected indentation of {{expected}} but found {{actual}}.&#34;}},&#34;space-unary-ops&#34;:{&#34;type&#34;:&#34;layout&#34;,&#34;docs&#34;:{&#34;description&#34;:&#34;Enforce consistent spacing before or after unary operators&#34;,&#34;recommended&#34;:false,&#34;url&#34;:&#34;https://eslint.org/docs/rules/space-unary-ops&#34;},&#34;fixable&#34;:&#34;whitespace&#34;,&#34;schema&#34;:[{&#34;type&#34;:&#34;object&#34;,&#34;properties&#34;:{&#34;words&#34;:{&#34;type&#34;:&#34;boolean&#34;,&#34;default&#34;:true},&#34;nonwords&#34;:{&#34;type&#34;:&#34;boolean&#34;,&#34;default&#34;:false},&#34;overrides&#34;:{&#34;type&#34;:&#34;object&#34;,&#34;additionalProperties&#34;:{&#34;type&#34;:&#34;boolean&#34;}}},&#34;additionalProperties&#34;:false}],&#34;messages&#34;:{&#34;unexpectedBefore&#34;:&#34;Unexpected space before unary operator &#39;{{operator}}&#39;.&#34;,&#34;unexpectedAfter&#34;:&#34;Unexpected space after unary operator &#39;{{operator}}&#39;.&#34;,&#34;unexpectedAfterWord&#34;:&#34;Unexpected space after unary word operator &#39;{{word}}&#39;.&#34;,&#34;wordOperator&#34;:&#34;Unary word operator &#39;{{word}}&#39; must be followed by whitespace.&#34;,&#34;operator&#34;:&#34;Unary operator &#39;{{operator}}&#39; must be followed by whitespace.&#34;,&#34;beforeUnaryExpressions&#34;:&#34;Space is required before unary expressions &#39;{{token}}&#39;.&#34;}},&#34;semi&#34;:{&#34;type&#34;:&#34;layout&#34;,&#34;docs&#34;:{&#34;description&#34;:&#34;Require or disallow semicolons instead of ASI&#34;,&#34;recommended&#34;:false,&#34;url&#34;:&#34;https://eslint.org/docs/rules/semi&#34;},&#34;fixable&#34;:&#34;code&#34;,&#34;schema&#34;:{&#34;anyOf&#34;:[{&#34;type&#34;:&#34;array&#34;,&#34;items&#34;:[{&#34;enum&#34;:[&#34;never&#34;]},{&#34;type&#34;:&#34;object&#34;,&#34;properties&#34;:{&#34;beforeStatementContinuationChars&#34;:{&#34;enum&#34;:[&#34;always&#34;,&#34;any&#34;,&#34;never&#34;]}},&#34;additionalProperties&#34;:false}],&#34;minItems&#34;:0,&#34;maxItems&#34;:2},{&#34;type&#34;:&#34;array&#34;,&#34;items&#34;:[{&#34;enum&#34;:[&#34;always&#34;]},{&#34;type&#34;:&#34;object&#34;,&#34;properties&#34;:{&#34;omitLastInOneLineBlock&#34;:{&#34;type&#34;:&#34;boolean&#34;}},&#34;additionalProperties&#34;:false}],&#34;minItems&#34;:0,&#34;maxItems&#34;:2}]},&#34;messages&#34;:{&#34;missingSemi&#34;:&#34;Missing semicolon.&#34;,&#34;extraSemi&#34;:&#34;Extra semicolon.&#34;}},&#34;consistent-return&#34;:{&#34;type&#34;:&#34;suggestion&#34;,&#34;docs&#34;:{&#34;description&#34;:&#34;Require `return` statements to either always or never specify values&#34;,&#34;recommended&#34;:false,&#34;url&#34;:&#34;https://eslint.org/docs/rules/consistent-return&#34;},&#34;schema&#34;:[{&#34;type&#34;:&#34;object&#34;,&#34;properties&#34;:{&#34;treatUndefinedAsUnspecified&#34;:{&#34;type&#34;:&#34;boolean&#34;,&#34;default&#34;:false}},&#34;additionalProperties&#34;:false}],&#34;messages&#34;:{&#34;missingReturn&#34;:&#34;Expected to return a value at the end of {{name}}.&#34;,&#34;missingReturnValue&#34;:&#34;{{name}} expected a return value.&#34;,&#34;unexpectedReturnValue&#34;:&#34;{{name}} expected no return value.&#34;}}}}}
```

### json

```text
[{&#34;filePath&#34;:&#34;/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems.js&#34;,&#34;messages&#34;:[{&#34;ruleId&#34;:&#34;no-unused-vars&#34;,&#34;severity&#34;:2,&#34;message&#34;:&#34;&#39;addOne&#39; is defined but never used.&#34;,&#34;line&#34;:1,&#34;column&#34;:10,&#34;nodeType&#34;:&#34;Identifier&#34;,&#34;messageId&#34;:&#34;unusedVar&#34;,&#34;endLine&#34;:1,&#34;endColumn&#34;:16},{&#34;ruleId&#34;:&#34;use-isnan&#34;,&#34;severity&#34;:2,&#34;message&#34;:&#34;Use the isNaN function to compare with NaN.&#34;,&#34;line&#34;:2,&#34;column&#34;:9,&#34;nodeType&#34;:&#34;BinaryExpression&#34;,&#34;messageId&#34;:&#34;comparisonWithNaN&#34;,&#34;endLine&#34;:2,&#34;endColumn&#34;:17},{&#34;ruleId&#34;:&#34;space-unary-ops&#34;,&#34;severity&#34;:2,&#34;message&#34;:&#34;Unexpected space before unary operator &#39;++&#39;.&#34;,&#34;line&#34;:3,&#34;column&#34;:16,&#34;nodeType&#34;:&#34;UpdateExpression&#34;,&#34;messageId&#34;:&#34;unexpectedBefore&#34;,&#34;endLine&#34;:3,&#34;endColumn&#34;:20,&#34;fix&#34;:{&#34;range&#34;:[57,58],&#34;text&#34;:&#34;&#34;}},{&#34;ruleId&#34;:&#34;semi&#34;,&#34;severity&#34;:1,&#34;message&#34;:&#34;Missing semicolon.&#34;,&#34;line&#34;:3,&#34;column&#34;:20,&#34;nodeType&#34;:&#34;ReturnStatement&#34;,&#34;messageId&#34;:&#34;missingSemi&#34;,&#34;endLine&#34;:4,&#34;endColumn&#34;:1,&#34;fix&#34;:{&#34;range&#34;:[60,60],&#34;text&#34;:&#34;;&#34;}},{&#34;ruleId&#34;:&#34;no-else-return&#34;,&#34;severity&#34;:1,&#34;message&#34;:&#34;Unnecessary &#39;else&#39; after &#39;return&#39;.&#34;,&#34;line&#34;:4,&#34;column&#34;:12,&#34;nodeType&#34;:&#34;BlockStatement&#34;,&#34;messageId&#34;:&#34;unexpected&#34;,&#34;endLine&#34;:6,&#34;endColumn&#34;:6,&#34;fix&#34;:{&#34;range&#34;:[0,94],&#34;text&#34;:&#34;function addOne(i) {\n    if (i != NaN) {\n        return i ++\n    } \n      return\n    \n}&#34;}},{&#34;ruleId&#34;:&#34;indent&#34;,&#34;severity&#34;:1,&#34;message&#34;:&#34;Expected indentation of 8 spaces but found 6.&#34;,&#34;line&#34;:5,&#34;column&#34;:1,&#34;nodeType&#34;:&#34;Keyword&#34;,&#34;messageId&#34;:&#34;wrongIndentation&#34;,&#34;endLine&#34;:5,&#34;endColumn&#34;:7,&#34;fix&#34;:{&#34;range&#34;:[74,80],&#34;text&#34;:&#34;        &#34;}},{&#34;ruleId&#34;:&#34;consistent-return&#34;,&#34;severity&#34;:2,&#34;message&#34;:&#34;Function &#39;addOne&#39; expected a return value.&#34;,&#34;line&#34;:5,&#34;column&#34;:7,&#34;nodeType&#34;:&#34;ReturnStatement&#34;,&#34;messageId&#34;:&#34;missingReturnValue&#34;,&#34;endLine&#34;:5,&#34;endColumn&#34;:13},{&#34;ruleId&#34;:&#34;semi&#34;,&#34;severity&#34;:1,&#34;message&#34;:&#34;Missing semicolon.&#34;,&#34;line&#34;:5,&#34;column&#34;:13,&#34;nodeType&#34;:&#34;ReturnStatement&#34;,&#34;messageId&#34;:&#34;missingSemi&#34;,&#34;endLine&#34;:6,&#34;endColumn&#34;:1,&#34;fix&#34;:{&#34;range&#34;:[86,86],&#34;text&#34;:&#34;;&#34;}},{&#34;ruleId&#34;:&#34;no-extra-semi&#34;,&#34;severity&#34;:2,&#34;message&#34;:&#34;Unnecessary semicolon.&#34;,&#34;line&#34;:7,&#34;column&#34;:2,&#34;nodeType&#34;:&#34;EmptyStatement&#34;,&#34;messageId&#34;:&#34;unexpected&#34;,&#34;endLine&#34;:7,&#34;endColumn&#34;:3,&#34;fix&#34;:{&#34;range&#34;:[93,95],&#34;text&#34;:&#34;}&#34;}}],&#34;suppressedMessages&#34;:[],&#34;errorCount&#34;:5,&#34;fatalErrorCount&#34;:0,&#34;warningCount&#34;:4,&#34;fixableErrorCount&#34;:2,&#34;fixableWarningCount&#34;:4,&#34;source&#34;:&#34;function addOne(i) {\n    if (i != NaN) {\n        return i ++\n    } else {\n      return\n    }\n};&#34;}]
```

### junit

```text
&lt;?xml version=&#34;1.0&#34; encoding=&#34;utf-8&#34;?&gt;
&lt;testsuites&gt;
&lt;testsuite package=&#34;org.eslint&#34; time=&#34;0&#34; tests=&#34;9&#34; errors=&#34;9&#34; name=&#34;/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems.js&#34;&gt;
&lt;testcase time=&#34;0&#34; name=&#34;org.eslint.no-unused-vars&#34; classname=&#34;/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems&#34;&gt;&lt;failure message=&#34;&amp;apos;addOne&amp;apos; is defined but never used.&#34;&gt;&lt;![CDATA[line 1, col 10, Error - &amp;apos;addOne&amp;apos; is defined but never used. (no-unused-vars)]]&gt;&lt;/failure&gt;&lt;/testcase&gt;
&lt;testcase time=&#34;0&#34; name=&#34;org.eslint.use-isnan&#34; classname=&#34;/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems&#34;&gt;&lt;failure message=&#34;Use the isNaN function to compare with NaN.&#34;&gt;&lt;![CDATA[line 2, col 9, Error - Use the isNaN function to compare with NaN. (use-isnan)]]&gt;&lt;/failure&gt;&lt;/testcase&gt;
&lt;testcase time=&#34;0&#34; name=&#34;org.eslint.space-unary-ops&#34; classname=&#34;/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems&#34;&gt;&lt;failure message=&#34;Unexpected space before unary operator &amp;apos;++&amp;apos;.&#34;&gt;&lt;![CDATA[line 3, col 16, Error - Unexpected space before unary operator &amp;apos;++&amp;apos;. (space-unary-ops)]]&gt;&lt;/failure&gt;&lt;/testcase&gt;
&lt;testcase time=&#34;0&#34; name=&#34;org.eslint.semi&#34; classname=&#34;/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems&#34;&gt;&lt;failure message=&#34;Missing semicolon.&#34;&gt;&lt;![CDATA[line 3, col 20, Warning - Missing semicolon. (semi)]]&gt;&lt;/failure&gt;&lt;/testcase&gt;
&lt;testcase time=&#34;0&#34; name=&#34;org.eslint.no-else-return&#34; classname=&#34;/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems&#34;&gt;&lt;failure message=&#34;Unnecessary &amp;apos;else&amp;apos; after &amp;apos;return&amp;apos;.&#34;&gt;&lt;![CDATA[line 4, col 12, Warning - Unnecessary &amp;apos;else&amp;apos; after &amp;apos;return&amp;apos;. (no-else-return)]]&gt;&lt;/failure&gt;&lt;/testcase&gt;
&lt;testcase time=&#34;0&#34; name=&#34;org.eslint.indent&#34; classname=&#34;/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems&#34;&gt;&lt;failure message=&#34;Expected indentation of 8 spaces but found 6.&#34;&gt;&lt;![CDATA[line 5, col 1, Warning - Expected indentation of 8 spaces but found 6. (indent)]]&gt;&lt;/failure&gt;&lt;/testcase&gt;
&lt;testcase time=&#34;0&#34; name=&#34;org.eslint.consistent-return&#34; classname=&#34;/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems&#34;&gt;&lt;failure message=&#34;Function &amp;apos;addOne&amp;apos; expected a return value.&#34;&gt;&lt;![CDATA[line 5, col 7, Error - Function &amp;apos;addOne&amp;apos; expected a return value. (consistent-return)]]&gt;&lt;/failure&gt;&lt;/testcase&gt;
&lt;testcase time=&#34;0&#34; name=&#34;org.eslint.semi&#34; classname=&#34;/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems&#34;&gt;&lt;failure message=&#34;Missing semicolon.&#34;&gt;&lt;![CDATA[line 5, col 13, Warning - Missing semicolon. (semi)]]&gt;&lt;/failure&gt;&lt;/testcase&gt;
&lt;testcase time=&#34;0&#34; name=&#34;org.eslint.no-extra-semi&#34; classname=&#34;/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems&#34;&gt;&lt;failure message=&#34;Unnecessary semicolon.&#34;&gt;&lt;![CDATA[line 7, col 2, Error - Unnecessary semicolon. (no-extra-semi)]]&gt;&lt;/failure&gt;&lt;/testcase&gt;
&lt;/testsuite&gt;
&lt;/testsuites&gt;

```

### stylish

```text

/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems.js
  1:10  error    &#39;addOne&#39; is defined but never used            no-unused-vars
  2:9   error    Use the isNaN function to compare with NaN    use-isnan
  3:16  error    Unexpected space before unary operator &#39;++&#39;   space-unary-ops
  3:20  warning  Missing semicolon                             semi
  4:12  warning  Unnecessary &#39;else&#39; after &#39;return&#39;             no-else-return
  5:1   warning  Expected indentation of 8 spaces but found 6  indent
  5:7   error    Function &#39;addOne&#39; expected a return value     consistent-return
  5:13  warning  Missing semicolon                             semi
  7:2   error    Unnecessary semicolon                         no-extra-semi

✖ 9 problems (5 errors, 4 warnings)
  2 errors and 4 warnings potentially fixable with the `--fix` option.

```

### tap

```text
TAP version 13
1..1
not ok 1 - /var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems.js
  ---
  message: &#39;&#39;&#39;addOne&#39;&#39; is defined but never used.&#39;
  severity: error
  data:
    line: 1
    column: 10
    ruleId: no-unused-vars
  messages:
    - message: Use the isNaN function to compare with NaN.
      severity: error
      data:
        line: 2
        column: 9
        ruleId: use-isnan
    - message: Unexpected space before unary operator &#39;++&#39;.
      severity: error
      data:
        line: 3
        column: 16
        ruleId: space-unary-ops
    - message: Missing semicolon.
      severity: warning
      data:
        line: 3
        column: 20
        ruleId: semi
    - message: Unnecessary &#39;else&#39; after &#39;return&#39;.
      severity: warning
      data:
        line: 4
        column: 12
        ruleId: no-else-return
    - message: Expected indentation of 8 spaces but found 6.
      severity: warning
      data:
        line: 5
        column: 1
        ruleId: indent
    - message: Function &#39;addOne&#39; expected a return value.
      severity: error
      data:
        line: 5
        column: 7
        ruleId: consistent-return
    - message: Missing semicolon.
      severity: warning
      data:
        line: 5
        column: 13
        ruleId: semi
    - message: Unnecessary semicolon.
      severity: error
      data:
        line: 7
        column: 2
        ruleId: no-extra-semi
  ...

```

### unix

```text
/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems.js:1:10: &#39;addOne&#39; is defined but never used. [Error/no-unused-vars]
/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems.js:2:9: Use the isNaN function to compare with NaN. [Error/use-isnan]
/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems.js:3:16: Unexpected space before unary operator &#39;++&#39;. [Error/space-unary-ops]
/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems.js:3:20: Missing semicolon. [Warning/semi]
/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems.js:4:12: Unnecessary &#39;else&#39; after &#39;return&#39;. [Warning/no-else-return]
/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems.js:5:1: Expected indentation of 8 spaces but found 6. [Warning/indent]
/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems.js:5:7: Function &#39;addOne&#39; expected a return value. [Error/consistent-return]
/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems.js:5:13: Missing semicolon. [Warning/semi]
/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems.js:7:2: Unnecessary semicolon. [Error/no-extra-semi]

9 problems
```

### visualstudio

```text
/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems.js(1,10): error no-unused-vars : &#39;addOne&#39; is defined but never used.
/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems.js(2,9): error use-isnan : Use the isNaN function to compare with NaN.
/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems.js(3,16): error space-unary-ops : Unexpected space before unary operator &#39;++&#39;.
/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems.js(3,20): warning semi : Missing semicolon.
/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems.js(4,12): warning no-else-return : Unnecessary &#39;else&#39; after &#39;return&#39;.
/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems.js(5,1): warning indent : Expected indentation of 8 spaces but found 6.
/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems.js(5,7): error consistent-return : Function &#39;addOne&#39; expected a return value.
/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems.js(5,13): warning semi : Missing semicolon.
/var/lib/jenkins/workspace/Releases/eslint Release/eslint/fullOfProblems.js(7,2): error no-extra-semi : Unnecessary semicolon.

9 problems
```
