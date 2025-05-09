/**
 * @fileoverview Tests for no-fallthrough rule.
 * @author Matt DuVall<http://mattduvall.com/>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-fallthrough"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const errorsDefault = [
	{
		messageId: "default",
		type: "SwitchCase",
	},
];

const ruleTester = new RuleTester();

ruleTester.run("no-fallthrough", rule, {
	valid: [
		"switch(foo) { case 0: a(); /* falls through */ case 1: b(); }",
		"switch(foo) { case 0: a()\n /* falls through */ case 1: b(); }",
		"switch(foo) { case 0: a(); /* fall through */ case 1: b(); }",
		"switch(foo) { case 0: a(); /* fallthrough */ case 1: b(); }",
		"switch(foo) { case 0: a(); /* FALLS THROUGH */ case 1: b(); }",
		"switch(foo) { case 0: { a(); /* falls through */ } case 1: b(); }",
		"switch(foo) { case 0: { a()\n /* falls through */ } case 1: b(); }",
		"switch(foo) { case 0: { a(); /* fall through */ } case 1: b(); }",
		"switch(foo) { case 0: { a(); /* fallthrough */ } case 1: b(); }",
		"switch(foo) { case 0: { a(); /* FALLS THROUGH */ } case 1: b(); }",
		"switch(foo) { case 0: { a(); } /* falls through */ case 1: b(); }",
		"switch(foo) { case 0: { a(); /* falls through */ } /* comment */ case 1: b(); }",
		"switch(foo) { case 0: { /* falls through */ } case 1: b(); }",
		"function foo() { switch(foo) { case 0: a(); return; case 1: b(); }; }",
		"switch(foo) { case 0: a(); throw 'foo'; case 1: b(); }",
		"while (a) { switch(foo) { case 0: a(); continue; case 1: b(); } }",
		"switch(foo) { case 0: a(); break; case 1: b(); }",
		"switch(foo) { case 0: case 1: a(); break; case 2: b(); }",
		"switch(foo) { case 0: case 1: break; case 2: b(); }",
		"switch(foo) { case 0: case 1: break; default: b(); }",
		"switch(foo) { case 0: case 1: a(); }",
		"switch(foo) { case 0: case 1: a(); break; }",
		"switch(foo) { case 0: case 1: break; }",
		"switch(foo) { case 0:\n case 1: break; }",
		"switch(foo) { case 0: // comment\n case 1: break; }",
		"function foo() { switch(foo) { case 0: case 1: return; } }",
		"function foo() { switch(foo) { case 0: {return;}\n case 1: {return;} } }",
		"switch(foo) { case 0: case 1: {break;} }",
		"switch(foo) { }",
		"switch(foo) { case 0: switch(bar) { case 2: break; } /* falls through */ case 1: break; }",
		"function foo() { switch(foo) { case 1: return a; a++; }}",
		"switch (foo) { case 0: a(); /* falls through */ default:  b(); /* comment */ }",
		"switch (foo) { case 0: a(); /* falls through */ default: /* comment */ b(); }",
		"switch (foo) { case 0: if (a) { break; } else { throw 0; } default: b(); }",
		"switch (foo) { case 0: try { break; } finally {} default: b(); }",
		"switch (foo) { case 0: try {} finally { break; } default: b(); }",
		"switch (foo) { case 0: try { throw 0; } catch (err) { break; } default: b(); }",
		"switch (foo) { case 0: do { throw 0; } while(a); default: b(); }",
		"switch (foo) { case 0: a(); \n// eslint-disable-next-line rule-to-test/no-fallthrough\n case 1: }",
		`
            switch (foo) {
                case 0:
                    a();
                    break;
                    /* falls through */
                case 1:
                    b();
            }
        `,
		`
            switch (foo) {
                case 0:
                    a();
                    break;
                    // eslint-disable-next-line rule-to-test/no-fallthrough
                    /* falls through */
                case 1:
                    b();
            }
        `,
		{
			code: "switch(foo) { case 0: a(); /* no break */ case 1: b(); }",
			options: [
				{
					commentPattern: "no break",
				},
			],
		},
		{
			code: "switch(foo) { case 0: a(); /* no break: need to execute b() */ case 1: b(); }",
			options: [
				{
					commentPattern: "no break:\\s?\\w+",
				},
			],
		},
		{
			code: "switch(foo) { case 0: a();\n// need to execute b(), so\n// falling through\n case 1: b(); }",
			options: [
				{
					commentPattern: "falling through",
				},
			],
		},
		{
			code: "switch(foo) { case 0: a(); /* break omitted */ default:  b(); /* comment */ }",
			options: [
				{
					commentPattern: "break omitted",
				},
			],
		},
		{
			code: "switch(foo) { case 0: a(); /* caution: break is omitted intentionally */ case 1: b(); /* break omitted */ default: c(); }",
			options: [
				{
					commentPattern: "break[\\s\\w]+omitted",
				},
			],
		},
		{
			code: "switch(foo) { case 0: \n\n\n case 1: b(); }",
			options: [{ allowEmptyCase: true }],
		},
		{
			code: "switch(foo) { case 0: \n /* with comments */  \n case 1: b(); }",
			options: [{ allowEmptyCase: true }],
		},
		{
			code: "switch (a) {\n case 1: ; break; \n case 3: }",
			options: [{ allowEmptyCase: true }],
		},
		{
			code: "switch (a) {\n case 1: ; break; \n case 3: }",
			options: [{ allowEmptyCase: false }],
		},
		`
switch (foo) {
    case 0:
        a();
}
switch (bar) {
    case 1:
        b();
}
            `,
		{
			code: `
switch (foo) {
    case 0:
        a();
        break;
        // falls through
}
switch (bar) {
    case 1:
        b();
}
            `,
			options: [{ reportUnusedFallthroughComment: true }],
		},
		{
			code: `
switch (foo) {
    case 0:
        a();
        break;
        /* falls through */
}
switch (bar) {
    case 1:
        b();
}
            `,
			options: [{ reportUnusedFallthroughComment: true }],
		},
		{
			code: `
switch(foo){
    case 1:
        doSomething();
        break;
    // just a comment
    case 2: doSomething();
}
          `,
			options: [{ reportUnusedFallthroughComment: true }],
		},
		{
			code: `
switch(foo){
    case 1:
        doSomething();
        break;
}

function f() {
    switch(foo){
        // falls through comment should not false positive
        case 1:
            if (a) {
                throw new Error();
            } else if (b) {
                break;
            } else {
                return;
            }
        case 2:
            break;
    }
}
            `,
			options: [{ reportUnusedFallthroughComment: true }],
		},
		{
			code: `
switch(foo){
    case 1:
        doSomething();
        break;
}

function f() {
    switch(foo){
        /* falls through comment should not false positive */
        case 1:
            if (a) {
                throw new Error();
            } else if (b) {
                break;
            } else {
                return;
            }
        case 2:
            break;
    }
}
            `,
			options: [{ reportUnusedFallthroughComment: true }],
		},
		{
			code: `
switch(foo){
    case 1:
        doSomething();
        // falls through
    case 2: doSomething();
}
          `,
			options: [{ reportUnusedFallthroughComment: true }],
		},
	],

	invalid: [
		{
			code: "switch(foo) { case 0: a();\ncase 1: b() }",
			errors: [
				{
					messageId: "case",
					type: "SwitchCase",
					line: 2,
					column: 1,
				},
			],
		},
		{
			code: "switch(foo) { case 0: a();\ndefault: b() }",
			errors: [
				{
					messageId: "default",
					type: "SwitchCase",
					line: 2,
					column: 1,
				},
			],
		},
		{
			code: "switch(foo) { case 0: a(); default: b() }",
			errors: errorsDefault,
		},
		{
			code: "switch(foo) { case 0: if (a) { break; } default: b() }",
			errors: errorsDefault,
		},
		{
			code: "switch(foo) { case 0: try { throw 0; } catch (err) {} default: b() }",
			errors: errorsDefault,
		},
		{
			code: "switch(foo) { case 0: while (a) { break; } default: b() }",
			errors: errorsDefault,
		},
		{
			code: "switch(foo) { case 0: do { break; } while (a); default: b() }",
			errors: errorsDefault,
		},
		{
			code: "switch(foo) { case 0:\n\n default: b() }",
			errors: errorsDefault,
		},
		{
			code: "switch(foo) { case 0: {} default: b() }",
			errors: errorsDefault,
		},
		{
			code: "switch(foo) { case 0: a(); { /* falls through */ } default: b() }",
			errors: errorsDefault,
		},
		{
			code: "switch(foo) { case 0: { /* falls through */ } a(); default: b() }",
			errors: errorsDefault,
		},
		{
			code: "switch(foo) { case 0: if (a) { /* falls through */ } default: b() }",
			errors: errorsDefault,
		},
		{
			code: "switch(foo) { case 0: { { /* falls through */ } } default: b() }",
			errors: errorsDefault,
		},
		{
			code: "switch(foo) { case 0: { /* comment */ } default: b() }",
			errors: errorsDefault,
		},
		{
			code: "switch(foo) { case 0:\n // comment\n default: b() }",
			errors: errorsDefault,
		},
		{
			code: "switch(foo) { case 0: a(); /* falling through */ default: b() }",
			errors: errorsDefault,
		},
		{
			code: "switch(foo) { case 0: a();\n/* no break */\ncase 1: b(); }",
			options: [
				{
					commentPattern: "break omitted",
				},
			],
			errors: [
				{
					messageId: "case",
					type: "SwitchCase",
					line: 3,
					column: 1,
				},
			],
		},
		{
			code: "switch(foo) { case 0: a();\n/* no break */\n/* todo: fix readability */\ndefault: b() }",
			options: [
				{
					commentPattern: "no break",
				},
			],
			errors: [
				{
					messageId: "default",
					type: "SwitchCase",
					line: 4,
					column: 1,
				},
			],
		},
		{
			code: "switch(foo) { case 0: { a();\n/* no break */\n/* todo: fix readability */ }\ndefault: b() }",
			options: [
				{
					commentPattern: "no break",
				},
			],
			errors: [
				{
					messageId: "default",
					type: "SwitchCase",
					line: 4,
					column: 1,
				},
			],
		},
		{
			code: "switch(foo) { case 0: \n /* with comments */  \ncase 1: b(); }",
			errors: [
				{
					messageId: "case",
					type: "SwitchCase",
					line: 3,
					column: 1,
				},
			],
		},
		{
			code: "switch(foo) { case 0:\n\ncase 1: b(); }",
			options: [
				{
					allowEmptyCase: false,
				},
			],
			errors: [
				{
					messageId: "case",
					type: "SwitchCase",
					line: 3,
					column: 1,
				},
			],
		},
		{
			code: "switch(foo) { case 0:\n\ncase 1: b(); }",
			options: [{}],
			errors: [
				{
					messageId: "case",
					type: "SwitchCase",
					line: 3,
					column: 1,
				},
			],
		},
		{
			code: "switch (a) { case 1: \n ; case 2:  }",
			options: [{ allowEmptyCase: false }],
			errors: [
				{
					messageId: "case",
					type: "SwitchCase",
					line: 2,
					column: 4,
				},
			],
		},
		{
			code: "switch (a) { case 1: ; case 2: ; case 3: }",
			options: [{ allowEmptyCase: true }],
			errors: [
				{
					messageId: "case",
					type: "SwitchCase",
					line: 1,
					column: 24,
				},
				{
					messageId: "case",
					type: "SwitchCase",
					line: 1,
					column: 34,
				},
			],
		},
		{
			code: "switch (foo) { case 0: a(); \n// eslint-enable no-fallthrough\n case 1: }",
			options: [{}],
			errors: [
				{
					messageId: "case",
					type: "SwitchCase",
					line: 3,
					column: 2,
				},
			],
		},
		{
			code: `
switch (foo) {
    case 0:
        a();
        break;
    /* falls through */
    case 1:
        b();
}`,
			options: [{ reportUnusedFallthroughComment: true }],
			errors: [
				{
					line: 6,
					messageId: "unusedFallthroughComment",
				},
			],
		},
		{
			code: `
switch (foo) {
    default:
        a();
        break;
    /* falls through */
    case 1:
        b();
}`,
			options: [{ reportUnusedFallthroughComment: true }],
			errors: [
				{
					line: 6,
					messageId: "unusedFallthroughComment",
				},
			],
		},
		{
			code: `
switch(foo){
    case 1:
        doSomething();
        break;
    // falls through
    case 2: doSomething();
}`,
			options: [{ reportUnusedFallthroughComment: true }],
			errors: [
				{
					line: 6,
					messageId: "unusedFallthroughComment",
				},
			],
		},
		{
			code: `
function f() {
    switch(foo){
        case 1:
            if (a) {
                throw new Error();
            } else if (b) {
                break;
            } else {
                return;
            }
        // falls through
        case 2:
            break;
    }
}`,
			options: [{ reportUnusedFallthroughComment: true }],
			errors: [
				{
					line: 12,
					messageId: "unusedFallthroughComment",
				},
			],
		},
		{
			code: `
switch (foo) {
    case 0: {
        a();
        break;
        // falls through
    }
    case 1:
        b();
}`,
			options: [{ reportUnusedFallthroughComment: true }],
			errors: [
				{
					line: 6,
					messageId: "unusedFallthroughComment",
				},
			],
		},
	],
});
