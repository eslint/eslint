/**
 * @fileoverview Disallows unnecessary `return await`
 * @author Jordan Harband
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-return-await");
const RuleTester = require("../../../lib/testers/rule-tester");


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

// pending https://github.com/eslint/espree/issues/304, the type should be "Keyword"
const errors = [{ message: "Redundant use of `await` on a return value.", type: "Identifier"}];

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2017 } });

ruleTester.run("no-return-await", rule, {

    valid: [
        "\nasync function foo() {\n\tawait bar(); return;\n}\n",
        "\nasync function foo() {\n\tconst x = await bar(); return x;\n}\n",
        "\nasync () => { return bar(); }\n",
        "\nasync () => bar()\n",
        "\nasync function foo() {\nif (a) {\n\t\tif (b) {\n\t\t\treturn bar();\n\t\t}\n\t}\n}\n",
        "\nasync () => {\nif (a) {\n\t\tif (b) {\n\t\t\treturn bar();\n\t\t}\n\t}\n}\n",
        "\nasync function foo() {\n\treturn (await bar(), 0);\n}\n",
        "\nasync function foo() {\n\treturn (await baz(), await bar(), 0);\n}\n",
        "\nasync function foo() {\n\treturn (0, 1, (await bar(), 2));\n}\n",
        "\nasync function foo() {\n\treturn (await bar() ? 0 : 1);\n}\n",
        "\nasync function foo() {\n\treturn (baz() ? (await bar(), 0) : 1);\n}\n",
        "\nasync function foo() {\n\treturn (baz() ? 0 : (await bar(), 1));\n}\n",
        "\nasync () => (await bar(), 0)\n",
        "\nasync () => (await baz(), await bar(), 0)\n",
        "\nasync () => (0, 1, (await bar(), 2))\n",
        "\nasync () => (await bar() ? 0 : 1)\n",
        "\nasync () => (baz() ? (await bar(), 0) : 1)\n",
        "\nasync () => (baz() ? 0 : (await bar(), 1))\n",
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
              return (0, await bar());
            } catch (e) {
              baz();
            }
          }
        `,
        `
          async function foo() {
            try {
              return (qux() ? await bar() : 1);
            } catch (e) {
              baz();
            }
          }
        `,
    ],

    invalid: [
        {
            code: "\nasync function foo() {\n\treturn await bar();\n}\n",
            errors,
        },
        {
            code: "\nasync function foo() {\n\treturn (0, await bar());\n}\n",
            errors,
        },
        {
            code: "\nasync function foo() {\n\treturn (0, 1, await bar());\n}\n",
            errors,
        },
        {
            code: "\nasync function foo() {\n\treturn (0, 1, (2, 3, await bar()));\n}\n",
            errors,
        },
        {
            code: "\nasync function foo() {\n\treturn (await baz(), 1, await bar());\n}\n",
            errors,
        },
        {
            code: "\nasync function foo() {\n\treturn (baz() ? await bar() : 1);\n}\n",
            errors,
        },
        {
            code: "\nasync function foo() {\n\treturn (baz() ? 0 : await bar());\n}\n",
            errors,
        },
        {
            code: "\nasync function foo() {\n\treturn (baz() ? (0, await bar()) : 1);\n}\n",
            errors,
        },
        {
            code: "\nasync function foo() {\n\treturn (baz() ? 0 : (1, await bar()));\n}\n",
            errors,
        },
        {
            code: "\nasync () => { return await bar(); }\n",
            errors,
        },
        {
            code: "\nasync () => await bar()\n",
            errors,
        },
        {
            code: "\nasync () => (0, 1, await bar())\n",
            errors,
        },
        {
            code: "\nasync () => (baz() ? await bar() : 1)\n",
            errors,
        },
        {
            code: "\nasync () => (baz() ? 0 : (1, await bar()))\n",
            errors,
        },
        {
            code: "\nasync function foo() {\nif (a) {\n\t\tif (b) {\n\t\t\treturn await bar();\n\t\t}\n\t}\n}\n",
            errors,
        },
        {
            code: "\nasync () => {\nif (a) {\n\t\tif (b) {\n\t\t\treturn await bar();\n\t\t}\n\t}\n}\n",
            errors,
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
            errors
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
            errors
        },
        {
            code: `
              try {
                async function foo() {
                  return await bar();
                }
              } catch (e) {}
            `,
            errors
        },
        {
            code: `
              try {
                async () => await bar();
              } catch (e) {}
            `,
            errors
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
            errors
        }
    ]
});
