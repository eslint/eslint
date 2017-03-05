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
const errors = [{ message: "Redundant use of `await` on a return value.", type: "Identifier" }];

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2017 } });

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
            errors
        },
        {
            code: "\nasync function foo() {\n\treturn (a, await bar());\n}\n",
            errors
        },
        {
            code: "\nasync function foo() {\n\treturn (a, b, await bar());\n}\n",
            errors
        },
        {
            code: "\nasync function foo() {\n\treturn (a && await bar());\n}\n",
            errors
        },
        {
            code: "\nasync function foo() {\n\treturn (a && b && await bar());\n}\n",
            errors
        },
        {
            code: "\nasync function foo() {\n\treturn (a || await bar());\n}\n",
            errors
        },
        {
            code: "\nasync function foo() {\n\treturn (a, b, (c, d, await bar()));\n}\n",
            errors
        },
        {
            code: "\nasync function foo() {\n\treturn (a, b, (c && await bar()));\n}\n",
            errors
        },
        {
            code: "\nasync function foo() {\n\treturn (await baz(), b, await bar());\n}\n",
            errors
        },
        {
            code: "\nasync function foo() {\n\treturn (baz() ? await bar() : b);\n}\n",
            errors
        },
        {
            code: "\nasync function foo() {\n\treturn (baz() ? a : await bar());\n}\n",
            errors
        },
        {
            code: "\nasync function foo() {\n\treturn (baz() ? (a, await bar()) : b);\n}\n",
            errors
        },
        {
            code: "\nasync function foo() {\n\treturn (baz() ? a : (b, await bar()));\n}\n",
            errors
        },
        {
            code: "\nasync function foo() {\n\treturn (baz() ? (a && await bar()) : b);\n}\n",
            errors
        },
        {
            code: "\nasync function foo() {\n\treturn (baz() ? a : (b && await bar()));\n}\n",
            errors
        },
        {
            code: "\nasync () => { return await bar(); }\n",
            errors
        },
        {
            code: "\nasync () => await bar()\n",
            errors
        },
        {
            code: "\nasync () => (a, b, await bar())\n",
            errors
        },
        {
            code: "\nasync () => (a && await bar())\n",
            errors
        },
        {
            code: "\nasync () => (baz() ? await bar() : b)\n",
            errors
        },
        {
            code: "\nasync () => (baz() ? a : (b, await bar()))\n",
            errors
        },
        {
            code: "\nasync () => (baz() ? a : (b && await bar()))\n",
            errors
        },
        {
            code: "\nasync function foo() {\nif (a) {\n\t\tif (b) {\n\t\t\treturn await bar();\n\t\t}\n\t}\n}\n",
            errors
        },
        {
            code: "\nasync () => {\nif (a) {\n\t\tif (b) {\n\t\t\treturn await bar();\n\t\t}\n\t}\n}\n",
            errors
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
