/**
 * @fileoverview Tests for no-empty rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-empty"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-empty", rule, {
    valid: [
        "if (foo) { bar() }",
        "while (foo) { bar() }",
        "for (;foo;) { bar() }",
        "try { foo() } catch (ex) { foo() }",
        "switch(foo) {case 'foo': break;}",
        "(function() { }())",
        { code: "var foo = () => {};", parserOptions: { ecmaVersion: 6 } },
        "function foo() { }",
        "if (foo) {/* empty */}",
        "while (foo) {/* empty */}",
        "for (;foo;) {/* empty */}",
        "try { foo() } catch (ex) {/* empty */}",
        "try { foo() } catch (ex) {// empty\n}",
        "try { foo() } finally {// empty\n}",
        "try { foo() } finally {// test\n}",
        "try { foo() } finally {\n \n // hi i am off no use\n}",
        "try { foo() } catch (ex) {/* test111 */}",
        "if (foo) { bar() } else { // nothing in me \n}",
        "if (foo) { bar() } else { /**/ \n}",
        "if (foo) { bar() } else { // \n}",
        { code: "try { foo(); } catch (ex) {}", options: [{ allowEmptyCatch: true }] },
        { code: "try { foo(); } catch (ex) {} finally { bar(); }", options: [{ allowEmptyCatch: true }] }
    ],
    invalid: [
        { code: "try {} catch (ex) {throw ex}", errors: [{ messageId: "unexpected", data: { type: "block" }, type: "BlockStatement" }] },
        { code: "try { foo() } catch (ex) {}", errors: [{ messageId: "unexpected", data: { type: "block" }, type: "BlockStatement" }] },
        { code: "try { foo() } catch (ex) {throw ex} finally {}", errors: [{ messageId: "unexpected", data: { type: "block" }, type: "BlockStatement" }] },
        { code: "if (foo) {}", errors: [{ messageId: "unexpected", data: { type: "block" }, type: "BlockStatement" }] },
        { code: "while (foo) {}", errors: [{ messageId: "unexpected", data: { type: "block" }, type: "BlockStatement" }] },
        { code: "for (;foo;) {}", errors: [{ messageId: "unexpected", data: { type: "block" }, type: "BlockStatement" }] },
        { code: "switch(foo) {}", errors: [{ messageId: "unexpected", data: { type: "switch" }, type: "SwitchStatement" }] },
        {
            code: "try {} catch (ex) {}",
            options: [{ allowEmptyCatch: true }],
            errors: [{ messageId: "unexpected", data: { type: "block" }, type: "BlockStatement" }]
        },
        {
            code: "try { foo(); } catch (ex) {} finally {}",
            options: [{ allowEmptyCatch: true }],
            errors: [{ messageId: "unexpected", data: { type: "block" }, type: "BlockStatement" }]
        },
        {
            code: "try {} catch (ex) {} finally {}",
            options: [{ allowEmptyCatch: true }],
            errors: [
                { messageId: "unexpected", data: { type: "block" }, type: "BlockStatement" },
                { messageId: "unexpected", data: { type: "block" }, type: "BlockStatement" }
            ]
        },
        {
            code: "try { foo(); } catch (ex) {} finally {}",
            errors: [
                { messageId: "unexpected", data: { type: "block" }, type: "BlockStatement" },
                { messageId: "unexpected", data: { type: "block" }, type: "BlockStatement" }
            ]
        }
    ]
});
