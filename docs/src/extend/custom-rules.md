---
title: Custom Rules
eleventyNavigation:
    key: custom rules
    parent: create plugins
    title: Custom Rules
    order: 2

---

You can create custom rules to use with ESLint. You might want to create a custom rule if the [core rules](../rules/) do not cover your use case.

Here's the basic format of a custom rule:

```js
// customRule.js

module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "Description of the rule",
        },
        fixable: "code",
        schema: [] // no options
    },
    create: function(context) {
        return {
            // callback functions
        };
    }
};
```

## Rule Structure

The source file for a rule exports an object with the following properties. Both custom rules and core rules follow this format.

`meta`: (`object`) Contains metadata for the rule:

* `type`: (`string`) Indicates the type of rule, which is one of `"problem"`, `"suggestion"`, or `"layout"`:

    * `"problem"`: The rule is identifying code that either will cause an error or may cause a confusing behavior. Developers should consider this a high priority to resolve.
    * `"suggestion"`: The rule is identifying something that could be done in a better way but no errors will occur if the code isn't changed.
    * `"layout"`: The rule cares primarily about whitespace, semicolons, commas, and parentheses, all the parts of the program that determine how the code looks rather than how it executes. These rules work on parts of the code that aren't specified in the AST.

* `docs`: (`object`) Properties often used for documentation generation and tooling. Required for core rules and optional for custom rules. Custom rules can include additional properties here as needed.

    * `description`: (`string`) Provides a short description of the rule. For core rules, this is used in [rules index](../rules/).
    * `recommended`: (`boolean`) For core rules, this specifies whether the rule is enabled by the `recommended` config from `@eslint/js`.
    * `url`: (`string`) Specifies the URL at which the full documentation can be accessed. Code editors often use this to provide a helpful link on highlighted rule violations.

