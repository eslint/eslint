/**
 * @fileoverview Disallows unnecessary `return await`
 * @author Jordan Harband
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-return-await");
const RuleTester = require("../../../lib/rule-tester/flat-rule-tester");


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

/**
 * Creates the list of errors that should be found by this rule
 * @param {Object} options Options for creating errors
 * @param {string} options.suggestionOutput The suggested output
 * @returns {Array} the list of errors
 */
function createErrorList({ suggestionOutput: output } = {}) {

    // pending https://github.com/eslint/espree/issues/304, the type should be "Keyword"
    return [{
        messageId: "redundantUseOfAwait",
        type: "Identifier",
        suggestions: output ? [{
            messageId: "removeAwait", output
        }] : []
    }];
}


const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 2017 } });

ruleTester.run("no-return-await", rule, {

    valid: [
        "\nasync function foo() {\n\tawait bar(); return;\n}\n",
        "\nasync function foo() {\n\tconst x = await bar(); return x;\n}\n",
        "\nasync () => { return bar(); }\n",
        "\nasync () => bar()\n",
        "\nasync function foo() {\nif (a) {\n\t\tif (b) {\n\t\t\treturn bar();\n\t\t}\n\t}\n}\n",
        "\nasync () => {\nif (a) {\n\t\tif (b) {\n\t\t\treturn bar();\n\t\t}\n\t}\n}\n",
        "\nasync function foo() {\n\treturn (await bar() && a);\n}\n",
        "\nasync function foo() {\n\treturn (await bar() || a);\n}\n",
        "\nasync function foo() {\n\treturn (a && await baz() && b);\n}\n",
        "\nasync function foo() {\n\treturn (await bar(), a);\n}\n",
        "\nasync function foo() {\n\treturn (await baz(), await bar(), a);\n}\n",
        "\nasync function foo() {\n\treturn (a, b, (await bar(), c));\n}\n",
        "\nasync function foo() {\n\treturn (await bar() ? a : b);\n}\n",
        "\nasync function foo() {\n\treturn ((a && await bar()) ? b : c);\n}\n",
        "\nasync function foo() {\n\treturn (baz() ? (await bar(), a) : b);\n}\n",
        "\nasync function foo() {\n\treturn (baz() ? (await bar() && a) : b);\n}\n",
        "\nasync function foo() {\n\treturn (baz() ? a : (await bar(), b));\n}\n",
        "\nasync function foo() {\n\treturn (baz() ? a : (await bar() && b));\n}\n",
        "\nasync () => (await bar(), a)\n",
        "\nasync () => (await bar() && a)\n",
        "\nasync () => (await bar() || a)\n",
        "\nasync () => (a && await bar() && b)\n",
        "\nasync () => (await baz(), await bar(), a)\n",
        "\nasync () => (a, b, (await bar(), c))\n",
        "\nasync () => (await bar() ? a : b)\n",
        "\nasync () => ((a && await bar()) ? b : c)\n",
        "\nasync () => (baz() ? (await bar(), a) : b)\n",
        "\nasync () => (baz() ? (await bar() && a) : b)\n",
        "\nasync () => (baz() ? a : (await bar(), b))\n",
        "\nasync () => (baz() ? a : (await bar() && b))\n",
        `
          async function foo() {
            try {
              return await bar();
            } catch (e) {
              baz();
            }
          }
        `,
        `
          async function foo() {
            try {
              return await bar();
            } finally {
              baz();
            }
          }
        `,
        `
          async function foo() {
            try {}
            catch (e) {
              return await bar();
            } finally {
              baz();
            }
          }
        `,
        `
          async function foo() {
            try {
              try {}
              finally {
                return await bar();
              }
            } finally {
              baz();
            }
          }
        `,
        `
          async function foo() {
            try {
              try {}
              catch (e) {
                return await bar();
              }
            } finally {
              baz();
            }
          }
        `,
        `
          async function foo() {
            try {
              return (a, await bar());
            } catch (e) {
              baz();
            }
          }
        `,
        `
          async function foo() {
            try {
              return (qux() ? await bar() : b);
            } catch (e) {
              baz();
            }
          }
        `,
        `
          async function foo() {
            try {
              return (a && await bar());
            } catch (e) {
              baz();
            }
          }
        `
    ],

    invalid: [
        {
            code: "\nasync function foo() {\n\treturn await bar();\n}\n",
            errors: createErrorList({ suggestionOutput: "\nasync function foo() {\n\treturn bar();\n}\n" })
        },
        {
            code: "\nasync function foo() {\n\treturn await(bar());\n}\n",
            errors: createErrorList({ suggestionOutput: "\nasync function foo() {\n\treturn (bar());\n}\n" })
        },
        {
            code: "\nasync function foo() {\n\treturn (a, await bar());\n}\n",
            errors: createErrorList({ suggestionOutput: "\nasync function foo() {\n\treturn (a, bar());\n}\n" })
        },
        {
            code: "\nasync function foo() {\n\treturn (a, b, await bar());\n}\n",
            errors: createErrorList({ suggestionOutput: "\nasync function foo() {\n\treturn (a, b, bar());\n}\n" })
        },
        {
            code: "\nasync function foo() {\n\treturn (a && await bar());\n}\n",
            errors: createErrorList({ suggestionOutput: "\nasync function foo() {\n\treturn (a && bar());\n}\n" })
        },
        {
            code: "\nasync function foo() {\n\treturn (a && b && await bar());\n}\n",
            errors: createErrorList({ suggestionOutput: "\nasync function foo() {\n\treturn (a && b && bar());\n}\n" })
        },
        {
            code: "\nasync function foo() {\n\treturn (a || await bar());\n}\n",
            errors: createErrorList({ suggestionOutput: "\nasync function foo() {\n\treturn (a || bar());\n}\n" })
        },
        {
            code: "\nasync function foo() {\n\treturn (a, b, (c, d, await bar()));\n}\n",
            errors: createErrorList({ suggestionOutput: "\nasync function foo() {\n\treturn (a, b, (c, d, bar()));\n}\n" })
        },
        {
            code: "\nasync function foo() {\n\treturn (a, b, (c && await bar()));\n}\n",
            errors: createErrorList({ suggestionOutput: "\nasync function foo() {\n\treturn (a, b, (c && bar()));\n}\n" })
        },
        {
            code: "\nasync function foo() {\n\treturn (await baz(), b, await bar());\n}\n",
            errors: createErrorList({ suggestionOutput: "\nasync function foo() {\n\treturn (await baz(), b, bar());\n}\n" })
        },
        {
            code: "\nasync function foo() {\n\treturn (baz() ? await bar() : b);\n}\n",
            errors: createErrorList({ suggestionOutput: "\nasync function foo() {\n\treturn (baz() ? bar() : b);\n}\n" })
        },
        {
            code: "\nasync function foo() {\n\treturn (baz() ? a : await bar());\n}\n",
            errors: createErrorList({ suggestionOutput: "\nasync function foo() {\n\treturn (baz() ? a : bar());\n}\n" })
        },
        {
            code: "\nasync function foo() {\n\treturn (baz() ? (a, await bar()) : b);\n}\n",
            errors: createErrorList({ suggestionOutput: "\nasync function foo() {\n\treturn (baz() ? (a, bar()) : b);\n}\n" })
        },
        {
            code: "\nasync function foo() {\n\treturn (baz() ? a : (b, await bar()));\n}\n",
            errors: createErrorList({ suggestionOutput: "\nasync function foo() {\n\treturn (baz() ? a : (b, bar()));\n}\n" })
        },
        {
            code: "\nasync function foo() {\n\treturn (baz() ? (a && await bar()) : b);\n}\n",
            errors: createErrorList({ suggestionOutput: "\nasync function foo() {\n\treturn (baz() ? (a && bar()) : b);\n}\n" })
        },
        {
            code: "\nasync function foo() {\n\treturn (baz() ? a : (b && await bar()));\n}\n",
            errors: createErrorList({ suggestionOutput: "\nasync function foo() {\n\treturn (baz() ? a : (b && bar()));\n}\n" })
        },
        {
            code: "\nasync () => { return await bar(); }\n",
            errors: createErrorList({ suggestionOutput: "\nasync () => { return bar(); }\n" })
        },
        {
            code: "\nasync () => await bar()\n",
            errors: createErrorList({ suggestionOutput: "\nasync () => bar()\n" })
        },
        {
            code: "\nasync () => (a, b, await bar())\n",
            errors: createErrorList({ suggestionOutput: "\nasync () => (a, b, bar())\n" })
        },
        {
            code: "\nasync () => (a && await bar())\n",
            errors: createErrorList({ suggestionOutput: "\nasync () => (a && bar())\n" })
        },
        {
            code: "\nasync () => (baz() ? await bar() : b)\n",
            errors: createErrorList({ suggestionOutput: "\nasync () => (baz() ? bar() : b)\n" })
        },
        {
            code: "\nasync () => (baz() ? a : (b, await bar()))\n",
            errors: createErrorList({ suggestionOutput: "\nasync () => (baz() ? a : (b, bar()))\n" })
        },
        {
            code: "\nasync () => (baz() ? a : (b && await bar()))\n",
            errors: createErrorList({ suggestionOutput: "\nasync () => (baz() ? a : (b && bar()))\n" })
        },
        {
            code: "\nasync function foo() {\nif (a) {\n\t\tif (b) {\n\t\t\treturn await bar();\n\t\t}\n\t}\n}\n",
            errors: createErrorList({ suggestionOutput: "\nasync function foo() {\nif (a) {\n\t\tif (b) {\n\t\t\treturn bar();\n\t\t}\n\t}\n}\n" })
        },
        {
            code: "\nasync () => {\nif (a) {\n\t\tif (b) {\n\t\t\treturn await bar();\n\t\t}\n\t}\n}\n",
            errors: createErrorList({ suggestionOutput: "\nasync () => {\nif (a) {\n\t\tif (b) {\n\t\t\treturn bar();\n\t\t}\n\t}\n}\n" })
        },
        {
            code: `
              async function foo() {
                try {}
                finally {
                  return await bar();
                }
              }
            `,
            errors: createErrorList({
                suggestionOutput: `
              async function foo() {
                try {}
                finally {
                  return bar();
                }
              }
            `
            })
        },
        {
            code: `
              async function foo() {
                try {}
                catch (e) {
                  return await bar();
                }
              }
            `,
            errors: createErrorList({
                suggestionOutput: `
              async function foo() {
                try {}
                catch (e) {
                  return bar();
                }
              }
            `
            })
        },
        {
            code: `
              try {
                async function foo() {
                  return await bar();
                }
              } catch (e) {}
            `,
            errors: createErrorList({
                suggestionOutput: `
              try {
                async function foo() {
                  return bar();
                }
              } catch (e) {}
            `
            })
        },
        {
            code: `
              try {
                async () => await bar();
              } catch (e) {}
            `,
            errors: createErrorList({
                suggestionOutput: `
              try {
                async () => bar();
              } catch (e) {}
            `
            })
        },
        {
            code: `
              async function foo() {
                try {}
                catch (e) {
                  try {}
                  catch (e) {
                    return await bar();
                  }
                }
              }
            `,
            errors: createErrorList({
                suggestionOutput: `
              async function foo() {
                try {}
                catch (e) {
                  try {}
                  catch (e) {
                    return bar();
                  }
                }
              }
            `
            })
        },
        {
            code: `
              async function foo() {
                return await new Promise(resolve => {
                  resolve(5);
                });
              }
            `,
            errors: createErrorList({
                suggestionOutput: `
              async function foo() {
                return new Promise(resolve => {
                  resolve(5);
                });
              }
            `
            })
        },
        {
            code: `
              async () => {
                return await (
                  foo()
                )
              };
            `,
            errors: createErrorList({
                suggestionOutput: `
              async () => {
                return (
                  foo()
                )
              };
            `
            })
        },
        {
            code: `
              async function foo() {
                return await // Test
                  5;
              }
            `,
            errors: createErrorList()
        }
    ]
});
