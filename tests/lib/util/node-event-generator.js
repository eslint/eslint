/**
 * @fileoverview Tests for NodeEventGenerator.
 * @author Toru Nagashima
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("assert"),
    EventEmitter = require("events").EventEmitter,
    sinon = require("sinon"),
    espree = require("espree"),
    estraverse = require("estraverse"),
    EventGeneratorTester = require("../../../lib/testers/event-generator-tester"),
    NodeEventGenerator = require("../../../lib/util/node-event-generator");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ESPREE_CONFIG = {
    ecmaVersion: 6,
    comment: true,
    tokens: true,
    range: true,
    loc: true
};

describe("NodeEventGenerator", () => {
    EventGeneratorTester.testEventGeneratorInterface(
        new NodeEventGenerator(new EventEmitter(), new Set())
    );

    describe("entering a single AST node", () => {
        let emitter, generator;

        beforeEach(() => {
            emitter = new EventEmitter();
            emitter.emit = sinon.spy(emitter.emit);
            generator = new NodeEventGenerator(emitter, ["Foo", "Bar", "Foo > Bar", "Foo:exit"]);
        });

        it("should generate events for entering AST node.", () => {
            const dummyNode = { type: "Foo", value: 1 };

            generator.enterNode(dummyNode);

            assert(emitter.emit.calledOnce);
            assert(emitter.emit.calledWith("Foo", dummyNode));
        });

        it("should generate events for exitting AST node.", () => {
            const dummyNode = { type: "Foo", value: 1 };

            generator.leaveNode(dummyNode);

            assert(emitter.emit.calledOnce);
            assert(emitter.emit.calledWith("Foo:exit", dummyNode));
        });

        it("should generate events for AST queries", () => {
            const dummyNode = { type: "Bar", parent: { type: "Foo" } };

            generator.enterNode(dummyNode);

            assert(emitter.emit.calledTwice);
            assert(emitter.emit.calledWith("Foo > Bar", dummyNode));
        });
    });

    describe("traversing the entire AST", () => {

        /**
         * Gets a list of emitted types/selectors from the generator, in emission order
         * @param {string} sourceText Source code to parse and traverse
         * @param {Array<string>|Set<string>} possibleQueries Selectors to detect
         * @returns {string[]} A list of strings that were emitted, in the order that they were emitted in
         */
        function getEmissions(sourceText, possibleQueries) {
            const emissions = [];
            const emitter = new EventEmitter();
            const generator = new NodeEventGenerator(emitter, possibleQueries);
            const ast = espree.parse(sourceText, ESPREE_CONFIG);

            emitter.emit = type => emissions.push(type);

            estraverse.traverse(ast, {
                enter(node, parent) {
                    node.parent = parent;
                    generator.enterNode(node);
                },
                leave(node) {
                    generator.leaveNode(node);
                }
            });

            return emissions;
        }

        /**
         * Creates a test case that asserts a particular sequence of generator emissions
         * @param {string} sourceText The source text that should be parsed and traversed
         * @param {Array<string>} possibleQueries A collection of selectors that rules are listening for
         * @param {Array<string>} expectedEmissions The emissions that the generator is expected to produce, in order.
         * This should only include emissions that appear in possibleQueries.
         * that appear in possibleQueries.
         * @returns {void}
         */
        function assertEmissions(sourceText, possibleQueries, expectedEmissions) {
            it(possibleQueries.join("; "), () => {
                const emissions = getEmissions(sourceText, possibleQueries)
                    .filter(emission => possibleQueries.indexOf(emission) !== -1);

                assert.deepEqual(emissions, expectedEmissions);
            });
        }

        assertEmissions(
            "foo + bar;",
            ["Program", "Program:exit", "ExpressionStatement", "ExpressionStatement:exit", "BinaryExpression", "BinaryExpression:exit", "Identifier", "Identifier:exit"],
            [
                "Program", // entering program
                "ExpressionStatement", // entering 'foo + bar;'
                "BinaryExpression", // entering 'foo + bar'
                "Identifier", // entering 'foo'
                "Identifier:exit", // exiting 'foo'
                "Identifier", // entering 'bar'
                "Identifier:exit", // exiting 'bar'
                "BinaryExpression:exit", // exiting 'foo + bar'
                "ExpressionStatement:exit", // exiting 'foo + bar;'
                "Program:exit" // exiting program
            ]
        );

        assertEmissions(
            "foo + 5",
            [
                "BinaryExpression > Identifier",
                "BinaryExpression",
                "BinaryExpression Literal:exit",
                "BinaryExpression > Identifier:exit",
                "BinaryExpression:exit"
            ],
            [
                "BinaryExpression", // foo + 5
                "BinaryExpression > Identifier", // foo
                "BinaryExpression > Identifier:exit", // exiting foo
                "BinaryExpression Literal:exit", // exiting 5
                "BinaryExpression:exit" // exiting foo + 5
            ]
        );

        assertEmissions(
            "foo + 5",
            ["BinaryExpression > *[name='foo']"],
            ["BinaryExpression > *[name='foo']"] // entering foo
        );

        assertEmissions(
            "foo",
            ["*"],
            ["*", "*", "*"] // Program, ExpressionStatement, Identifier
        );

        assertEmissions(
            "foo",
            ["*:not(ExpressionStatement)"],
            ["*:not(ExpressionStatement)", "*:not(ExpressionStatement)"] // Program, Identifier
        );

        assertEmissions(
            "foo()",
            ["CallExpression[callee.name='foo']"],
            ["CallExpression[callee.name='foo']"] // foo()
        );

        assertEmissions(
            "foo()",
            ["CallExpression[callee.name='bar']"],
            [] // (nothing emitted)
        );

        assertEmissions(
            "foo + bar + baz",
            [":not(*)"],
            [] // (nothing emitted)
        );

        assertEmissions(
            "foo + bar + baz",
            [":matches(Identifier[name='foo'], Identifier[name='bar'], Identifier[name='baz'])"],
            [
                ":matches(Identifier[name='foo'], Identifier[name='bar'], Identifier[name='baz'])", // foo
                ":matches(Identifier[name='foo'], Identifier[name='bar'], Identifier[name='baz'])", // bar
                ":matches(Identifier[name='foo'], Identifier[name='bar'], Identifier[name='baz'])" // baz
            ]
        );

        assertEmissions(
            "foo + 5 + 6",
            [":matches(Identifier, Literal[value=5])"],
            [
                ":matches(Identifier, Literal[value=5])", // foo
                ":matches(Identifier, Literal[value=5])" // 5
            ]
        );

        assertEmissions(
            "[foo, 5, foo]",
            ["Identifier + Literal"],
            ["Identifier + Literal"]  // 5
        );

        assertEmissions(
            "[foo, {}, 5]",
            ["Identifier + Literal", "Identifier ~ Literal"],
            ["Identifier ~ Literal"]  // 5
        );

        assertEmissions(
            "foo;",
            [
                "*",
                ":not(*)",
                "Identifier",
                "ExpressionStatement > *",
                "ExpressionStatement > Identifier",
                "ExpressionStatement > [name='foo']",
                "Identifier, ReturnStatement",
                "FooStatement",
                "[name = 'foo']",
                "[name='foo']",
                "Identifier[name='foo']",
                "[name='foo'][name.length=3]",
                ":not(Program, ExpressionStatement)",
                ":not(Program, Identifier) > [name.length=3]"
            ],
            [
                "*", // Program
                "*", // ExpressionStatement

                // selectors for the 'foo' identifier, in order of increasing specificity
                "*", // 0 identifiers, 0 pseudoclasses
                "ExpressionStatement > *", // 0 pseudoclasses, 1 identifier
                "Identifier", // 0 pseudoclasses, 1 identifier
                ":not(Program, ExpressionStatement)", // 0 pseudoclasses, 2 identifiers
                "ExpressionStatement > Identifier", // 0 pseudoclasses, 2 identifiers
                "Identifier, ReturnStatement", // 0 pseudoclasses, 2 identifiers
                "[name = 'foo']", // 0 pseudoclass, 0 identifiers
                "[name='foo']", // 1 pseudoclass, 0 identifiers
                "ExpressionStatement > [name='foo']", // 1 attribute, 1 identifier
                "Identifier[name='foo']", // 1 attribute, 1 identifier
                ":not(Program, Identifier) > [name.length=3]", // 1 attribute, 2 identifiers
                "[name='foo'][name.length=3]" // 2 attributes, 0 identifiers
            ]
        );
    });
});
