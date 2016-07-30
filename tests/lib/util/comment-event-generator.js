/**
 * @fileoverview Tests for CommentEventGenerator.
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
    EventGeneratorTester = require("../../../lib/testers/event-generator-tester"),
    estraverse = require("estraverse"),
    SourceCode = require("../../../lib/util/source-code"),
    NodeEventGenerator = require("../../../lib/util/node-event-generator"),
    CommentEventGenerator = require("../../../lib/util/comment-event-generator");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("NodeEventGenerator", function() {
    EventGeneratorTester.testEventGeneratorInterface(
        new CommentEventGenerator(new NodeEventGenerator(new EventEmitter()))
    );

    it("should generate comment events without duplicate.", function() {
        const emitter = new EventEmitter();
        let generator = new NodeEventGenerator(emitter);
        const code = "//foo\nvar zzz /*aaa*/ = 777;\n//bar";
        const ast = espree.parse(code, {
            range: true,
            loc: true,
            comments: true,
            attachComment: true,
            tokens: true
        });
        const sourceCode = new SourceCode(code, ast);
        const expected = [

            ["Program", ast],
            ["LineComment", ast.comments[0]], // foo
            ["VariableDeclaration", ast.body[0]],
            ["LineComment", ast.comments[2]], // bar
            ["VariableDeclarator", ast.body[0].declarations[0]],
            ["Identifier", ast.body[0].declarations[0].id],
            ["BlockComment", ast.comments[1]], /* aaa */
            ["BlockComment:exit", ast.comments[1]], /* aaa */
            ["Identifier:exit", ast.body[0].declarations[0].id],
            ["Literal", ast.body[0].declarations[0].init],
            ["Literal:exit", ast.body[0].declarations[0].init],
            ["VariableDeclarator:exit", ast.body[0].declarations[0]],
            ["LineComment:exit", ast.comments[2]], // bar
            ["VariableDeclaration:exit", ast.body[0]],
            ["LineComment:exit", ast.comments[0]], // foo
            ["Program:exit", ast]
        ];

        emitter.emit = sinon.spy(emitter.emit);
        generator = new CommentEventGenerator(generator, sourceCode);

        estraverse.traverse(ast, {
            enter: function(node) {
                generator.enterNode(node);
            },
            leave: function(node) {
                generator.leaveNode(node);
            }
        });

        assert.equal(emitter.emit.callCount, expected.length);

        for (let i = 0; i < expected.length; ++i) {
            assert.equal(emitter.emit.args[i][0], expected[i][0]);
            assert.equal(emitter.emit.args[i][1], expected[i][1]);
        }
    });
});
