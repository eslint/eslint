---
title: Formatters Reference
eleventyNavigation:
    key: formatters
    parent: use eslint
    title: Formatters Reference
    order: 7
edit_link: https://github.com/eslint/eslint/edit/main/templates/formatter-examples.md.ejs
---

ESLint comes with several built-in formatters to control the appearance of the linting results, and supports third-party formatters as well.

You can specify a formatter using the [`--format` or `-f`](../command-line-interface#-f---format) flag in the CLI. For example, `--format json` uses the `json` formatter.

The built-in formatter options are:

* [html](#html)
* [json-with-metadata](#json-with-metadata)
* [json](#json)
* [stylish](#stylish)

## Example Source

Examples of each formatter were created from linting `fullOfProblems.js` using the `eslint.config.js` configuration shown below.

`fullOfProblems.js`:

```js
function addOne(i) {
    if (i != NaN) {
        return i ++;
    } else {
      return;
    }
};
```

`eslint.config.js`:

```js
import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
	{
		files: ["**/*.js"],
		plugins: {
			js,
		},
		extends: ["js/recommended"],
		rules: {
			"consistent-return": 2,
			"eqeqeq"           : [1, "always"],
            "max-lines"        : [1, 3],
			"no-else-return"   : 1,
			"no-plusplus"      : 2,
		}
	}
]);
```

Tests the formatters with the CLI:

```shell
npx eslint --format <Add formatter here> fullOfProblems.js
```

## Built-In Formatter Options

### html

Outputs results to HTML. The `html` formatter is useful for visual presentation in the browser.

Example output:

<iframe src="html-formatter-example.html" width="100%" height="460px"></iframe>

### json-with-metadata

Outputs JSON-serialized results. The `json-with-metadata` provides the same linting results as the [`json`](#json) formatter with additional metadata about the rules applied. The linting results are included in the `results` property and the rules metadata is included in the `metadata` property.

Alternatively, you can use the [ESLint Node.js API](../../integrate/nodejs-api) to programmatically use ESLint.

Example output (formatted for easier reading):

```json
{
    "results": [
        {
            "filePath": "C:\\Users\\Hp\\Desktop\\eslint\\fullOfProblems.js",
            "messages": [
                {
                    "ruleId": "no-unused-vars",
                    "severity": 2,
                    "message": "'addOne' is defined but never used.",
                    "line": 1,
                    "column": 10,
                    "messageId": "unusedVar",
                    "endLine": 1,
                    "endColumn": 16,
                    "suggestions": [
                        {
                            "messageId": "removeVar",
                            "data": {
                                "varName": "addOne"
                            },
                            "fix": {
                                "range": [
                                    0,
                                    96
                                ],
                                "text": ""
                            },
                            "desc": "Remove unused variable 'addOne'."
                        }
                    ]
                },
                {
                    "ruleId": "use-isnan",
                    "severity": 2,
                    "message": "Use the isNaN function to compare with NaN.",
                    "line": 2,
                    "column": 9,
                    "messageId": "comparisonWithNaN",
                    "endLine": 2,
                    "endColumn": 17,
                    "suggestions": [
                        {
                            "messageId": "replaceWithIsNaN",
                            "fix": {
                                "range": [
                                    29,
                                    37
                                ],
                                "text": "!Number.isNaN(i)"
                            },
                            "desc": "Replace with Number.isNaN."
                        },
                        {
                            "messageId": "replaceWithCastingAndIsNaN",
                            "fix": {
                                "range": [
                                    29,
                                    37
                                ],
                                "text": "!Number.isNaN(Number(i))"
                            },
                            "desc": "Replace with Number.isNaN and cast to a Number."
                        }
                    ]
                },
                {
                    "ruleId": "eqeqeq",
                    "severity": 1,
                    "message": "Expected '!==' and instead saw '!='.",
                    "line": 2,
                    "column": 11,
                    "messageId": "unexpected",
                    "endLine": 2,
                    "endColumn": 13,
                    "suggestions": [
                        {
                            "messageId": "replaceOperator",
                            "data": {
                                "expectedOperator": "!==",
                                "actualOperator": "!="
                            },
                            "fix": {
                                "range": [
                                    31,
                                    33
                                ],
                                "text": "!=="
                            },
                            "desc": "Use '!==' instead of '!='."
                        }
                    ]
                },
                {
                    "ruleId": "no-plusplus",
                    "severity": 2,
                    "message": "Unary operator '++' used.",
                    "line": 3,
                    "column": 16,
                    "messageId": "unexpectedUnaryOp",
                    "endLine": 3,
                    "endColumn": 20
                },
                {
                    "ruleId": "no-useless-assignment",
                    "severity": 2,
                    "message": "The value assigned to 'i' is not used in subsequent statements.",
                    "line": 3,
                    "column": 16,
                    "messageId": "unnecessaryAssignment",
                    "endLine": 3,
                    "endColumn": 17
                },
                {
                    "ruleId": "max-lines",
                    "severity": 1,
                    "message": "File has too many lines (7). Maximum allowed is 3.",
                    "line": 4,
                    "column": 1,
                    "messageId": "exceed",
                    "endLine": 7,
                    "endColumn": 3
                },
                {
                    "ruleId": "no-else-return",
                    "severity": 1,
                    "message": "Unnecessary 'else' after 'return'.",
                    "line": 4,
                    "column": 12,
                    "messageId": "unexpected",
                    "endLine": 6,
                    "endColumn": 6,
                    "fix": {
                        "range": [
                            0,
                            96
                        ],
                        "text": "function addOne(i) {\n    if (i != NaN) {\n        return i ++;\n    } \n      return;\n    \n}"
                    }
                },
                {
                    "ruleId": "consistent-return",
                    "severity": 2,
                    "message": "Function 'addOne' expected a return value.",
                    "line": 5,
                    "column": 7,
                    "messageId": "missingReturnValue",
                    "endLine": 5,
                    "endColumn": 14
                }
            ],
            "suppressedMessages": [],
            "errorCount": 5,
            "fatalErrorCount": 0,
            "warningCount": 3,
            "fixableErrorCount": 0,
            "fixableWarningCount": 1,
            "source": "function addOne(i) {\n    if (i != NaN) {\n        return i ++;\n    } else {\n      return;\n    }\n};",
            "usedDeprecatedRules": []
        }
    ],
    "metadata": {
        "cwd": "C:\\Users\\Hp\\Desktop\\eslint",
        "rulesMeta": {
            "no-unused-vars": {
                "type": "problem",
                "docs": {
                    "description": "Disallow unused variables",
                    "recommended": true,
                    "url": "https://eslint.org/docs/latest/rules/no-unused-vars"
                },
                "hasSuggestions": true,
                "schema": [
                    {
                        "oneOf": [
                            {
                                "enum": [
                                    "all",
                                    "local"
                                ]
                            },
                            {
                                "type": "object",
                                "properties": {
                                    "vars": {
                                        "enum": [
                                            "all",
                                            "local"
                                        ]
                                    },
                                    "varsIgnorePattern": {
                                        "type": "string"
                                    },
                                    "args": {
                                        "enum": [
                                            "all",
                                            "after-used",
                                            "none"
                                        ]
                                    },
                                    "ignoreRestSiblings": {
                                        "type": "boolean"
                                    },
                                    "argsIgnorePattern": {
                                        "type": "string"
                                    },
                                    "caughtErrors": {
                                        "enum": [
                                            "all",
                                            "none"
                                        ]
                                    },
                                    "caughtErrorsIgnorePattern": {
                                        "type": "string"
                                    },
                                    "destructuredArrayIgnorePattern": {
                                        "type": "string"
                                    },
                                    "ignoreClassWithStaticInitBlock": {
                                        "type": "boolean"
                                    },
                                    "ignoreUsingDeclarations": {
                                        "type": "boolean"
                                    },
                                    "reportUsedIgnorePattern": {
                                        "type": "boolean"
                                    }
                                },
                                "additionalProperties": false
                            }
                        ]
                    }
                ],
                "defaultOptions": [
                    {
                        "vars": "all",
                        "args": "after-used",
                        "ignoreRestSiblings": false,
                        "caughtErrors": "all",
                        "ignoreClassWithStaticInitBlock": false,
                        "ignoreUsingDeclarations": false,
                        "reportUsedIgnorePattern": false
                    }
                ],
                "messages": {
                    "unusedVar": "'{{varName}}' is {{action}} but never used{{additional}}.",
                    "usedIgnoredVar": "'{{varName}}' is marked as ignored but is used{{additional}}.",
                    "removeVar": "Remove unused variable '{{varName}}'."
                }
            },
            "use-isnan": {
                "hasSuggestions": true,
                "type": "problem",
                "docs": {
                    "description": "Require calls to `isNaN()` when checking for `NaN`",
                    "recommended": true,
                    "url": "https://eslint.org/docs/latest/rules/use-isnan"
                },
                "schema": [
                    {
                        "type": "object",
                        "properties": {
                            "enforceForSwitchCase": {
                                "type": "boolean"
                            },
                            "enforceForIndexOf": {
                                "type": "boolean"
                            }
                        },
                        "additionalProperties": false
                    }
                ],
                "defaultOptions": [
                    {
                        "enforceForIndexOf": false,
                        "enforceForSwitchCase": true
                    }
                ],
                "messages": {
                    "comparisonWithNaN": "Use the isNaN function to compare with NaN.",
                    "switchNaN": "'switch(NaN)' can never match a case clause. Use Number.isNaN instead of the switch.",
                    "caseNaN": "'case NaN' can never match. Use Number.isNaN before the switch.",
                    "indexOfNaN": "Array prototype method '{{ methodName }}' cannot find NaN.",
                    "replaceWithIsNaN": "Replace with Number.isNaN.",
                    "replaceWithCastingAndIsNaN": "Replace with Number.isNaN and cast to a Number.",
                    "replaceWithFindIndex": "Replace with Array.prototype.{{ methodName }}."
                }
            },
            "eqeqeq": {
                "type": "suggestion",
                "hasSuggestions": true,
                "docs": {
                    "description": "Require the use of `===` and `!==`",
                    "recommended": false,
                    "url": "https://eslint.org/docs/latest/rules/eqeqeq"
                },
                "schema": {
                    "anyOf": [
                        {
                            "type": "array",
                            "items": [
                                {
                                    "enum": [
                                        "always"
                                    ]
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "null": {
                                            "enum": [
                                                "always",
                                                "never",
                                                "ignore"
                                            ]
                                        }
                                    },
                                    "additionalProperties": false
                                }
                            ],
                            "additionalItems": false
                        },
                        {
                            "type": "array",
                            "items": [
                                {
                                    "enum": [
                                        "smart",
                                        "allow-null"
                                    ]
                                }
                            ],
                            "additionalItems": false
                        }
                    ]
                },
                "defaultOptions": [
                    "always"
                ],
                "fixable": "code",
                "messages": {
                    "unexpected": "Expected '{{expectedOperator}}' and instead saw '{{actualOperator}}'.",
                    "replaceOperator": "Use '{{expectedOperator}}' instead of '{{actualOperator}}'."
                }
            },
            "no-plusplus": {
                "type": "suggestion",
                "defaultOptions": [
                    {
                        "allowForLoopAfterthoughts": false
                    }
                ],
                "docs": {
                    "description": "Disallow the unary operators `++` and `--`",
                    "recommended": false,
                    "frozen": true,
                    "url": "https://eslint.org/docs/latest/rules/no-plusplus"
                },
                "schema": [
                    {
                        "type": "object",
                        "properties": {
                            "allowForLoopAfterthoughts": {
                                "type": "boolean"
                            }
                        },
                        "additionalProperties": false
                    }
                ],
                "messages": {
                    "unexpectedUnaryOp": "Unary operator '{{operator}}' used."
                }
            },
            "no-useless-assignment": {
                "type": "problem",
                "docs": {
                    "description": "Disallow variable assignments when the value is not used",
                    "recommended": true,
                    "url": "https://eslint.org/docs/latest/rules/no-useless-assignment"
                },
                "schema": [],
                "messages": {
                    "unnecessaryAssignment": "The value assigned to '{{name}}' is not used in subsequent statements."
                }
            },
            "max-lines": {
                "type": "suggestion",
                "docs": {
                    "description": "Enforce a maximum number of lines per file",
                    "recommended": false,
                    "url": "https://eslint.org/docs/latest/rules/max-lines"
                },
                "schema": [
                    {
                        "oneOf": [
                            {
                                "type": "integer",
                                "minimum": 0
                            },
                            {
                                "type": "object",
                                "properties": {
                                    "max": {
                                        "type": "integer",
                                        "minimum": 0
                                    },
                                    "skipComments": {
                                        "type": "boolean"
                                    },
                                    "skipBlankLines": {
                                        "type": "boolean"
                                    }
                                },
                                "additionalProperties": false
                            }
                        ]
                    }
                ],
                "defaultOptions": [
                    300
                ],
                "messages": {
                    "exceed": "File has too many lines ({{actual}}). Maximum allowed is {{max}}."
                }
            },
            "no-else-return": {
                "type": "suggestion",
                "defaultOptions": [
                    {
                        "allowElseIf": true
                    }
                ],
                "docs": {
                    "description": "Disallow `else` blocks after `return` statements in `if` statements",
                    "recommended": false,
                    "frozen": true,
                    "url": "https://eslint.org/docs/latest/rules/no-else-return"
                },
                "schema": [
                    {
                        "type": "object",
                        "properties": {
                            "allowElseIf": {
                                "type": "boolean"
                            }
                        },
                        "additionalProperties": false
                    }
                ],
                "fixable": "code",
                "messages": {
                    "unexpected": "Unnecessary 'else' after 'return'."
                }
            },
            "consistent-return": {
                "type": "suggestion",
                "docs": {
                    "description": "Require `return` statements to either always or never specify values",
                    "recommended": false,
                    "url": "https://eslint.org/docs/latest/rules/consistent-return"
                },
                "schema": [
                    {
                        "type": "object",
                        "properties": {
                            "treatUndefinedAsUnspecified": {
                                "type": "boolean"
                            }
                        },
                        "additionalProperties": false
                    }
                ],
                "defaultOptions": [
                    {
                        "treatUndefinedAsUnspecified": false
                    }
                ],
                "messages": {
                    "missingReturn": "Expected to return a value at the end of {{name}}.",
                    "missingReturnValue": "{{name}} expected a return value.",
                    "unexpectedReturnValue": "{{name}} expected no return value."
                }
            }
        }
    }
}
```

### json

Outputs JSON-serialized results. The `json` formatter is useful when you want to programmatically work with the CLI&#39;s linting results.

Alternatively, you can use the [ESLint Node.js API](../../integrate/nodejs-api) to programmatically use ESLint.

Example output (formatted for easier reading):

```json
[
    {
        "filePath": "C:\\Users\\Hp\\Desktop\\eslint\\fullOfProblems.js",
        "messages": [
            {
                "ruleId": "no-unused-vars",
                "severity": 2,
                "message": "'addOne' is defined but never used.",
                "line": 1,
                "column": 10,
                "messageId": "unusedVar",
                "endLine": 1,
                "endColumn": 16,
                "suggestions": [
                    {
                        "messageId": "removeVar",
                        "data": {
                            "varName": "addOne"
                        },
                        "fix": {
                            "range": [
                                0,
                                96
                            ],
                            "text": ""
                        },
                        "desc": "Remove unused variable 'addOne'."
                    }
                ]
            },
            {
                "ruleId": "use-isnan",
                "severity": 2,
                "message": "Use the isNaN function to compare with NaN.",
                "line": 2,
                "column": 9,
                "messageId": "comparisonWithNaN",
                "endLine": 2,
                "endColumn": 17,
                "suggestions": [
                    {
                        "messageId": "replaceWithIsNaN",
                        "fix": {
                            "range": [
                                29,
                                37
                            ],
                            "text": "!Number.isNaN(i)"
                        },
                        "desc": "Replace with Number.isNaN."
                    },
                    {
                        "messageId": "replaceWithCastingAndIsNaN",
                        "fix": {
                            "range": [
                                29,
                                37
                            ],
                            "text": "!Number.isNaN(Number(i))"
                        },
                        "desc": "Replace with Number.isNaN and cast to a Number."
                    }
                ]
            },
            {
                "ruleId": "eqeqeq",
                "severity": 1,
                "message": "Expected '!==' and instead saw '!='.",
                "line": 2,
                "column": 11,
                "messageId": "unexpected",
                "endLine": 2,
                "endColumn": 13,
                "suggestions": [
                    {
                        "messageId": "replaceOperator",
                        "data": {
                            "expectedOperator": "!==",
                            "actualOperator": "!="
                        },
                        "fix": {
                            "range": [
                                31,
                                33
                            ],
                            "text": "!=="
                        },
                        "desc": "Use '!==' instead of '!='."
                    }
                ]
            },
            {
                "ruleId": "no-plusplus",
                "severity": 2,
                "message": "Unary operator '++' used.",
                "line": 3,
                "column": 16,
                "messageId": "unexpectedUnaryOp",
                "endLine": 3,
                "endColumn": 20
            },
            {
                "ruleId": "no-useless-assignment",
                "severity": 2,
                "message": "The value assigned to 'i' is not used in subsequent statements.",
                "line": 3,
                "column": 16,
                "messageId": "unnecessaryAssignment",
                "endLine": 3,
                "endColumn": 17
            },
            {
                "ruleId": "max-lines",
                "severity": 1,
                "message": "File has too many lines (7). Maximum allowed is 3.",
                "line": 4,
                "column": 1,
                "messageId": "exceed",
                "endLine": 7,
                "endColumn": 3
            },
            {
                "ruleId": "no-else-return",
                "severity": 1,
                "message": "Unnecessary 'else' after 'return'.",
                "line": 4,
                "column": 12,
                "messageId": "unexpected",
                "endLine": 6,
                "endColumn": 6,
                "fix": {
                    "range": [
                        0,
                        96
                    ],
                    "text": "function addOne(i) {\n    if (i != NaN) {\n        return i ++;\n    } \n      return;\n    \n}"
                }
            },
            {
                "ruleId": "consistent-return",
                "severity": 2,
                "message": "Function 'addOne' expected a return value.",
                "line": 5,
                "column": 7,
                "messageId": "missingReturnValue",
                "endLine": 5,
                "endColumn": 14
            }
        ],
        "suppressedMessages": [],
        "errorCount": 5,
        "fatalErrorCount": 0,
        "warningCount": 3,
        "fixableErrorCount": 0,
        "fixableWarningCount": 1,
        "source": "function addOne(i) {\n    if (i != NaN) {\n        return i ++;\n    } else {\n      return;\n    }\n};",
        "usedDeprecatedRules": []
    }
]
```

### stylish

Human-readable output format. This is the default formatter.

Example output:

```text

C:\Users\Hp\Desktop\eslint\fullOfProblems.js
  1:10  error    'addOne' is defined but never used                              no-unused-vars
  2:9   error    Use the isNaN function to compare with NaN                      use-isnan
  2:11  warning  Expected '!==' and instead saw '!='                             eqeqeq
  3:16  error    Unary operator '++' used                                        no-plusplus
  3:16  error    The value assigned to 'i' is not used in subsequent statements  no-useless-assignment
  4:1   warning  File has too many lines (7). Maximum allowed is 3               max-lines
  4:12  warning  Unnecessary 'else' after 'return'                               no-else-return
  5:7   error    Function 'addOne' expected a return value                       consistent-return

✖ 8 problems (5 errors, 3 warnings)
  0 errors and 1 warning potentially fixable with the `--fix` option.

```
