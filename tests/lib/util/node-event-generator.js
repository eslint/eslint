/**
 * @fileoverview Tests for NodeEventGenerator.
 * @author Toru Nagashima
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("assert"),
    sinon = require("sinon"),
    espree = require("espree"),
    Traverser = require("../../../lib/util/traverser"),
    EventGeneratorTester = require("../../../tools/internal-testers/event-generator-tester"),
    createEmitter = require("../../../lib/util/safe-emitter"),
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
        new NodeEventGenerator(createEmitter())
    );

    describe("entering a single AST node", () => {
        let emitter, generator;

        beforeEach(() => {
            emitter = Object.create(createEmitter(), { emit: { value: sinon.spy() } });

            ["Foo", "Bar", "Foo > Bar", "Foo:exit"].forEach(selector => emitter.on(selector, () => {}));
            generator = new NodeEventGenerator(emitter);
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
         * @param {ASTNode} ast The AST to traverse
         * @param {Array<string>|Set<string>} possibleQueries Selectors to detect
         * @returns {Array[]} A list of emissions, in the order that they were emitted. Each emission is a two-element
         * array where the first element is a string, and the second element is the emitted AST node.
         */
        function getEmissions(ast, possibleQueries) {
            const emissions = [];
            const emitter = Object.create(createEmitter(), {
                emit: {
                    value: (selector, node) => emissions.push([selector, node])
                }
            });

            possibleQueries.forEach(query => emitter.on(query, () => {}));
            const generator = new NodeEventGenerator(emitter);

            Traverser.traverse(ast, {
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
         * @param {string[]} possibleQueries A collection of selectors that rules are listening for
         * @param {Array[]} expectedEmissions A function that accepts the AST and returns a list of the emissions that the
         * generator is expected to produce, in order.
         * Each element of this list is an array where the first element is a selector (string), and the second is an AST node
         * This should only include emissions that appear in possibleQueries.
         * @returns {void}
         */
        function assertEmissions(sourceText, possibleQueries, expectedEmissions) {
            it(possibleQueries.join("; "), () => {
                const ast = espree.parse(sourceText, ESPREE_CONFIG);
                const emissions = getEmissions(ast, possibleQueries)
                    .filter(emission => possibleQueries.indexOf(emission[0]) !== -1);

                assert.deepStrictEqual(emissions, expectedEmissions(ast));
            });
        }

        assertEmissions(
            "foo + bar;",
            ["Program", "Program:exit", "ExpressionStatement", "ExpressionStatement:exit", "BinaryExpression", "BinaryExpression:exit", "Identifier", "Identifier:exit"],
            ast => [
                ["Program", ast], // entering program
                ["ExpressionStatement", ast.body[0]], // entering 'foo + bar;'
                ["BinaryExpression", ast.body[0].expression], // entering 'foo + bar'
                ["Identifier", ast.body[0].expression.left], // entering 'foo'
                ["Identifier:exit", ast.body[0].expression.left], // exiting 'foo'
                ["Identifier", ast.body[0].expression.right], // entering 'bar'
                ["Identifier:exit", ast.body[0].expression.right], // exiting 'bar'
                ["BinaryExpression:exit", ast.body[0].expression], // exiting 'foo + bar'
                ["ExpressionStatement:exit", ast.body[0]], // exiting 'foo + bar;'
                ["Program:exit", ast] // exiting program
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
            ast => [
                ["BinaryExpression", ast.body[0].expression], // foo + 5
                ["BinaryExpression > Identifier", ast.body[0].expression.left], // foo
                ["BinaryExpression > Identifier:exit", ast.body[0].expression.left], // exiting foo
                ["BinaryExpression Literal:exit", ast.body[0].expression.right], // exiting 5
                ["BinaryExpression:exit", ast.body[0].expression] // exiting foo + 5
            ]
        );

        assertEmissions(
            "foo + 5",
            ["BinaryExpression > *[name='foo']"],
            ast => [["BinaryExpression > *[name='foo']", ast.body[0].expression.left]] // entering foo
        );

        assertEmissions(
            "foo",
            ["*"],
            ast => [
                ["*", ast], // Program
                ["*", ast.body[0]], // ExpressionStatement
                ["*", ast.body[0].expression] // Identifier
            ]
        );

        assertEmissions(
            "foo",
            ["*:not(ExpressionStatement)"],
            ast => [
                ["*:not(ExpressionStatement)", ast], // Program
                ["*:not(ExpressionStatement)", ast.body[0].expression] // Identifier
            ]
        );

        assertEmissions(
            "foo()",
            ["CallExpression[callee.name='foo']"],
            ast => [["CallExpression[callee.name='foo']", ast.body[0].expression]] // foo()
        );

        assertEmissions(
            "foo()",
            ["CallExpression[callee.name='bar']"],
            () => [] // (nothing emitted)
        );

        assertEmissions(
            "foo + bar + baz",
            [":not(*)"],
            () => [] // (nothing emitted)
        );

        assertEmissions(
            "foo + bar + baz",
            [":matches(Identifier[name='foo'], Identifier[name='bar'], Identifier[name='baz'])"],
            ast => [
                [":matches(Identifier[name='foo'], Identifier[name='bar'], Identifier[name='baz'])", ast.body[0].expression.left.left], // foo
                [":matches(Identifier[name='foo'], Identifier[name='bar'], Identifier[name='baz'])", ast.body[0].expression.left.right], // bar
                [":matches(Identifier[name='foo'], Identifier[name='bar'], Identifier[name='baz'])", ast.body[0].expression.right] // baz
            ]
        );

        assertEmissions(
            "foo + 5 + 6",
            ["Identifier, Literal[value=5]"],
            ast => [
                ["Identifier, Literal[value=5]", ast.body[0].expression.left.left], // foo
                ["Identifier, Literal[value=5]", ast.body[0].expression.left.right] // 5
            ]
        );

        assertEmissions(
            "[foo, 5, foo]",
            ["Identifier + Literal"],
            ast => [["Identifier + Literal", ast.body[0].expression.elements[1]]] // 5
        );

        assertEmissions(
            "[foo, {}, 5]",
            ["Identifier + Literal", "Identifier ~ Literal"],
            ast => [["Identifier ~ Literal", ast.body[0].expression.elements[2]]] // 5
        );

        assertEmissions(
            "foo; bar + baz; qux()",
            [":expression", ":statement"],
            ast => [
                [":statement", ast.body[0]],
                [":expression", ast.body[0].expression],
                [":statement", ast.body[1]],
                [":expression", ast.body[1].expression],
                [":expression", ast.body[1].expression.left],
                [":expression", ast.body[1].expression.right],
                [":statement", ast.body[2]],
                [":expression", ast.body[2].expression],
                [":expression", ast.body[2].expression.callee]
            ]
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
                "[name ='foo']",
                "Identifier[name='foo']",
                "[name='foo'][name.length=3]",
                ":not(Program, ExpressionStatement)",
                ":not(Program, Identifier) > [name.length=3]"
            ],
            ast => [
                ["*", ast], // Program
                ["*", ast.body[0]], // ExpressionStatement

                // selectors for the 'foo' identifier, in order of increasing specificity
                ["*", ast.body[0].expression], // 0 identifiers, 0 pseudoclasses
                ["ExpressionStatement > *", ast.body[0].expression], // 0 pseudoclasses, 1 identifier
                ["Identifier", ast.body[0].expression], // 0 pseudoclasses, 1 identifier
                [":not(Program, ExpressionStatement)", ast.body[0].expression], // 0 pseudoclasses, 2 identifiers
                ["ExpressionStatement > Identifier", ast.body[0].expression], // 0 pseudoclasses, 2 identifiers
                ["Identifier, ReturnStatement", ast.body[0].expression], // 0 pseudoclasses, 2 identifiers
                ["[name = 'foo']", ast.body[0].expression], // 1 pseudoclass, 0 identifiers
                ["[name ='foo']", ast.body[0].expression], // 1 pseudoclass, 0 identifiers
                ["[name='foo']", ast.body[0].expression], // 1 pseudoclass, 0 identifiers
                ["ExpressionStatement > [name='foo']", ast.body[0].expression], // 1 attribute, 1 identifier
                ["Identifier[name='foo']", ast.body[0].expression], // 1 attribute, 1 identifier
                [":not(Program, Identifier) > [name.length=3]", ast.body[0].expression], // 1 attribute, 2 identifiers
                ["[name='foo'][name.length=3]", ast.body[0].expression] // 2 attributes, 0 identifiers
            ]
        );

        assertEmissions(
            "foo(); bar; baz;",
            ["CallExpression, [name='bar']"],
            ast => [
                ["CallExpression, [name='bar']", ast.body[0].expression],
                ["CallExpression, [name='bar']", ast.body[1].expression]
            ]
        );

        assertEmissions(
            "foo; bar;",
            ["[name.length=3]:exit"],
            ast => [
                ["[name.length=3]:exit", ast.body[0].expression],
                ["[name.length=3]:exit", ast.body[1].expression]
            ]
        );
    });

    describe("parsing an invalid selector", () => {
        it("throws a useful error", () => {
            const emitter = createEmitter();

            emitter.on("Foo >", () => {});
            assert.throws(
                () => new NodeEventGenerator(emitter),
                /Syntax error in selector "Foo >" at position 5: Expected " ", "!", .*/u
            );
        });
    });
});
