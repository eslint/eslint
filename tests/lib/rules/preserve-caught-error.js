/**
 * @fileoverview Rule to preserve caught errors when re-throwing exceptions
 * @author Amnish Singh Arora
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/preserve-caught-error"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("preserve-caught-error", rule, {
	valid: [
		`try {
        throw new Error("Original error");
    } catch (error) {
        throw new Error("Failed to perform error prone operations", { cause: error });
    }`,
		`try {
        doSomething();
    } catch (e) {
        console.error(e);
    }`, // No throw inside catch
		`try {
        doSomething();
    } catch (err) {
        throw new Error("Failed", { cause: err, extra: 42 });
    }`,
		`try {
        doSomething();
    } catch (error) {
        switch (error.code) {
            case "A":
                throw new Error("Type A", { cause: error });
            case "B":
                throw new Error("Type B", { cause: error });
            default:
                throw new Error("Other", { cause: error });
        }
    }`,
	],
	invalid: [
		/* 1. Throws a new Error without cause, even though an error was caught */
		{
			code: `try {
            doSomething();
        } catch (err) {
            throw new Error("Something failed");
        }`,
			errors: [
				{
					messageId: "missingCause",
					suggestions: [
						{
							messageId: "includeCause",
							output: `try {
            doSomething();
        } catch (err) {
            throw new Error("Something failed", { cause: err });
        }`,
						},
					],
				},
			],
		},
		/* 2. Throws a new Error with unrelated cause */
		{
			code: `try {
            doSomething();
        } catch (err) {
            const unrelated = new Error("other");
            throw new Error("Something failed", { cause: unrelated });
        }`,
			errors: [
				{
					messageId: "incorrectCause",
					suggestions: [
						{
							messageId: "includeCause",
							output: `try {
            doSomething();
        } catch (err) {
            const unrelated = new Error("other");
            throw new Error("Something failed", { cause: err });
        }`,
						},
					],
				},
			],
		},
		/* 3. Throws a new Error, cause property is present but misspelled */
		{
			code: `try {
            doSomething();
        } catch (error) {
            throw new Error("Failed", { cuse: error });
        }`,
			errors: [
				{
					messageId: "missingCause",
					suggestions: [
						{
							messageId: "includeCause",
							output: `try {
            doSomething();
        } catch (error) {
            throw new Error("Failed", { cause: error });
        }`,
						},
					],
				},
			],
		},
		/* 4. Throws a new Error, cause property is present but value is a different identifier */
		/*    TODO: This should actually be a valid case since e === err */
		{
			code: `try {
            doSomething();
        } catch (err) {
            const e = err;
            throw new Error("Failed", { cause: e });
        }`,
			errors: [
				{
					messageId: "incorrectCause",
					suggestions: [
						{
							messageId: "includeCause",
							output: `try {
            doSomething();
        } catch (err) {
            const e = err;
            throw new Error("Failed", { cause: err });
        }`,
						},
					],
				},
			],
		},
		/* 5. Throws a new Error, but not using the full caught error as the cause of the symptom error */
		{
			code: `try {
            doSomething();
        } catch (error) {
            throw new Error("Failed", { cause: error.message });
        }`,
			errors: [
				{
					messageId: "incorrectCause",
					suggestions: [
						{
							messageId: "includeCause",
							output: `try {
            doSomething();
        } catch (error) {
            throw new Error("Failed", { cause: error });
        }`,
						},
					],
				},
			],
		},
		/* 6. Throw in a heavily nested catch block */
		{
			code: `try {
            doSomething();
        } catch (error) {
            if (shouldThrow) {
                while (true) {
                    if (Math.random() > 0.5) {
                        throw new Error("Failed without cause");
                    }
                }
            }
        }`,
			errors: [
				{
					messageId: "missingCause",
					suggestions: [
						{
							messageId: "includeCause",
							output: `try {
            doSomething();
        } catch (error) {
            if (shouldThrow) {
                while (true) {
                    if (Math.random() > 0.5) {
                        throw new Error("Failed without cause", { cause: error });
                    }
                }
            }
        }`,
						},
					],
				},
			],
		},
		/* 7. Throw deep inside a switch statement */
		{
			code: `try {
            doSomething();
        } catch (error) {
            switch (error.code) {
                case "A":
                    throw new Error("Type A");
                case "B":
                    throw new Error("Type B", { cause: error });
                default:
                    throw new Error("Other", { cause: error });
            }
        }`,
			errors: [
				{
					messageId: "missingCause",
					suggestions: [
						{
							messageId: "includeCause",
							output: `try {
            doSomething();
        } catch (error) {
            switch (error.code) {
                case "A":
                    throw new Error("Type A", { cause: error });
                case "B":
                    throw new Error("Type B", { cause: error });
                default:
                    throw new Error("Other", { cause: error });
            }
        }`,
						},
					],
				},
			],
		},
		/* 8. Throw statement with a template literal error message */
		{
			code: `try {
            doSomething();
        } catch (error) {
            throw new Error(\`The certificate key "\${chalk.yellow(keyFile)}" is invalid.\n\${err.message}\`);
        }`,
			errors: [
				{
					messageId: "missingCause",
					suggestions: [
						{
							messageId: "includeCause",
							output: `try {
            doSomething();
        } catch (error) {
            throw new Error(\`The certificate key "\${chalk.yellow(keyFile)}" is invalid.\n\${err.message}\`, { cause: error });
        }`,
						},
					],
				},
			],
		},
		/* 9. Throw statement with a variable error message */
		{
			code: `try {
            doSomething();
        } catch (error) {
            const errorMessage = "Operation failed";
            throw new Error(errorMessage);
        }`,
			errors: [
				{
					messageId: "missingCause",
					suggestions: [
						{
							messageId: "includeCause",
							output: `try {
            doSomething();
        } catch (error) {
            const errorMessage = "Operation failed";
            throw new Error(errorMessage, { cause: error });
        }`,
						},
					],
				},
			],
		},
		/* 10. Multiple Throw statements within a single catch block */
		{
			code: `try {
            doSomething();
        } catch (err) {
            if (err.code === "A") {
                throw new Error("Type A");
            }
            throw new TypeError("Fallback error");
        }`,
			// This should have multiple errors
			errors: [
				{
					messageId: "missingCause",
					suggestions: [
						{
							messageId: "includeCause",
							output: `try {
            doSomething();
        } catch (err) {
            if (err.code === "A") {
                throw new Error("Type A", { cause: err });
            }
            throw new TypeError("Fallback error");
        }`,
						},
					],
				},
				{
					messageId: "missingCause",
					suggestions: [
						{
							messageId: "includeCause",
							output: `try {
            doSomething();
        } catch (err) {
            if (err.code === "A") {
                throw new Error("Type A");
            }
            throw new TypeError("Fallback error", { cause: err });
        }`,
						},
					],
				},
			],
		},
		/* 11. When the error being handled is being ignored */
		{
			code: `try {
            doSomething();
        } catch {
            throw new Error("Something went wrong");
        }`,
			errors: [
				{
					messageId: "missingErrorParam",
					type: "CatchClause",
				},
			],
		},
		/* 12. When an Error is created without `new` keyword */
		{
			code: `try {
            doSomething();
        } catch (err) {
            throw Error("Something failed");
        }`,
			errors: [
				{
					messageId: "missingCause",
					suggestions: [
						{
							messageId: "includeCause",
							output: `try {
            doSomething();
        } catch (err) {
            throw Error("Something failed", { cause: err });
        }`,
						},
					],
				},
			],
		},
		/* 13. Miscellaneous constructs */
		{
			code: `try {
        } catch (err) {
            my_label:
            throw new Error("Failed without cause");
        }`,
			errors: [
				{
					messageId: "missingCause",
					suggestions: [
						{
							messageId: "includeCause",
							output: `try {
        } catch (err) {
            my_label:
            throw new Error("Failed without cause", { cause: err });
        }`,
						},
					],
				},
			],
		},
		{
			code: `try {
        } catch (err) {
            {
                throw new Error("Something went wrong");
            }
        }`,
			errors: [
				{
					messageId: "missingCause",
					suggestions: [
						{
							messageId: "includeCause",
							output: `try {
        } catch (err) {
            {
                throw new Error("Something went wrong", { cause: err });
            }
        }`,
						},
					],
				},
			],
		},
		/* 14. When the throw Error constructor has no message argument. */
		{
			code: `try {
        } catch (err) {
            {
                throw new Error();
            }
        }`,
			errors: [
				{
					messageId: "missingCause",
					suggestions: [
						{
							messageId: "includeCause",
							output: `try {
        } catch (err) {
            {
                throw new Error("", { cause: err });
            }
        }`,
						},
					],
				},
			],
		},
		/* 15. AggregateError accepts options as the third argument.  */
		{
			code: `try {
        } catch (err) {
            {
                throw new AggregateError([], "Lorem ipsum");
            }
        }`,
			errors: [
				{
					messageId: "missingCause",
					suggestions: [
						{
							messageId: "includeCause",
							output: `try {
        } catch (err) {
            {
                throw new AggregateError([], "Lorem ipsum", { cause: err });
            }
        }`,
						},
					],
				},
			],
		},
	],
});