* `fixable`: (`string`) Either `"code"` or `"whitespace"` if the `--fix` option on the [command line](../use/command-line-interface#--fix) automatically fixes problems reported by the rule.

  **Important:** the `fixable` property is mandatory for fixable rules. If this property isn't specified, ESLint will throw an error whenever the rule attempts to produce a fix. Omit the `fixable` property if the rule is not fixable.

* `hasSuggestions`: (`boolean`) Specifies whether rules can return suggestions (defaults to `false` if omitted).

  **Important:** the `hasSuggestions` property is mandatory for rules that provide suggestions. If this property isn't set to `true`, ESLint will throw an error whenever the rule attempts to produce a suggestion. Omit the `hasSuggestions` property if the rule does not provide suggestions.

* `schema`: (`object | array | false`) Specifies the [options](#options-schemas) so ESLint can prevent invalid [rule configurations](../use/configure/rules). Mandatory when the rule has options.

* `deprecated`: (`boolean`) Indicates whether the rule has been deprecated.  You may omit the `deprecated` property if the rule has not been deprecated.

* `replacedBy`: (`array`) In the case of a deprecated rule, specify replacement rule(s).

`create()`: Returns an object with methods that ESLint calls to "visit" nodes while traversing the abstract syntax tree (AST as defined by [ESTree](https://github.com/estree/estree)) of JavaScript code:

* If a key is a node type or a [selector](./selectors), ESLint calls that **visitor** function while going **down** the tree.
* If a key is a node type or a [selector](./selectors) plus `:exit`, ESLint calls that **visitor** function while going **up** the tree.
* If a key is an event name, ESLint calls that **handler** function for [code path analysis](code-path-analysis).

A rule can use the current node and its surrounding tree to report or fix problems.

Here are methods for the [array-callback-return](../rules/array-callback-return) rule:

```js
function checkLastSegment (node) {
    // report problem for function if last code path segment is reachable
}

module.exports = {
    meta: { ... },
    create: function(context) {
        // declare the state of the rule
        return {
            ReturnStatement: function(node) {
                // at a ReturnStatement node while going down
            },
            // at a function expression node while going up:
            "FunctionExpression:exit": checkLastSegment,
            "ArrowFunctionExpression:exit": checkLastSegment,
            onCodePathStart: function (codePath, node) {
                // at the start of analyzing a code path
            },
            onCodePathEnd: function(codePath, node) {
                // at the end of analyzing a code path
            }
        };
    }
};
```

## The Context Object

The `context` object is the only argument of the `create` method in a rule. For example:

```js
// customRule.js

module.exports = {
    meta: { ... },
    // `context` object is the argument
    create(context) {
       // ...
    }
};
```

As the name implies, the `context` object contains information that is relevant to the context of the rule.

The `context` object has the following properties:

* `id`: (`string`) The rule ID.
* `filename`: (`string`) The filename associated with the source.
* `physicalFilename`: (`string`) When linting a file, it provides the full path of the file on disk without any code block information. When linting text, it provides the value passed to `—stdin-filename` or `<text>` if not specified.
* `cwd`: (`string`) The `cwd` option passed to the [Linter](../integrate/nodejs-api#linter). It is a path to a directory that should be considered the current working directory.
* `options`: (`array`) An array of the [configured options](../use/configure/rules) for this rule. This array does not include the rule severity (see the [dedicated section](#accessing-options-passed-to-a-rule)).
* `sourceCode`: (`object`) A `SourceCode` object that you can use to work with the source that was passed to ESLint (see [Accessing the Source Code](#accessing-the-source-code)).
* `settings`: (`object`) The [shared settings](../use/configure/configuration-files#configuring-shared-settings) from the configuration.
* `languageOptions`: (`object`) more details for each property [here](../use/configure/language-options)
    * `sourceType`: (`'script' | 'module' | 'commonjs'`) The mode for the current file.
    * `ecmaVersion`: (`number`) The ECMA version used to parse the current file.
    * `parser`: (`object`|`string`): Either the parser used to parse the current file for flat config or its name for legacy config.
    * `parserOptions`: (`object`) The parser options configured for this file.
    * `globals`: (`object`) The specified globals.
* `parserPath`: (`string`, **Removed** Use `context.languageOptions.parser` instead.) The name of the `parser` from the configuration.
* `parserOptions`: (**Deprecated** Use `context.languageOptions.parserOptions` instead.) The parser options configured for this run (more details [here](../use/configure/language-options#specifying-parser-options)).

Additionally, the `context` object has the following methods:

* `getCwd()`: (**Deprecated:** Use `context.cwd` instead.) Returns the `cwd` option passed to the [Linter](../integrate/nodejs-api#linter). It is a path to a directory that should be considered the current working directory.
* `getFilename()`: (**Deprecated:** Use `context.filename` instead.) Returns the filename associated with the source.
* `getPhysicalFilename()`: (**Deprecated:** Use `context.physicalFilename` instead.) When linting a file, it returns the full path of the file on disk without any code block information. When linting text, it returns the value passed to `—stdin-filename` or `<text>` if not specified.
* `getSourceCode()`: (**Deprecated:** Use `context.sourceCode` instead.) Returns a `SourceCode` object that you can use to work with the source that was passed to ESLint (see [Accessing the Source Code](#accessing-the-source-code)).
* `report(descriptor)`. Reports a problem in the code (see the [dedicated section](#reporting-problems)).

**Note:** Earlier versions of ESLint supported additional methods on the `context` object. Those methods were removed in the new format and should not be relied upon.

### Reporting Problems

The main method you'll use when writing custom rules is `context.report()`, which publishes a warning or error (depending on the configuration being used). This method accepts a single argument, which is an object containing the following properties:

* `messageId`: (`string`) The ID of the message (see [messageIds](#messageids)) (recommended over `message`).
* `message`: (`string`) The problem message (alternative to `messageId`).
* `node`: (optional `object`) The AST node related to the problem. If present and `loc` is not specified, then the starting location of the node is used as the location of the problem.
* `loc`: (optional `object`) Specifies the location of the problem. If both `loc` and `node` are specified, then the location is used from `loc` instead of `node`.
    * `start`: An object of the start location.
        * `line`: (`number`) The 1-based line number at which the problem occurred.
        * `column`: (`number`) The 0-based column number at which the problem occurred.
    * `end`: An object of the end location.
        * `line`: (`number`) The 1-based line number at which the problem occurred.
        * `column`: (`number`) The 0-based column number at which the problem occurred.
* `data`: (optional `object`) [Placeholder](#using-message-placeholders) data for `message`.
* `fix(fixer)`: (optional `function`) Applies a [fix](#applying-fixes) to resolve the problem.

Note that at least one of `node` or `loc` is required.

The simplest example is to use just `node` and `message`:

```js
context.report({
    node: node,
    message: "Unexpected identifier"
});
```

The node contains all the information necessary to figure out the line and column number of the offending text as well as the source text representing the node.

#### Using Message Placeholders

You can also use placeholders in the message and provide `data`:

```js
{% raw %}
context.report({
    node: node,
    message: "Unexpected identifier: {{ identifier }}",
    data: {
        identifier: node.name
    }
});
{% endraw %}
```

Note that leading and trailing whitespace is optional in message parameters.

The node contains all the information necessary to figure out the line and column number of the offending text as well as the source text representing the node.

#### `messageId`s

`messageId`s are the recommended approach to reporting messages in `context.report()` calls because of the following benefits:

* Rule violation messages can be stored in a central `meta.messages` object for convenient management
* Rule violation messages do not need to be repeated in both the rule file and rule test file
* As a result, the barrier for changing rule violation messages is lower, encouraging more frequent contributions to improve and optimize them for the greatest clarity and usefulness

Rule file:

```js
{% raw %}
// avoid-name.js

module.exports = {
    meta: {
        messages: {
            avoidName: "Avoid using variables named '{{ name }}'"
        }
    },
    create(context) {
        return {
            Identifier(node) {
                if (node.name === "foo") {
                    context.report({
                        node,
                        messageId: "avoidName",
                        data: {
                            name: "foo",
                        }
                    });
                }
            }
        };
    }
};
{% endraw %}
```

In the file to lint:

```javascript
// someFile.js

var foo = 2;
//  ^ error: Avoid using variables named 'foo'
```

In your tests:

```javascript
// avoid-name.test.js

var rule = require("../../../lib/rules/avoid-name");
var RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester();
ruleTester.run("avoid-name", rule, {
    valid: ["bar", "baz"],
    invalid: [
        {
            code: "foo",
            errors: [
                {
                    messageId: "avoidName"
                }
            ]
        }
    ]
});
```

#### Applying Fixes

If you'd like ESLint to attempt to fix the problem you're reporting, you can do so by specifying the `fix` function when using `context.report()`. The `fix` function receives a single argument, a `fixer` object, that you can use to apply a fix. For example:

```js
context.report({
    node: node,
    message: "Missing semicolon",
    fix(fixer) {
        return fixer.insertTextAfter(node, ";");
    }
});
```

Here, the `fix()` function is used to insert a semicolon after the node. Note that a fix is not immediately applied, and may not be applied at all if there are conflicts with other fixes. After applying fixes, ESLint will run all the enabled rules again on the fixed code, potentially applying more fixes. This process will repeat up to 10 times, or until no more fixable problems are found. Afterward, any remaining problems will be reported as usual.

**Important:** The `meta.fixable` property is mandatory for fixable rules. ESLint will throw an error if a rule that implements `fix` functions does not [export](#rule-structure) the `meta.fixable` property.

The `fixer` object has the following methods:

* `insertTextAfter(nodeOrToken, text)`: Insert text after the given node or token.
* `insertTextAfterRange(range, text)`: Insert text after the given range.
* `insertTextBefore(nodeOrToken, text)`: Insert text before the given node or token.
* `insertTextBeforeRange(range, text)`: Insert text before the given range.
* `remove(nodeOrToken)`: Remove the given node or token.
* `removeRange(range)`: Remove text in the given range.
* `replaceText(nodeOrToken, text)`: Replace the text in the given node or token.
* `replaceTextRange(range, text)`: Replace the text in the given range.

A `range` is a two-item array containing character indices inside the source code. The first item is the start of the range (inclusive) and the second item is the end of the range (exclusive). Every node and token has a `range` property to identify the source code range they represent.

The above methods return a `fixing` object.
The `fix()` function can return the following values:

* A `fixing` object.
* An array which includes `fixing` objects.
* An iterable object which enumerates `fixing` objects. Especially, the `fix()` function can be a generator.

If you make a `fix()` function which returns multiple `fixing` objects, those `fixing` objects must not overlap.

Best practices for fixes:

1. Avoid any fixes that could change the runtime behavior of code and cause it to stop working.
1. Make fixes as small as possible. Fixes that are unnecessarily large could conflict with other fixes, and prevent them from being applied.
1. Only make one fix per message. This is enforced because you must return the result of the fixer operation from `fix()`.
1. Since all rules are run again after the initial round of fixes is applied, it's not necessary for a rule to check whether the code style of a fix will cause errors to be reported by another rule.
    * For example, suppose a fixer would like to surround an object key with quotes, but it's not sure whether the user would prefer single or double quotes.

        ```js
        ({ foo : 1 })

        // should get fixed to either

        ({ 'foo': 1 })

        // or

        ({ "foo": 1 })
        ```

    * This fixer can just select a quote type arbitrarily. If it guesses wrong, the resulting code will be automatically reported and fixed by the [`quotes`](../rules/quotes) rule.

Note: Making fixes as small as possible is a best practice, but in some cases it may be correct to extend the range of the fix in order to intentionally prevent other rules from making fixes in a surrounding range in the same pass. For instance, if replacement text declares a new variable, it can be useful to prevent other changes in the scope of the variable as they might cause name collisions.

The following example replaces `node` and also ensures that no other fixes will be applied in the range of `node.parent` in the same pass:

```js
context.report({
    node,
    message,
    *fix(fixer) {
        yield fixer.replaceText(node, replacementText);

        // extend range of the fix to the range of `node.parent`
        yield fixer.insertTextBefore(node.parent, "");
        yield fixer.insertTextAfter(node.parent, "");
    }
});
```

#### Conflicting Fixes

Conflicting fixes are fixes that apply different changes to the same part of the source code.
There is no way to specify which of the conflicting fixes is applied.

For example, if two fixes want to modify characters 0 through 5, only one is applied.

#### Providing Suggestions

In some cases fixes aren't appropriate to be automatically applied, for example, if a fix potentially changes functionality or if there are multiple valid ways to fix a rule depending on the implementation intent (see the best practices for [applying fixes](#applying-fixes) listed above). In these cases, there is an alternative `suggest` option on `context.report()` that allows other tools, such as editors, to expose helpers for users to manually apply a suggestion.

To provide suggestions, use the `suggest` key in the report argument with an array of suggestion objects. The suggestion objects represent individual suggestions that could be applied and require either a `desc` key string that describes what applying the suggestion would do or a `messageId` key (see [below](#suggestion-messageids)), and a `fix` key that is a function defining the suggestion result. This `fix` function follows the same API as regular fixes (described above in [applying fixes](#applying-fixes)).

```js
{% raw %}
context.report({
    node: node,
    message: "Unnecessary escape character: \\{{character}}.",
    data: { character },
    suggest: [
        {
            desc: "Remove the `\\`. This maintains the current functionality.",
            fix: function(fixer) {
                return fixer.removeRange(range);
            }
        },
        {
            desc: "Replace the `\\` with `\\\\` to include the actual backslash character.",
            fix: function(fixer) {
                return fixer.insertTextBeforeRange(range, "\\");
            }
        }
    ]
});
{% endraw %}
```

**Important:** The `meta.hasSuggestions` property is mandatory for rules that provide suggestions. ESLint will throw an error if a rule attempts to produce a suggestion but does not [export](#rule-structure) this property.

**Note:** Suggestions are applied as stand-alone changes, without triggering multipass fixes. Each suggestion should focus on a singular change in the code and should not try to conform to user-defined styles. For example, if a suggestion is adding a new statement into the codebase, it should not try to match correct indentation or conform to user preferences on the presence/absence of semicolons. All of those things can be corrected by multipass autofix when the user triggers it.

Best practices for suggestions:

1. Don't try to do too much and suggest large refactors that could introduce a lot of breaking changes.
1. As noted above, don't try to conform to user-defined styles.

Suggestions are intended to provide fixes. ESLint will automatically remove the whole suggestion from the linting output if the suggestion's `fix` function returned `null` or an empty array/sequence.

#### Suggestion `messageId`s

Instead of using a `desc` key for suggestions a `messageId` can be used instead. This works the same way as `messageId`s for the overall error (see [messageIds](#messageids)). Here is an example of how to use a suggestion `messageId` in a rule:

```js
{% raw %}
module.exports = {
    meta: {
        messages: {
            unnecessaryEscape: "Unnecessary escape character: \\{{character}}.",
            removeEscape: "Remove the `\\`. This maintains the current functionality.",
            escapeBackslash: "Replace the `\\` with `\\\\` to include the actual backslash character."
        },
        hasSuggestions: true
    },
    create: function(context) {
        // ...
        context.report({
            node: node,
            messageId: 'unnecessaryEscape',
            data: { character },
            suggest: [
                {
                    messageId: "removeEscape", // suggestion messageId
                    fix: function(fixer) {
                        return fixer.removeRange(range);
                    }
                },
                {
                    messageId: "escapeBackslash", // suggestion messageId
                    fix: function(fixer) {
                        return fixer.insertTextBeforeRange(range, "\\");
                    }
                }
            ]
        });
    }
};
{% endraw %}
```

#### Placeholders in Suggestion Messages

You can also use placeholders in the suggestion message. This works the same way as placeholders for the overall error (see [using message placeholders](#using-message-placeholders)).

Please note that you have to provide `data` on the suggestion's object. Suggestion messages cannot use properties from the overall error's `data`.

```js
{% raw %}
module.exports = {
    meta: {
        messages: {
            unnecessaryEscape: "Unnecessary escape character: \\{{character}}.",
            removeEscape: "Remove `\\` before {{character}}.",
        },
        hasSuggestions: true
    },
    create: function(context) {
        // ...
        context.report({
            node: node,
            messageId: "unnecessaryEscape",
            data: { character }, // data for the unnecessaryEscape overall message
            suggest: [
                {
                    messageId: "removeEscape",
                    data: { character }, // data for the removeEscape suggestion message
                    fix: function(fixer) {
                        return fixer.removeRange(range);
                    }
                }
            ]
        });
    }
};
{% endraw %}
```

### Accessing Options Passed to a Rule

Some rules require options in order to function correctly. These options appear in configuration (`.eslintrc`, command line interface, or comments). For example:

```json
{
    "quotes": ["error", "double"]
}
```

The `quotes` rule in this example has one option, `"double"` (the `error` is the error level). You can retrieve the options for a rule by using `context.options`, which is an array containing every configured option for the rule. In this case, `context.options[0]` would contain `"double"`:

```js
module.exports = {
    meta: {
        schema: [
            {
                enum: ["single", "double", "backtick"]
            }
        ]
    },
    create: function(context) {
        var isDouble = (context.options[0] === "double");

        // ...
    }
};
```

Since `context.options` is just an array, you can use it to determine how many options have been passed as well as retrieving the actual options themselves. Keep in mind that the error level is not part of `context.options`, as the error level cannot be known or modified from inside a rule.

When using options, make sure that your rule has some logical defaults in case the options are not provided.

Rules with options must specify a [schema](#options-schemas).

### Accessing the Source Code

The `SourceCode` object is the main object for getting more information about the source code being linted. You can retrieve the `SourceCode` object at any time by using the `context.sourceCode` property:

```js
module.exports = {
    create: function(context) {
        var sourceCode = context.sourceCode;

        // ...
    }
};
```

**Deprecated:** The `context.getSourceCode()` method is deprecated; make sure to use `context.sourceCode` property instead.

Once you have an instance of `SourceCode`, you can use the following methods on it to work with the code:

* `getText(node)`: Returns the source code for the given node. Omit `node` to get the whole source (see the [dedicated section](#accessing-the-source-text)).
* `getAllComments()`: Returns an array of all comments in the source (see the [dedicated section](#accessing-comments)).
* `getCommentsBefore(nodeOrToken)`: Returns an array of comment tokens that occur directly before the given node or token (see the [dedicated section](#accessing-comments)).
* `getCommentsAfter(nodeOrToken)`: Returns an array of comment tokens that occur directly after the given node or token (see the [dedicated section](#accessing-comments)).
* `getCommentsInside(node)`: Returns an array of all comment tokens inside a given node (see the [dedicated section](#accessing-comments)).
* `isSpaceBetween(nodeOrToken, nodeOrToken)`: Returns true if there is a whitespace character between the two tokens or, if given a node, the last token of the first node and the first token of the second node.
* `getFirstToken(node, skipOptions)`: Returns the first token representing the given node.
* `getFirstTokens(node, countOptions)`: Returns the first `count` tokens representing the given node.
* `getLastToken(node, skipOptions)`: Returns the last token representing the given node.
* `getLastTokens(node, countOptions)`: Returns the last `count` tokens representing the given node.
* `getTokenAfter(nodeOrToken, skipOptions)`: Returns the first token after the given node or token.
* `getTokensAfter(nodeOrToken, countOptions)`: Returns `count` tokens after the given node or token.
* `getTokenBefore(nodeOrToken, skipOptions)`: Returns the first token before the given node or token.
* `getTokensBefore(nodeOrToken, countOptions)`: Returns `count` tokens before the given node or token.
* `getFirstTokenBetween(nodeOrToken1, nodeOrToken2, skipOptions)`: Returns the first token between two nodes or tokens.
* `getFirstTokensBetween(nodeOrToken1, nodeOrToken2, countOptions)`: Returns the first `count` tokens between two nodes or tokens.
* `getLastTokenBetween(nodeOrToken1, nodeOrToken2, skipOptions)`: Returns the last token between two nodes or tokens.
* `getLastTokensBetween(nodeOrToken1, nodeOrToken2, countOptions)`: Returns the last `count` tokens between two nodes or tokens.
* `getTokens(node)`: Returns all tokens for the given node.
* `getTokensBetween(nodeOrToken1, nodeOrToken2)`: Returns all tokens between two nodes.
* `getTokenByRangeStart(index, rangeOptions)`: Returns the token whose range starts at the given index in the source.
* `getNodeByRangeIndex(index)`: Returns the deepest node in the AST containing the given source index.
* `getLocFromIndex(index)`: Returns an object with `line` and `column` properties, corresponding to the location of the given source index. `line` is 1-based and `column` is 0-based.
* `getIndexFromLoc(loc)`: Returns the index of a given location in the source code, where `loc` is an object with a 1-based `line` key and a 0-based `column` key.
* `commentsExistBetween(nodeOrToken1, nodeOrToken2)`: Returns `true` if comments exist between two nodes.
* `getAncestors(node)`: Returns an array of the ancestors of the given node, starting at the root of the AST and continuing through the direct parent of the given node. This array does not include the given node itself.
* `getDeclaredVariables(node)`: Returns a list of [variables](./scope-manager-interface#variable-interface) declared by the given node. This information can be used to track references to variables.
    * If the node is a `VariableDeclaration`, all variables declared in the declaration are returned.
    * If the node is a `VariableDeclarator`, all variables declared in the declarator are returned.
    * If the node is a `FunctionDeclaration` or `FunctionExpression`, the variable for the function name is returned, in addition to variables for the function parameters.
    * If the node is an `ArrowFunctionExpression`, variables for the parameters are returned.
    * If the node is a `ClassDeclaration` or a `ClassExpression`, the variable for the class name is returned.
    * If the node is a `CatchClause`, the variable for the exception is returned.
    * If the node is an `ImportDeclaration`, variables for all of its specifiers are returned.
    * If the node is an `ImportSpecifier`, `ImportDefaultSpecifier`, or `ImportNamespaceSpecifier`, the declared variable is returned.
    * Otherwise, if the node does not declare any variables, an empty array is returned.
* `getScope(node)`: Returns the [scope](./scope-manager-interface#scope-interface) of the given node. This information can be used to track references to variables.
* `markVariableAsUsed(name, refNode)`: Marks a variable with the given name in a scope indicated by the given reference node as used. This affects the [no-unused-vars](../rules/no-unused-vars) rule. Returns `true` if a variable with the given name was found and marked as used, otherwise `false`.

`skipOptions` is an object which has 3 properties; `skip`, `includeComments`, and `filter`. Default is `{skip: 0, includeComments: false, filter: null}`.

* `skip`: (`number`) Positive integer, the number of skipping tokens. If `filter` option is given at the same time, it doesn't count filtered tokens as skipped.
* `includeComments`: (`boolean`) The flag to include comment tokens into the result.
* `filter(token)`: Function which gets a token as the first argument. If the function returns `false` then the result excludes the token.

`countOptions` is an object which has 3 properties; `count`, `includeComments`, and `filter`. Default is `{count: 0, includeComments: false, filter: null}`.

* `count`: (`number`) Positive integer, the maximum number of returning tokens.
* `includeComments`: (`boolean`) The flag to include comment tokens into the result.
* `filter(token)`: Function which gets a token as the first argument, if the function returns `false` then the result excludes the token.

`rangeOptions` is an object that has 1 property, `includeComments`. Default is `{includeComments: false}`.

* `includeComments`: (`boolean`) The flag to include comment tokens into the result.

There are also some properties you can access:

* `hasBOM`: (`boolean`) The flag to indicate whether the source code has Unicode BOM.
* `text`: (`string`) The full text of the code being linted. Unicode BOM has been stripped from this text.
* `ast`: (`object`) `Program` node of the AST for the code being linted.
* `scopeManager`: [ScopeManager](./scope-manager-interface#scopemanager-interface) object of the code.
* `visitorKeys`: (`object`) Visitor keys to traverse this AST.
* `parserServices`: (`object`) Contains parser-provided services for rules. The default parser does not provide any services. However, if a rule is intended to be used with a custom parser, it could use `parserServices` to access anything provided by that parser. (For example, a TypeScript parser could provide the ability to get the computed type of a given node.)
* `lines`: (`array`) Array of lines, split according to the specification's definition of line breaks.

You should use a `SourceCode` object whenever you need to get more information about the code being linted.

#### Accessing the Source Text

If your rule needs to get the actual JavaScript source to work with, then use the `sourceCode.getText()` method. This method works as follows:

```js

// get all source
var source = sourceCode.getText();

// get source for just this AST node
var nodeSource = sourceCode.getText(node);

// get source for AST node plus previous two characters
var nodeSourceWithPrev = sourceCode.getText(node, 2);

// get source for AST node plus following two characters
var nodeSourceWithFollowing = sourceCode.getText(node, 0, 2);
```

In this way, you can look for patterns in the JavaScript text itself when the AST isn't providing the appropriate data (such as the location of commas, semicolons, parentheses, etc.).

#### Accessing Comments

While comments are not technically part of the AST, ESLint provides the `sourceCode.getAllComments()`, `sourceCode.getCommentsBefore()`, `sourceCode.getCommentsAfter()`, and `sourceCode.getCommentsInside()` to access them.

`sourceCode.getCommentsBefore()`, `sourceCode.getCommentsAfter()`, and `sourceCode.getCommentsInside()` are useful for rules that need to check comments in relation to a given node or token.

Keep in mind that the results of these methods are calculated on demand.

You can also access comments through many of `sourceCode`'s methods using the `includeComments` option.

### Options Schemas

Rules with options must specify a `meta.schema` property, which is a [JSON Schema](https://json-schema.org/) format description of a rule's options which will be used by ESLint to validate configuration options and prevent invalid or unexpected inputs before they are passed to the rule in `context.options`.

If your rule has options, it is strongly recommended that you specify a schema for options validation. However, it is possible to opt-out of options validation by setting `schema: false`, but doing so is discouraged as it increases the chance of bugs and mistakes.

For rules that don't specify a `meta.schema` property, ESLint throws errors when any options are passed. If your rule doesn't have options, do not set `schema: false`, but simply omit the schema property or use `schema: []`, both of which prevent any options from being passed.

When validating a rule's config, there are five steps:

1. If the rule config is not an array, then the value is wrapped into an array (e.g. `"off"` becomes `["off"]`); if the rule config is an array then it is used directly.
2. ESLint validates the first element of the rule config array as a severity (`"off"`, `"warn"`, `"error"`, `0`, `1`, `2`)
3. If the severity is `off` or `0`, then the rule is disabled and validation stops, ignoring any other elements of the rule config array.
4. If the rule is enabled, then any elements of the array after the severity are copied into the `context.options` array (e.g. a config of `["warn", "never", { someOption: 5 }]` results in `context.options = ["never", { someOption: 5 }]`)
5. The rule's schema validation is run on the `context.options` array.

Note: this means that the rule schema cannot validate the severity. The rule schema only validates the array elements _after_ the severity in a rule config. There is no way for a rule to know what severity it is configured at.

There are two formats for a rule's `schema`:

* An array of JSON Schema objects
    * Each element will be checked against the same position in the `context.options` array.
    * If the `context.options` array has fewer elements than there are schemas, then the unmatched schemas are ignored
    * If the `context.options` array has more elements than there are schemas, then the validation fails
    * There are two important consequences to using this format:
        * It is _always valid_ for a user to provide no options to your rule (beyond severity)
        * If you specify an empty array, then it is _always an error_ for a user to provide any options to your rule (beyond severity)
* A full JSON Schema object that will validate the `context.options` array
    * The schema should assume an array of options to validate even if your rule only accepts one option.
    * The schema can be arbitrarily complex, so you can validate completely different sets of potential options via `oneOf`, `anyOf` etc.
    * The supported version of JSON Schemas is [Draft-04](http://json-schema.org/draft-04/schema), so some newer features such as `if` or `$data` are unavailable.
        * At present, it is explicitly planned to not update schema support beyond this level due to ecosystem compatibility concerns. See [this comment](https://github.com/eslint/eslint/issues/13888#issuecomment-872591875) for further context.

For example, the `yoda` rule accepts a primary mode argument of `"always"` or `"never"`, as well as an extra options object with an optional property `exceptRange`:

```js
// Valid configuration:
// "yoda": "warn"
// "yoda": ["error"]
// "yoda": ["error", "always"]
// "yoda": ["error", "never", { "exceptRange": true }]
// Invalid configuration:
// "yoda": ["warn", "never", { "exceptRange": true }, 5]
// "yoda": ["error", { "exceptRange": true }, "never"]
module.exports = {
    meta: {
        schema: [
            {
                enum: ["always", "never"]
            },
            {
                type: "object",
                properties: {
                    exceptRange: { type: "boolean" }
                },
                additionalProperties: false
            }
        ]
    }
};
```

And here is the equivalent object-based schema:

```js
// Valid configuration:
// "yoda": "warn"
// "yoda": ["error"]
// "yoda": ["error", "always"]
// "yoda": ["error", "never", { "exceptRange": true }]
// Invalid configuration:
// "yoda": ["warn", "never", { "exceptRange": true }, 5]
// "yoda": ["error", { "exceptRange": true }, "never"]
module.exports = {
    meta: {
        schema: {
            type: "array",
            minItems: 0,
            maxItems: 2,
            items: [
                {
                    enum: ["always", "never"]
                },
                {
                    type: "object",
                    properties: {
                        exceptRange: { type: "boolean" }
                    },
                    additionalProperties: false
                }
            ]
        }
    }
};
```

Object schemas can be more precise and restrictive in what is permitted. For example, the below schema always requires the first option to be specified (a number between 0 and 10), but the second option is optional, and can either be an object with some options explicitly set, or `"off"` or `"strict"`.

```js
// Valid configuration:
// "someRule": ["error", 6]
// "someRule": ["error", 5, "strict"]
// "someRule": ["warn", 10, { someNonOptionalProperty: true }]
// Invalid configuration:
// "someRule": "warn"
// "someRule": ["error"]
// "someRule": ["warn", 15]
// "someRule": ["warn", 7, { }]
// "someRule": ["error", 3, "on"]
// "someRule": ["warn", 7, { someOtherProperty: 5 }]
// "someRule": ["warn", 7, { someNonOptionalProperty: false, someOtherProperty: 5 }]
module.exports = {
    meta: {
        schema: {
            type: "array",
            minItems: 1, // Can't specify only severity!
            maxItems: 2,
            items: [
                {
                    type: "number",
                    minimum: 0,
                    maximum: 10
                },
                {
                    anyOf: [
                        {
                            type: "object",
                            properties: {
                                someNonOptionalProperty: { type: "boolean" }
                            },
                            required: ["someNonOptionalProperty"],
                            additionalProperties: false
                        },
                        {
                            enum: ["off", "strict"]
                        }
                    ]
                }
            ]
        }
    }
}
```

Remember, rule options are always an array, so be careful not to specify a schema for a non-array type at the top level. If your schema does not specify an array at the top-level, users can _never_ enable your rule, as their configuration will always be invalid when the rule is enabled.

Here's an example schema that will always fail validation:

```js
// Possibly trying to validate ["error", { someOptionalProperty: true }]
// but when the rule is enabled, config will always fail validation because the options are an array which doesn't match "object"
module.exports = {
    meta: {
        schema: {
            type: "object",
            properties: {
                someOptionalProperty: {
                    type: "boolean"
                }
            },
            additionalProperties: false
        }
    }
}
```

**Note:** If your rule schema uses JSON schema [`$ref`](https://json-schema.org/understanding-json-schema/structuring.html#ref) properties, you must use the full JSON Schema object rather than the array of positional property schemas. This is because ESLint transforms the array shorthand into a single schema without updating references that makes them incorrect (they are ignored).

To learn more about JSON Schema, we recommend looking at some examples on the [JSON Schema website](https://json-schema.org/learn/miscellaneous-examples), or reading the free [Understanding JSON Schema](https://json-schema.org/understanding-json-schema/) ebook.

### Accessing Shebangs

[Shebangs (#!)](https://en.wikipedia.org/wiki/Shebang_(Unix)) are represented by the unique tokens of type `"Shebang"`. They are treated as comments and can be accessed by the methods outlined in the [Accessing Comments](#accessing-comments) section, such as `sourceCode.getAllComments()`.

### Accessing Variable Scopes

The `SourceCode#getScope(node)` method returns the scope of the given node. It is a useful method for finding information about the variables in a given scope and how they are used in other scopes.

#### Scope types

The following table contains a list of AST node types and the scope type that they correspond to. For more information about the scope types, refer to the [`Scope` object documentation](./scope-manager-interface#scope-interface).

| AST Node Type             | Scope Type |
|:--------------------------|:-----------|
| `Program`                 | `global`   |
| `FunctionDeclaration`     | `function` |
| `FunctionExpression`      | `function` |
| `ArrowFunctionExpression` | `function` |
| `ClassDeclaration`        | `class`    |
| `ClassExpression`         | `class`    |
| `BlockStatement` ※1      | `block`    |
| `SwitchStatement` ※1     | `switch`   |
| `ForStatement` ※2        | `for`      |
| `ForInStatement` ※2      | `for`      |
| `ForOfStatement` ※2      | `for`      |
| `WithStatement`           | `with`     |
| `CatchClause`             | `catch`    |
| others                    | ※3        |

**※1** Only if the configured parser provided the block-scope feature. The default parser provides the block-scope feature if `parserOptions.ecmaVersion` is not less than `6`.<br>
**※2** Only if the `for` statement defines the iteration variable as a block-scoped variable (E.g., `for (let i = 0;;) {}`).<br>
**※3** The scope of the closest ancestor node which has own scope. If the closest ancestor node has multiple scopes then it chooses the innermost scope (E.g., the `Program` node has a `global` scope and a `module` scope if `Program#sourceType` is `"module"`. The innermost scope is the `module` scope.).

#### Scope Variables

The `Scope#variables` property contains an array of [`Variable` objects](./scope-manager-interface#variable-interface). These are the variables declared in current scope. You can use these `Variable` objects to track references to a variable throughout the entire module.

Inside of each `Variable`, the `Variable#references` property contains an array of [`Reference` objects](./scope-manager-interface#reference-interface). The `Reference` array contains all the locations where the variable is referenced in the module's source code.

Also inside of each `Variable`, the `Variable#defs` property contains an array of [`Definition` objects](./scope-manager-interface#definition-interface). You can use the `Definitions` to find where the variable was defined.

Global variables have the following additional properties:

* `Variable#writeable` (`boolean | undefined`) ... If `true`, this global variable can be assigned arbitrary value. If `false`, this global variable is read-only.
* `Variable#eslintExplicitGlobal` (`boolean | undefined`) ... If `true`, this global variable was defined by a `/* globals */` directive comment in the source code file.
* `Variable#eslintExplicitGlobalComments` (`Comment[] | undefined`) ... The array of `/* globals */` directive comments which defined this global variable in the source code file. This property is `undefined` if there are no `/* globals */` directive comments.
* `Variable#eslintImplicitGlobalSetting` (`"readonly" | "writable" | undefined`) ... The configured value in config files. This can be different from `variable.writeable` if there are `/* globals */` directive comments.

For examples of using `SourceCode#getScope()` to track variables, refer to the source code for the following built-in rules:

* [no-shadow](https://github.com/eslint/eslint/blob/main/lib/rules/no-shadow.js): Calls `sourceCode.getScope()` at the `Program` node and inspects all child scopes to make sure a variable name is not reused at a lower scope. ([no-shadow](../rules/no-shadow) documentation)
* [no-redeclare](https://github.com/eslint/eslint/blob/main/lib/rules/no-redeclare.js): Calls `sourceCode.getScope()` at each scope to make sure that a variable is not declared twice in the same scope. ([no-redeclare](../rules/no-redeclare) documentation)

### Marking Variables as Used

Certain ESLint rules, such as [`no-unused-vars`](../rules/no-unused-vars), check to see if a variable has been used. ESLint itself only knows about the standard rules of variable access and so custom ways of accessing variables may not register as "used".

To help with this, you can use the `sourceCode.markVariableAsUsed()` method. This method takes two arguments: the name of the variable to mark as used and an option reference node indicating the scope in which you are working. Here's an example:

```js
module.exports = {
    create: function(context) {
        var sourceCode = context.sourceCode;

        return {
            ReturnStatement(node) {

                // look in the scope of the function for myCustomVar and mark as used
                sourceCode.markVariableAsUsed("myCustomVar", node);

                // or: look in the global scope for myCustomVar and mark as used
                sourceCode.markVariableAsUsed("myCustomVar");
            }
        }
        // ...
    }
};
```

Here, the `myCustomVar` variable is marked as used relative to a `ReturnStatement` node, which means ESLint will start searching from the scope closest to that node. If you omit the second argument, then the top-level scope is used. (For ESM files, the top-level scope is the module scope; for CommonJS files, the top-level scope is the first function scope.)

### Accessing Code Paths

ESLint analyzes code paths while traversing AST. You can access code path objects with seven events related to code paths. For more information, refer to [Code Path Analysis](code-path-analysis).

### Deprecated `SourceCode` Methods

Please note that the following `SourceCode` methods have been deprecated and will be removed in a future version of ESLint:

* `getTokenOrCommentBefore()`: Replaced by `SourceCode#getTokenBefore()` with the `{ includeComments: true }` option.
* `getTokenOrCommentAfter()`: Replaced by `SourceCode#getTokenAfter()` with the `{ includeComments: true }` option.
* `isSpaceBetweenTokens()`: Replaced by `SourceCode#isSpaceBetween()`
* `getJSDocComment()`

## Rule Unit Tests

ESLint provides the [`RuleTester`](../integrate/nodejs-api#ruletester) utility to make it easy to write tests for rules.

## Rule Naming Conventions

While you can give a custom rule any name you'd like, the core rules have naming conventions. It could be clearer to apply these same naming conventions to your custom rule. To learn more, refer to the [Core Rule Naming Conventions](../contribute/core-rules#rule-naming-conventions) documentation.

## Runtime Rules

The thing that makes ESLint different from other linters is the ability to define custom rules at runtime. This is perfect for rules that are specific to your project or company and wouldn't make sense for ESLint to ship with or be included in a plugin. Just write your rules and include them at runtime.

Runtime rules are written in the same format as all other rules. Create your rule as you would any other and then follow these steps:

1. Place all of your runtime rules in the same directory (e.g., `eslint_rules`).
2. Create a [configuration file](../use/configure/) and specify your rule ID error level under the `rules` key. Your rule will not run unless it has a value of `"warn"` or `"error"` in the configuration file.
3. Run the [command line interface](../use/command-line-interface) using the `--rulesdir` option to specify the location of your runtime rules.

## Profile Rule Performance

ESLint has a built-in method to track the performance of individual rules. Setting the `TIMING` environment variable will trigger the display, upon linting completion, of the ten longest-running rules, along with their individual running time (rule creation + rule execution) and relative performance impact as a percentage of total rule processing time (rule creation + rule execution).

```bash
$ TIMING=1 eslint lib
Rule                    | Time (ms) | Relative
:-----------------------|----------:|--------:
no-multi-spaces         |    52.472 |     6.1%
camelcase               |    48.684 |     5.7%
no-irregular-whitespace |    43.847 |     5.1%
valid-jsdoc             |    40.346 |     4.7%
handle-callback-err     |    39.153 |     4.6%
space-infix-ops         |    35.444 |     4.1%
no-undefined            |    25.693 |     3.0%
no-shadow               |    22.759 |     2.7%
no-empty-class          |    21.976 |     2.6%
semi                    |    19.359 |     2.3%
```

To test one rule explicitly, combine the `--no-eslintrc`, and `--rule` options:

```bash
$ TIMING=1 eslint --no-eslintrc --rule "quotes: [2, 'double']" lib
Rule   | Time (ms) | Relative
:------|----------:|--------:
quotes |    18.066 |   100.0%
```

To see a longer list of results (more than 10), set the environment variable to another value such as `TIMING=50` or `TIMING=all`.

For more granular timing information (per file per rule), use the [`stats`](./stats) option instead.
