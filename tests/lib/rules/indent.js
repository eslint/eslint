/**
 * @fileoverview This option sets a specific tab width for your code
 * @author Dmitriy Shekhovtsov
 * @author Gyandeep Singh
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/indent"),
    RuleTester = require("../../../lib/testers/rule-tester");
const fs = require("fs");
const path = require("path");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const fixture = fs.readFileSync(path.join(__dirname, "../../fixtures/rules/indent/indent-invalid-fixture-1.js"), "utf8");
const fixedFixture = fs.readFileSync(path.join(__dirname, "../../fixtures/rules/indent/indent-valid-fixture-1.js"), "utf8");
const parser = require("../../fixtures/fixture-parser");
const { unIndent } = require("./_utils");


/**
 * Create error message object for failure cases with a single 'found' indentation type
 * @param {string} providedIndentType indent type of string or tab
 * @param {Array} providedErrors error info
 * @returns {Object} returns the error messages collection
 * @private
 */
function expectedErrors(providedIndentType, providedErrors) {
    let indentType;
    let errors;

    if (Array.isArray(providedIndentType)) {
        errors = Array.isArray(providedIndentType[0]) ? providedIndentType : [providedIndentType];
        indentType = "space";
    } else {
        errors = Array.isArray(providedErrors[0]) ? providedErrors : [providedErrors];
        indentType = providedIndentType;
    }

    return errors.map(err => ({
        messageId: "wrongIndentation",
        data: {
            expected: typeof err[1] === "string" && typeof err[2] === "string"
                ? err[1]
                : `${err[1]} ${indentType}${err[1] === 1 ? "" : "s"}`,
            actual: err[2]
        },
        type: err[3],
        line: err[0]
    }));
}

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 8, ecmaFeatures: { jsx: true } } });

ruleTester.run("indent", rule, {
    valid: [
        {
            code: unIndent`
                bridge.callHandler(
                  'getAppVersion', 'test23', function(responseData) {
                    window.ah.mobileAppVersion = responseData;
                  }
                );
            `,
            options: [2]
        },
        {
            code: unIndent`
                bridge.callHandler(
                  'getAppVersion', 'test23', function(responseData) {
                    window.ah.mobileAppVersion = responseData;
                  });
            `,
            options: [2]
        },
        {
            code: unIndent`
                bridge.callHandler(
                  'getAppVersion',
                  null,
                  function responseCallback(responseData) {
                    window.ah.mobileAppVersion = responseData;
                  }
                );
            `,
            options: [2]
        },
        {
            code: unIndent`
                bridge.callHandler(
                  'getAppVersion',
                  null,
                  function responseCallback(responseData) {
                    window.ah.mobileAppVersion = responseData;
                  });
            `,
            options: [2]
        },
        {
            code: unIndent`
                function doStuff(keys) {
                    _.forEach(
                        keys,
                        key => {
                            doSomething(key);
                        }
                    );
                }
            `,
            options: [4]
        },
        {
            code: unIndent`
                example(
                    function () {
                        console.log('example');
                    }
                );
            `,
            options: [4]
        },
        {
            code: unIndent`
                let foo = somethingList
                    .filter(x => {
                        return x;
                    })
                    .map(x => {
                        return 100 * x;
                    });
            `,
            options: [4]
        },
        {
            code: unIndent`
                var x = 0 &&
                    {
                        a: 1,
                        b: 2
                    };
            `,
            options: [4]
        },
        {
            code: unIndent`
                var x = 0 &&
                \t{
                \t\ta: 1,
                \t\tb: 2
                \t};
            `,
            options: ["tab"]
        },
        {
            code: unIndent`
                var x = 0 &&
                    {
                        a: 1,
                        b: 2
                    }||
                    {
                        c: 3,
                        d: 4
                    };
            `,
            options: [4]
        },
        {
            code: unIndent`
                var x = [
                    'a',
                    'b',
                    'c'
                ];
            `,
            options: [4]
        },
        {
            code: unIndent`
                var x = ['a',
                    'b',
                    'c',
                ];
            `,
            options: [4]
        },
        {
            code: "var x = 0 && 1;",
            options: [4]
        },
        {
            code: "var x = 0 && { a: 1, b: 2 };",
            options: [4]
        },
        {
            code: unIndent`
                var x = 0 &&
                    (
                        1
                    );
            `,
            options: [4]
        },
        {
            code: unIndent`
                require('http').request({hostname: 'localhost',
                  port: 80}, function(res) {
                  res.end();
                });
            `,
            options: [2]
        },
        {
            code: unIndent`
                function test() {
                  return client.signUp(email, PASSWORD, { preVerified: true })
                    .then(function (result) {
                      // hi
                    })
                    .then(function () {
                      return FunctionalHelpers.clearBrowserState(self, {
                        contentServer: true,
                        contentServer1: true
                      });
                    });
                }
            `,
            options: [2]
        },
        {
            code: unIndent`
                it('should... some lengthy test description that is forced to be' +
                  'wrapped into two lines since the line length limit is set', () => {
                  expect(true).toBe(true);
                });
            `,
            options: [2]
        },
        {
            code: unIndent`
                function test() {
                    return client.signUp(email, PASSWORD, { preVerified: true })
                        .then(function (result) {
                            var x = 1;
                            var y = 1;
                        }, function(err){
                            var o = 1 - 2;
                            var y = 1 - 2;
                            return true;
                        })
                }
            `,
            options: [4]
        },
        {

            // https://github.com/eslint/eslint/issues/11802
            code: unIndent`
                import foo from "foo"

                ;(() => {})()
            `,
            options: [4],
            parserOptions: { sourceType: "module" }
        },
        {
            code: unIndent`
                function test() {
                    return client.signUp(email, PASSWORD, { preVerified: true })
                    .then(function (result) {
                        var x = 1;
                        var y = 1;
                    }, function(err){
                        var o = 1 - 2;
                        var y = 1 - 2;
                        return true;
                    });
                }
            `,
            options: [4, { MemberExpression: 0 }]
        },

        {
            code: "// hi",
            options: [2, { VariableDeclarator: 1, SwitchCase: 1 }]
        },
        {
            code: unIndent`
                var Command = function() {
                  var fileList = [],
                      files = []

                  files.concat(fileList)
                };
            `,
            options: [2, { VariableDeclarator: { var: 2, let: 2, const: 3 } }]
        },
        {
            code: "  ",
            options: [2, { VariableDeclarator: 1, SwitchCase: 1 }]
        },
        {
            code: unIndent`
                if(data) {
                  console.log('hi');
                  b = true;};
            `,
            options: [2, { VariableDeclarator: 1, SwitchCase: 1 }]
        },
        {
            code: unIndent`
                foo = () => {
                  console.log('hi');
                  return true;};
            `,
            options: [2, { VariableDeclarator: 1, SwitchCase: 1 }]
        },
        {
            code: unIndent`
                function test(data) {
                  console.log('hi');
                  return true;};
            `,
            options: [2, { VariableDeclarator: 1, SwitchCase: 1 }]
        },
        {
            code: unIndent`
                var test = function(data) {
                  console.log('hi');
                };
            `,
            options: [2, { VariableDeclarator: 1, SwitchCase: 1 }]
        },
        {
            code: unIndent`
                arr.forEach(function(data) {
                  otherdata.forEach(function(zero) {
                    console.log('hi');
                  }) });
            `,
            options: [2, { VariableDeclarator: 1, SwitchCase: 1 }]
        },
        {
            code: unIndent`
                a = [
                    ,3
                ]
            `,
            options: [4, { VariableDeclarator: 1, SwitchCase: 1 }]
        },
        {
            code: unIndent`
                [
                  ['gzip', 'gunzip'],
                  ['gzip', 'unzip'],
                  ['deflate', 'inflate'],
                  ['deflateRaw', 'inflateRaw'],
                ].forEach(function(method) {
                  console.log(method);
                });
            `,
            options: [2, { SwitchCase: 1, VariableDeclarator: 2 }]
        },
        {
            code: unIndent`
                test(123, {
                    bye: {
                        hi: [1,
                            {
                                b: 2
                            }
                        ]
                    }
                });
            `,
            options: [4, { VariableDeclarator: 1, SwitchCase: 1 }]
        },
        {
            code: unIndent`
                var xyz = 2,
                    lmn = [
                        {
                            a: 1
                        }
                    ];
            `,
            options: [4, { VariableDeclarator: 1, SwitchCase: 1 }]
        },
        {
            code: unIndent`
                lmnn = [{
                    a: 1
                },
                {
                    b: 2
                }, {
                    x: 2
                }];
            `,
            options: [4, { VariableDeclarator: 1, SwitchCase: 1 }]
        },
        unIndent`
            [{
                foo: 1
            }, {
                foo: 2
            }, {
                foo: 3
            }]
        `,
        unIndent`
            foo([
                bar
            ], [
                baz
            ], [
                qux
            ]);
        `,
        {
            code: unIndent`
                abc({
                    test: [
                        [
                            c,
                            xyz,
                            2
                        ].join(',')
                    ]
                });
            `,
            options: [4, { VariableDeclarator: 1, SwitchCase: 1 }]
        },
        {
            code: unIndent`
                abc = {
                  test: [
                    [
                      c,
                      xyz,
                      2
                    ]
                  ]
                };
            `,
            options: [2, { VariableDeclarator: 1, SwitchCase: 1 }]
        },
        {
            code: unIndent`
                abc(
                  {
                    a: 1,
                    b: 2
                  }
                );
            `,
            options: [2, { VariableDeclarator: 1, SwitchCase: 1 }]
        },
        {
            code: unIndent`
                abc({
                    a: 1,
                    b: 2
                });
            `,
            options: [4, { VariableDeclarator: 1, SwitchCase: 1 }]
        },
        {
            code: unIndent`
                var abc =
                  [
                    c,
                    xyz,
                    {
                      a: 1,
                      b: 2
                    }
                  ];
            `,
            options: [2, { VariableDeclarator: 1, SwitchCase: 1 }]
        },
        {
            code: unIndent`
                var abc = [
                  c,
                  xyz,
                  {
                    a: 1,
                    b: 2
                  }
                ];
            `,
            options: [2, { VariableDeclarator: 1, SwitchCase: 1 }]
        },
        {
            code: unIndent`
                var abc = 5,
                    c = 2,
                    xyz =
                    {
                      a: 1,
                      b: 2
                    };
            `,
            options: [2, { VariableDeclarator: 2, SwitchCase: 1 }]
        },
        unIndent`
            var
                x = {
                    a: 1,
                },
                y = {
                    b: 2
                }
        `,
        unIndent`
            const
                x = {
                    a: 1,
                },
                y = {
                    b: 2
                }
        `,
        unIndent`
            let
                x = {
                    a: 1,
                },
                y = {
                    b: 2
                }
        `,
        unIndent`
            var foo = { a: 1 }, bar = {
                b: 2
            };
        `,
        unIndent`
            var foo = { a: 1 }, bar = {
                    b: 2
                },
                baz = {
                    c: 3
                }
        `,
        unIndent`
            const {
                    foo
                } = 1,
                bar = 2
        `,
        {
            code: unIndent`
                var foo = 1,
                  bar =
                    2
            `,
            options: [2, { VariableDeclarator: 1 }]
        },
        {
            code: unIndent`
                var foo = 1,
                  bar
                    = 2
            `,
            options: [2, { VariableDeclarator: 1 }]
        },
        {
            code: unIndent`
                var foo
                  = 1,
                  bar
                    = 2
            `,
            options: [2, { VariableDeclarator: 1 }]
        },
        {
            code: unIndent`
                var foo
                  =
                  1,
                  bar
                    =
                    2
            `,
            options: [2, { VariableDeclarator: 1 }]
        },
        {
            code: unIndent`
                var foo
                  = (1),
                  bar
                    = (2)
            `,
            options: [2, { VariableDeclarator: 1 }]
        },
        {
            code: unIndent`
                let foo = 'foo',
                    bar = bar;
                const a = 'a',
                      b = 'b';
            `,
            options: [2, { VariableDeclarator: "first" }]
        },
        {
            code: unIndent`
                let foo = 'foo',
                    bar = bar  // <-- no semicolon here
                const a = 'a',
                      b = 'b'  // <-- no semicolon here
            `,
            options: [2, { VariableDeclarator: "first" }]
        },
        {
            code: unIndent`
                var foo = 1,
                    bar = 2,
                    baz = 3
                ;
            `,
            options: [2, { VariableDeclarator: { var: 2 } }]
        },
        {
            code: unIndent`
                var foo = 1,
                    bar = 2,
                    baz = 3
                    ;
            `,
            options: [2, { VariableDeclarator: { var: 2 } }]
        },
        {
            code: unIndent`
                var foo = 'foo',
                    bar = bar;
            `,
            options: [2, { VariableDeclarator: { var: "first" } }]
        },
        {
            code: unIndent`
                var foo = 'foo',
                    bar = 'bar'  // <-- no semicolon here
            `,
            options: [2, { VariableDeclarator: { var: "first" } }]
        },
        {
            code: unIndent`
            let foo = 1,
                bar = 2,
                baz
            `,
            options: [2, { VariableDeclarator: "first" }]
        },
        {
            code: unIndent`
            let
                foo
            `,
            options: [4, { VariableDeclarator: "first" }]
        },
        {
            code: unIndent`
            let foo = 1,
                bar =
                2
            `,
            options: [2, { VariableDeclarator: "first" }]
        },
        {
            code: unIndent`
                var abc =
                    {
                      a: 1,
                      b: 2
                    };
            `,
            options: [2, { VariableDeclarator: 2, SwitchCase: 1 }]
        },
        {
            code: unIndent`
                var a = new abc({
                        a: 1,
                        b: 2
                    }),
                    b = 2;
            `,
            options: [4, { VariableDeclarator: 1, SwitchCase: 1 }]
        },
        {
            code: unIndent`
                var a = 2,
                  c = {
                    a: 1,
                    b: 2
                  },
                  b = 2;
            `,
            options: [2, { VariableDeclarator: 1, SwitchCase: 1 }]
        },
        {
            code: unIndent`
                var x = 2,
                    y = {
                      a: 1,
                      b: 2
                    },
                    b = 2;
            `,
            options: [2, { VariableDeclarator: 2, SwitchCase: 1 }]
        },
        {
            code: unIndent`
                var e = {
                      a: 1,
                      b: 2
                    },
                    b = 2;
            `,
            options: [2, { VariableDeclarator: 2, SwitchCase: 1 }]
        },
        {
            code: unIndent`
                var a = {
                  a: 1,
                  b: 2
                };
            `,
            options: [2, { VariableDeclarator: 2, SwitchCase: 1 }]
        },
        {
            code: unIndent`
                function test() {
                  if (true ||
                            false){
                    console.log(val);
                  }
                }
            `,
            options: [2, { VariableDeclarator: 2, SwitchCase: 1 }]
        },
        unIndent`
            var foo = bar ||
                !(
                    baz
                );
        `,
        unIndent`
            for (var foo = 1;
                foo < 10;
                foo++) {}
        `,
        unIndent`
            for (
                var foo = 1;
                foo < 10;
                foo++
            ) {}
        `,
        {
            code: unIndent`
                for (var val in obj)
                  if (true)
                    console.log(val);
            `,
            options: [2, { VariableDeclarator: 2, SwitchCase: 1 }]
        },
        {
            code: unIndent`
                if(true)
                  if (true)
                    if (true)
                      console.log(val);
            `,
            options: [2, { VariableDeclarator: 2, SwitchCase: 1 }]
        },
        {
            code: unIndent`
                function hi(){     var a = 1;
                  y++;                   x++;
                }
            `,
            options: [2, { VariableDeclarator: 2, SwitchCase: 1 }]
        },
        {
            code: unIndent`
                for(;length > index; index++)if(NO_HOLES || index in self){
                  x++;
                }
            `,
            options: [2, { VariableDeclarator: 2, SwitchCase: 1 }]
        },
        {
            code: unIndent`
                function test(){
                  switch(length){
                    case 1: return function(a){
                      return fn.call(that, a);
                    };
                  }
                }
            `,
            options: [2, { VariableDeclarator: 2, SwitchCase: 1 }]
        },
        {
            code: unIndent`
                var geometry = 2,
                rotate = 2;
            `,
            options: [2, { VariableDeclarator: 0 }]
        },
        {
            code: unIndent`
                var geometry,
                    rotate;
            `,
            options: [4, { VariableDeclarator: 1 }]
        },
        {
            code: unIndent`
                var geometry,
                \trotate;
            `,
            options: ["tab", { VariableDeclarator: 1 }]
        },
        {
            code: unIndent`
                var geometry,
                  rotate;
            `,
            options: [2, { VariableDeclarator: 1 }]
        },
        {
            code: unIndent`
                var geometry,
                    rotate;
            `,
            options: [2, { VariableDeclarator: 2 }]
        },
        {
            code: unIndent`
                let geometry,
                    rotate;
            `,
            options: [2, { VariableDeclarator: 2 }]
        },
        {
            code: unIndent`
                const geometry = 2,
                    rotate = 3;
            `,
            options: [2, { VariableDeclarator: 2 }]
        },
        {
            code: unIndent`
                var geometry, box, face1, face2, colorT, colorB, sprite, padding, maxWidth,
                  height, rotate;
            `,
            options: [2, { SwitchCase: 1 }]
        },
        {
            code: "var geometry, box, face1, face2, colorT, colorB, sprite, padding, maxWidth;",
            options: [2, { SwitchCase: 1 }]
        },
        {
            code: unIndent`
                if (1 < 2){
                //hi sd
                }
            `,
            options: [2]
        },
        {
            code: unIndent`
                while (1 < 2){
                  //hi sd
                }
            `,
            options: [2]
        },
        {
            code: "while (1 < 2) console.log('hi');",
            options: [2]
        },

        {
            code: unIndent`
                [a, boop,
                    c].forEach((index) => {
                    index;
                });
            `,
            options: [4]
        },
        {
            code: unIndent`
                [a, b,
                    c].forEach(function(index){
                    return index;
                });
            `,
            options: [4]
        },
        {
            code: unIndent`
                [a, b, c].forEach((index) => {
                    index;
                });
            `,
            options: [4]
        },
        {
            code: unIndent`
                [a, b, c].forEach(function(index){
                    return index;
                });
            `,
            options: [4]
        },
        {
            code: unIndent`
                (foo)
                    .bar([
                        baz
                    ]);
            `,
            options: [4, { MemberExpression: 1 }]
        },
        {
            code: unIndent`
                switch (x) {
                    case "foo":
                        a();
                        break;
                    case "bar":
                        switch (y) {
                            case "1":
                                break;
                            case "2":
                                a = 6;
                                break;
                        }
                    case "test":
                        break;
                }
            `,
            options: [4, { SwitchCase: 1 }]
        },
        {
            code: unIndent`
                switch (x) {
                        case "foo":
                            a();
                            break;
                        case "bar":
                            switch (y) {
                                    case "1":
                                        break;
                                    case "2":
                                        a = 6;
                                        break;
                            }
                        case "test":
                            break;
                }
            `,
            options: [4, { SwitchCase: 2 }]
        },
        unIndent`
            switch (a) {
            case "foo":
                a();
                break;
            case "bar":
                switch(x){
                case '1':
                    break;
                case '2':
                    a = 6;
                    break;
                }
            }
        `,
        unIndent`
            switch (a) {
            case "foo":
                a();
                break;
            case "bar":
                if(x){
                    a = 2;
                }
                else{
                    a = 6;
                }
            }
        `,
        unIndent`
            switch (a) {
            case "foo":
                a();
                break;
            case "bar":
                if(x){
                    a = 2;
                }
                else
                    a = 6;
            }
        `,
        unIndent`
            switch (a) {
            case "foo":
                a();
                break;
            case "bar":
                a(); break;
            case "baz":
                a(); break;
            }
        `,
        unIndent`
            switch (0) {
            }
        `,
        unIndent`
            function foo() {
                var a = "a";
                switch(a) {
                case "a":
                    return "A";
                case "b":
                    return "B";
                }
            }
            foo();
        `,
        {
            code: unIndent`
                switch(value){
                    case "1":
                    case "2":
                        a();
                        break;
                    default:
                        a();
                        break;
                }
                switch(value){
                    case "1":
                        a();
                        break;
                    case "2":
                        break;
                    default:
                        break;
                }
            `,
            options: [4, { SwitchCase: 1 }]
        },
        unIndent`
            var obj = {foo: 1, bar: 2};
            with (obj) {
                console.log(foo + bar);
            }
        `,
        unIndent`
            if (a) {
                (1 + 2 + 3); // no error on this line
            }
        `,
        "switch(value){ default: a(); break; }",
        {
            code: unIndent`
                import {addons} from 'react/addons'
                import React from 'react'
            `,
            options: [2],
            parserOptions: { sourceType: "module" }
        },
        {
            code: unIndent`
                import {
                    foo,
                    bar,
                    baz
                } from 'qux';
            `,
            parserOptions: { sourceType: "module" }
        },
        {
            code: unIndent`
                var foo = 0, bar = 0; baz = 0;
                export {
                    foo,
                    bar,
                    baz
                } from 'qux';
            `,
            parserOptions: { sourceType: "module" }
        },
        {
            code: unIndent`
                var a = 1,
                    b = 2,
                    c = 3;
            `,
            options: [4]
        },
        {
            code: unIndent`
                var a = 1
                    ,b = 2
                    ,c = 3;
            `,
            options: [4]
        },
        {
            code: "while (1 < 2) console.log('hi')",
            options: [2]
        },
        {
            code: unIndent`
                function salutation () {
                  switch (1) {
                    case 0: return console.log('hi')
                    case 1: return console.log('hey')
                  }
                }
            `,
            options: [2, { SwitchCase: 1 }]
        },
        {
            code: unIndent`
                var items = [
                  {
                    foo: 'bar'
                  }
                ];
            `,
            options: [2, { VariableDeclarator: 2 }]
        },
        {
            code: unIndent`
                const a = 1,
                      b = 2;
                const items1 = [
                  {
                    foo: 'bar'
                  }
                ];
                const items2 = Items(
                  {
                    foo: 'bar'
                  }
                );
            `,
            options: [2, { VariableDeclarator: 3 }]

        },
        {
            code: unIndent`
                const geometry = 2,
                      rotate = 3;
                var a = 1,
                  b = 2;
                let light = true,
                    shadow = false;
            `,
            options: [2, { VariableDeclarator: { const: 3, let: 2 } }]
        },
        {
            code: unIndent`
                const abc = 5,
                      c = 2,
                      xyz =
                      {
                        a: 1,
                        b: 2
                      };
                let abc2 = 5,
                  c2 = 2,
                  xyz2 =
                  {
                    a: 1,
                    b: 2
                  };
                var abc3 = 5,
                    c3 = 2,
                    xyz3 =
                    {
                      a: 1,
                      b: 2
                    };
            `,
            options: [2, { VariableDeclarator: { var: 2, const: 3 }, SwitchCase: 1 }]
        },
        {
            code: unIndent`
                module.exports = {
                  'Unit tests':
                  {
                    rootPath: './',
                    environment: 'node',
                    tests:
                    [
                      'test/test-*.js'
                    ],
                    sources:
                    [
                      '*.js',
                      'test/**.js'
                    ]
                  }
                };
            `,
            options: [2]
        },
        {
            code: unIndent`
                foo =
                  bar;
            `,
            options: [2]
        },
        {
            code: unIndent`
                foo = (
                  bar
                );
            `,
            options: [2]
        },
        {
            code: unIndent`
                var path     = require('path')
                  , crypto    = require('crypto')
                  ;
            `,
            options: [2]
        },
        unIndent`
            var a = 1
                ,b = 2
                ;
        `,
        {
            code: unIndent`
                export function create (some,
                                        argument) {
                  return Object.create({
                    a: some,
                    b: argument
                  });
                };
            `,
            options: [2, { FunctionDeclaration: { parameters: "first" } }],
            parserOptions: { sourceType: "module" }
        },
        {
            code: unIndent`
                export function create (id, xfilter, rawType,
                                        width=defaultWidth, height=defaultHeight,
                                        footerHeight=defaultFooterHeight,
                                        padding=defaultPadding) {
                  // ... function body, indented two spaces
                }
            `,
            options: [2, { FunctionDeclaration: { parameters: "first" } }],
            parserOptions: { sourceType: "module" }
        },
        {
            code: unIndent`
                var obj = {
                  foo: function () {
                    return new p()
                      .then(function (ok) {
                        return ok;
                      }, function () {
                        // ignore things
                      });
                  }
                };
            `,
            options: [2]
        },
        {
            code: unIndent`
                a.b()
                  .c(function(){
                    var a;
                  }).d.e;
            `,
            options: [2]
        },
        {
            code: unIndent`
                const YO = 'bah',
                      TE = 'mah'

                var res,
                    a = 5,
                    b = 4
            `,
            options: [2, { VariableDeclarator: { var: 2, let: 2, const: 3 } }]
        },
        {
            code: unIndent`
                const YO = 'bah',
                      TE = 'mah'

                var res,
                    a = 5,
                    b = 4

                if (YO) console.log(TE)
            `,
            options: [2, { VariableDeclarator: { var: 2, let: 2, const: 3 } }]
        },
        {
            code: unIndent`
                var foo = 'foo',
                  bar = 'bar',
                  baz = function() {

                  }

                function hello () {

                }
            `,
            options: [2]
        },
        {
            code: unIndent`
                var obj = {
                  send: function () {
                    return P.resolve({
                      type: 'POST'
                    })
                      .then(function () {
                        return true;
                      }, function () {
                        return false;
                      });
                  }
                };
            `,
            options: [2]
        },
        {
            code: unIndent`
                var obj = {
                  send: function () {
                    return P.resolve({
                      type: 'POST'
                    })
                    .then(function () {
                      return true;
                    }, function () {
                      return false;
                    });
                  }
                };
            `,
            options: [2, { MemberExpression: 0 }]
        },
        unIndent`
            const someOtherFunction = argument => {
                    console.log(argument);
                },
                someOtherValue = 'someOtherValue';
        `,
        {
            code: unIndent`
                [
                  'a',
                  'b'
                ].sort().should.deepEqual([
                  'x',
                  'y'
                ]);
            `,
            options: [2]
        },
        {
            code: unIndent`
                var a = 1,
                    B = class {
                      constructor(){}
                      a(){}
                      get b(){}
                    };
            `,
            options: [2, { VariableDeclarator: 2, SwitchCase: 1 }]
        },
        {
            code: unIndent`
                var a = 1,
                    B =
                    class {
                      constructor(){}
                      a(){}
                      get b(){}
                    },
                    c = 3;
            `,
            options: [2, { VariableDeclarator: 2, SwitchCase: 1 }]
        },
        {
            code: unIndent`
                class A{
                    constructor(){}
                    a(){}
                    get b(){}
                }
            `,
            options: [4, { VariableDeclarator: 1, SwitchCase: 1 }]
        },
        {
            code: unIndent`
                var A = class {
                    constructor(){}
                    a(){}
                    get b(){}
                }
            `,
            options: [4, { VariableDeclarator: 1, SwitchCase: 1 }]
        },
        {
            code: unIndent`
                var a = {
                  some: 1
                  , name: 2
                };
            `,
            options: [2]
        },
        {
            code: unIndent`
                a.c = {
                    aa: function() {
                        'test1';
                        return 'aa';
                    }
                    , bb: function() {
                        return this.bb();
                    }
                };
            `,
            options: [4]
        },
        {
            code: unIndent`
                var a =
                {
                    actions:
                    [
                        {
                            name: 'compile'
                        }
                    ]
                };
            `,
            options: [4, { VariableDeclarator: 0, SwitchCase: 1 }]
        },
        {
            code: unIndent`
                var a =
                [
                    {
                        name: 'compile'
                    }
                ];
            `,
            options: [4, { VariableDeclarator: 0, SwitchCase: 1 }]
        },
        unIndent`
            [[
            ], function(
                foo
            ) {}
            ]
        `,
        unIndent`
            define([
                'foo'
            ], function(
                bar
            ) {
                baz;
            }
            )
        `,
        {
            code: unIndent`
                const func = function (opts) {
                    return Promise.resolve()
                    .then(() => {
                        [
                            'ONE', 'TWO'
                        ].forEach(command => { doSomething(); });
                    });
                };
            `,
            options: [4, { MemberExpression: 0 }]
        },
        {
            code: unIndent`
                const func = function (opts) {
                    return Promise.resolve()
                        .then(() => {
                            [
                                'ONE', 'TWO'
                            ].forEach(command => { doSomething(); });
                        });
                };
            `,
            options: [4]
        },
        {
            code: unIndent`
                var haveFun = function () {
                    SillyFunction(
                        {
                            value: true,
                        },
                        {
                            _id: true,
                        }
                    );
                };
            `,
            options: [4]
        },
        {
            code: unIndent`
                var haveFun = function () {
                    new SillyFunction(
                        {
                            value: true,
                        },
                        {
                            _id: true,
                        }
                    );
                };
            `,
            options: [4]
        },
        {
            code: unIndent`
                let object1 = {
                  doThing() {
                    return _.chain([])
                      .map(v => (
                        {
                          value: true,
                        }
                      ))
                      .value();
                  }
                };
            `,
            options: [2]
        },
        {
            code: unIndent`
                var foo = {
                    bar: 1,
                    baz: {
                      qux: 2
                    }
                  },
                  bar = 1;
            `,
            options: [2]
        },
        {
            code: unIndent`
                class Foo
                  extends Bar {
                  baz() {}
                }
            `,
            options: [2]
        },
        {
            code: unIndent`
                class Foo extends
                  Bar {
                  baz() {}
                }
            `,
            options: [2]
        },
        {
            code: unIndent`
                class Foo extends
                  (
                    Bar
                  ) {
                  baz() {}
                }
            `,
            options: [2]
        },
        {
            code: unIndent`
                fs.readdirSync(path.join(__dirname, '../rules')).forEach(name => {
                  files[name] = foo;
                });
            `,
            options: [2, { outerIIFEBody: 0 }]
        },
        {
            code: unIndent`
                (function(){
                function foo(x) {
                  return x + 1;
                }
                })();
            `,
            options: [2, { outerIIFEBody: 0 }]
        },
        {
            code: unIndent`
                (function(){
                        function foo(x) {
                            return x + 1;
                        }
                })();
            `,
            options: [4, { outerIIFEBody: 2 }]
        },
        {
            code: unIndent`
                (function(x, y){
                function foo(x) {
                  return x + 1;
                }
                })(1, 2);
            `,
            options: [2, { outerIIFEBody: 0 }]
        },
        {
            code: unIndent`
                (function(){
                function foo(x) {
                  return x + 1;
                }
                }());
            `,
            options: [2, { outerIIFEBody: 0 }]
        },
        {
            code: unIndent`
                !function(){
                function foo(x) {
                  return x + 1;
                }
                }();
            `,
            options: [2, { outerIIFEBody: 0 }]
        },
        {
            code: unIndent`
                !function(){
                \t\t\tfunction foo(x) {
                \t\t\t\treturn x + 1;
                \t\t\t}
                }();
            `,
            options: ["tab", { outerIIFEBody: 3 }]
        },
        {
            code: unIndent`
                var out = function(){
                  function fooVar(x) {
                    return x + 1;
                  }
                };
            `,
            options: [2, { outerIIFEBody: 0 }]
        },
        {
            code: unIndent`
                var ns = function(){
                function fooVar(x) {
                  return x + 1;
                }
                }();
            `,
            options: [2, { outerIIFEBody: 0 }]
        },
        {
            code: unIndent`
                ns = function(){
                function fooVar(x) {
                  return x + 1;
                }
                }();
            `,
            options: [2, { outerIIFEBody: 0 }]
        },
        {
            code: unIndent`
                var ns = (function(){
                function fooVar(x) {
                  return x + 1;
                }
                }(x));
            `,
            options: [2, { outerIIFEBody: 0 }]
        },
        {
            code: unIndent`
                var ns = (function(){
                        function fooVar(x) {
                            return x + 1;
                        }
                }(x));
            `,
            options: [4, { outerIIFEBody: 2 }]
        },
        {
            code: unIndent`
                var obj = {
                  foo: function() {
                    return true;
                  }
                };
            `,
            options: [2, { outerIIFEBody: 0 }]
        },
        {
            code: unIndent`
                while (
                  function() {
                    return true;
                  }()) {

                  x = x + 1;
                };
            `,
            options: [2, { outerIIFEBody: 20 }]
        },
        {
            code: unIndent`
                (() => {
                function foo(x) {
                  return x + 1;
                }
                })();
            `,
            options: [2, { outerIIFEBody: 0 }]
        },
        {
            code: unIndent`
                function foo() {
                }
            `,
            options: ["tab", { outerIIFEBody: 0 }]
        },
        {
            code: unIndent`
                ;(() => {
                function foo(x) {
                  return x + 1;
                }
                })();
            `,
            options: [2, { outerIIFEBody: 0 }]
        },
        {
            code: unIndent`
                if(data) {
                  console.log('hi');
                }
            `,
            options: [2, { outerIIFEBody: 0 }]
        },
        {
            code: "Buffer.length",
            options: [4, { MemberExpression: 1 }]
        },
        {
            code: unIndent`
                Buffer
                    .indexOf('a')
                    .toString()
            `,
            options: [4, { MemberExpression: 1 }]
        },
        {
            code: unIndent`
                Buffer.
                    length
            `,
            options: [4, { MemberExpression: 1 }]
        },
        {
            code: unIndent`
                Buffer
                    .foo
                    .bar
            `,
            options: [4, { MemberExpression: 1 }]
        },
        {
            code: unIndent`
                Buffer
                \t.foo
                \t.bar
            `,
            options: ["tab", { MemberExpression: 1 }]
        },
        {
            code: unIndent`
                Buffer
                    .foo
                    .bar
            `,
            options: [2, { MemberExpression: 2 }]
        },
        unIndent`
            (
                foo
                    .bar
            )
        `,
        unIndent`
            (
                (
                    foo
                        .bar
                )
            )
        `,
        unIndent`
            (
                foo
            )
                .bar
        `,
        unIndent`
            (
                (
                    foo
                )
                    .bar
            )
        `,
        unIndent`
            (
                (
                    foo
                )
                    [
                        (
                            bar
                        )
                    ]
            )
        `,
        unIndent`
            (
                foo[bar]
            )
                .baz
        `,
        unIndent`
            (
                (foo.bar)
            )
                .baz
        `,
        {
            code: unIndent`
                MemberExpression
                .can
                  .be
                    .turned
                 .off();
            `,
            options: [4, { MemberExpression: "off" }]
        },
        {
            code: unIndent`
                foo = bar.baz()
                    .bip();
            `,
            options: [4, { MemberExpression: 1 }]
        },
        unIndent`
            function foo() {
                new
                    .target
            }
        `,
        unIndent`
            function foo() {
                new.
                    target
            }
        `,
        {
            code: unIndent`
                if (foo) {
                  bar();
                } else if (baz) {
                  foobar();
                } else if (qux) {
                  qux();
                }
            `,
            options: [2]
        },
        {
            code: unIndent`
                function foo(aaa,
                  bbb, ccc, ddd) {
                    bar();
                }
            `,
            options: [2, { FunctionDeclaration: { parameters: 1, body: 2 } }]
        },
        {
            code: unIndent`
                function foo(aaa, bbb,
                      ccc, ddd) {
                  bar();
                }
            `,
            options: [2, { FunctionDeclaration: { parameters: 3, body: 1 } }]
        },
        {
            code: unIndent`
                function foo(aaa,
                    bbb,
                    ccc) {
                            bar();
                }
            `,
            options: [4, { FunctionDeclaration: { parameters: 1, body: 3 } }]
        },
        {
            code: unIndent`
                function foo(aaa,
                             bbb, ccc,
                             ddd, eee, fff) {
                  bar();
                }
            `,
            options: [2, { FunctionDeclaration: { parameters: "first", body: 1 } }]
        },
        {
            code: unIndent`
                function foo(aaa, bbb)
                {
                      bar();
                }
            `,
            options: [2, { FunctionDeclaration: { body: 3 } }]
        },
        {
            code: unIndent`
                function foo(
                  aaa,
                  bbb) {
                    bar();
                }
            `,
            options: [2, { FunctionDeclaration: { parameters: "first", body: 2 } }]
        },
        {
            code: unIndent`
                var foo = function(aaa,
                    bbb,
                    ccc,
                    ddd) {
                bar();
                }
            `,
            options: [2, { FunctionExpression: { parameters: 2, body: 0 } }]
        },
        {
            code: unIndent`
                var foo = function(aaa,
                  bbb,
                  ccc) {
                                    bar();
                }
            `,
            options: [2, { FunctionExpression: { parameters: 1, body: 10 } }]
        },
        {
            code: unIndent`
                var foo = function(aaa,
                                   bbb, ccc, ddd,
                                   eee, fff) {
                    bar();
                }
            `,
            options: [4, { FunctionExpression: { parameters: "first", body: 1 } }]
        },
        {
            code: unIndent`
                var foo = function(
                  aaa, bbb, ccc,
                  ddd, eee) {
                      bar();
                }
            `,
            options: [2, { FunctionExpression: { parameters: "first", body: 3 } }]
        },
        {
            code: unIndent`
                foo.bar(
                      baz, qux, function() {
                            qux;
                      }
                );
            `,
            options: [2, { FunctionExpression: { body: 3 }, CallExpression: { arguments: 3 } }]
        },
        {
            code: unIndent`
                function foo() {
                  bar();
                  \tbaz();
                \t   \t\t\t  \t\t\t  \t   \tqux();
                }
            `,
            options: [2]
        },
        {
            code: unIndent`
                function foo() {
                  function bar() {
                    baz();
                  }
                }
            `,
            options: [2, { FunctionDeclaration: { body: 1 } }]
        },
        {
            code: unIndent`
                function foo() {
                  bar();
                   \t\t}
            `,
            options: [2]
        },
        {
            code: unIndent`
                function foo() {
                  function bar(baz,
                      qux) {
                    foobar();
                  }
                }
            `,
            options: [2, { FunctionDeclaration: { body: 1, parameters: 2 } }]
        },
        {
            code: unIndent`
                ((
                    foo
                ))
            `,
            options: [4]
        },

        // ternary expressions (https://github.com/eslint/eslint/issues/7420)
        {
            code: unIndent`
                foo
                  ? bar
                  : baz
            `,
            options: [2]
        },
        {
            code: unIndent`
                foo = (bar ?
                  baz :
                  qux
                );
            `,
            options: [2]
        },
        unIndent`
            [
                foo ?
                    bar :
                    baz,
                qux
            ];
        `,
        {

            /*
             * Checking comments:
             * https://github.com/eslint/eslint/issues/3845, https://github.com/eslint/eslint/issues/6571
             */
            code: unIndent`
                foo();
                // Line
                /* multiline
                  Line */
                bar();
                // trailing comment
            `,
            options: [2]
        },
        {
            code: unIndent`
                switch (foo) {
                  case bar:
                    baz();
                    // call the baz function
                }
            `,
            options: [2, { SwitchCase: 1 }]
        },
        {
            code: unIndent`
                switch (foo) {
                  case bar:
                    baz();
                  // no default
                }
            `,
            options: [2, { SwitchCase: 1 }]
        },
        unIndent`
            [
                // no elements
            ]
        `,
        {

            /*
             * Destructuring assignments:
             * https://github.com/eslint/eslint/issues/6813
             */
            code: unIndent`
                var {
                  foo,
                  bar,
                  baz: qux,
                  foobar: baz = foobar
                } = qux;
            `,
            options: [2]
        },
        {
            code: unIndent`
                var [
                  foo,
                  bar,
                  baz,
                  foobar = baz
                ] = qux;
            `,
            options: [2]
        },
        {
            code: unIndent`
                const {
                  a
                }
                =
                {
                  a: 1
                }
            `,
            options: [2]
        },
        {
            code: unIndent`
                const {
                  a
                } = {
                  a: 1
                }
            `,
            options: [2]
        },
        {
            code: unIndent`
                const
                  {
                    a
                  } = {
                    a: 1
                  };
            `,
            options: [2]
        },
        {
            code: unIndent`
                const
                  foo = {
                    bar: 1
                  }
            `,
            options: [2]
        },
        {
            code: unIndent`
                const [
                  a
                ] = [
                  1
                ]
            `,
            options: [2]
        },
        {

            // https://github.com/eslint/eslint/issues/7233
            code: unIndent`
                var folder = filePath
                    .foo()
                    .bar;
            `,
            options: [2, { MemberExpression: 2 }]
        },
        {
            code: unIndent`
                for (const foo of bar)
                  baz();
            `,
            options: [2]
        },
        {
            code: unIndent`
                var x = () =>
                  5;
            `,
            options: [2]
        },
        unIndent`
            (
                foo
            )(
                bar
            )
        `,
        unIndent`
            (() =>
                foo
            )(
                bar
            )
        `,
        unIndent`
            (() => {
                foo();
            })(
                bar
            )
        `,
        {

            // Don't lint the indentation of the first token after a :
            code: unIndent`
                ({code:
                  "foo.bar();"})
            `,
            options: [2]
        },
        {

            // Don't lint the indentation of the first token after a :
            code: unIndent`
                ({code:
                "foo.bar();"})
            `,
            options: [2]
        },
        unIndent`
            ({
                foo:
                    bar
            })
        `,
        unIndent`
            ({
                [foo]:
                    bar
            })
        `,
        {

            // Comments in switch cases
            code: unIndent`
                switch (foo) {
                  // comment
                  case study:
                    // comment
                    bar();
                  case closed:
                    /* multiline comment
                    */
                }
            `,
            options: [2, { SwitchCase: 1 }]
        },
        {

            // Comments in switch cases
            code: unIndent`
                switch (foo) {
                  // comment
                  case study:
                  // the comment can also be here
                  case closed:
                }
            `,
            options: [2, { SwitchCase: 1 }]
        },
        {

            // BinaryExpressions with parens
            code: unIndent`
                foo && (
                    bar
                )
            `,
            options: [4]
        },
        {

            // BinaryExpressions with parens
            code: unIndent`
                foo && ((
                    bar
                ))
            `,
            options: [4]
        },
        {
            code: unIndent`
                foo &&
                    (
                        bar
                    )
            `,
            options: [4]
        },
        unIndent`
            foo &&
                !bar(
                )
        `,
        unIndent`
            foo &&
                ![].map(() => {
                    bar();
                })
        `,
        {
            code: unIndent`
                foo =
                    bar;
            `,
            options: [4]
        },
        {
            code: unIndent`
                function foo() {
                  var bar = function(baz,
                        qux) {
                    foobar();
                  };
                }
            `,
            options: [2, { FunctionExpression: { parameters: 3 } }]
        },
        unIndent`
            function foo() {
                return (bar === 1 || bar === 2 &&
                    (/Function/.test(grandparent.type))) &&
                    directives(parent).indexOf(node) >= 0;
            }
        `,
        {
            code: unIndent`
                function foo() {
                    return (foo === bar || (
                        baz === qux && (
                            foo === foo ||
                            bar === bar ||
                            baz === baz
                        )
                    ))
                }
            `,
            options: [4]
        },
        unIndent`
            if (
                foo === 1 ||
                bar === 1 ||
                // comment
                (baz === 1 && qux === 1)
            ) {}
        `,
        {
            code: unIndent`
                foo =
                  (bar + baz);
            `,
            options: [2]
        },
        {
            code: unIndent`
                function foo() {
                  return (bar === 1 || bar === 2) &&
                    (z === 3 || z === 4);
                }
            `,
            options: [2]
        },
        {
            code: unIndent`
                /* comment */ if (foo) {
                  bar();
                }
            `,
            options: [2]
        },
        {

            // Comments at the end of if blocks that have `else` blocks can either refer to the lines above or below them
            code: unIndent`
                if (foo) {
                  bar();
                // Otherwise, if foo is false, do baz.
                // baz is very important.
                } else {
                  baz();
                }
            `,
            options: [2]
        },
        {
            code: unIndent`
                function foo() {
                  return ((bar === 1 || bar === 2) &&
                    (z === 3 || z === 4));
                }
            `,
            options: [2]
        },
        {
            code: unIndent`
                foo(
                  bar,
                  baz,
                  qux
                );
            `,
            options: [2, { CallExpression: { arguments: 1 } }]
        },
        {
            code: unIndent`
                foo(
                \tbar,
                \tbaz,
                \tqux
                );
            `,
            options: ["tab", { CallExpression: { arguments: 1 } }]
        },
        {
            code: unIndent`
                foo(bar,
                        baz,
                        qux);
            `,
            options: [4, { CallExpression: { arguments: 2 } }]
        },
        {
            code: unIndent`
                foo(
                bar,
                baz,
                qux
                );
            `,
            options: [2, { CallExpression: { arguments: 0 } }]
        },
        {
            code: unIndent`
                foo(bar,
                    baz,
                    qux
                );
            `,
            options: [2, { CallExpression: { arguments: "first" } }]
        },
        {
            code: unIndent`
                foo(bar, baz,
                    qux, barbaz,
                    barqux, bazqux);
            `,
            options: [2, { CallExpression: { arguments: "first" } }]
        },
        {
            code: unIndent`
                foo(bar,
                        1 + 2,
                        !baz,
                        new Car('!')
                );
            `,
            options: [2, { CallExpression: { arguments: 4 } }]
        },
        unIndent`
            foo(
                (bar)
            );
        `,
        {
            code: unIndent`
                foo(
                    (bar)
                );
            `,
            options: [4, { CallExpression: { arguments: 1 } }]
        },

        // https://github.com/eslint/eslint/issues/7484
        {
            code: unIndent`
                var foo = function() {
                  return bar(
                    [{
                    }].concat(baz)
                  );
                };
            `,
            options: [2]
        },

        // https://github.com/eslint/eslint/issues/7573
        {
            code: unIndent`
                return (
                    foo
                );
            `,
            parserOptions: { ecmaFeatures: { globalReturn: true } }
        },
        {
            code: unIndent`
                return (
                    foo
                )
            `,
            parserOptions: { ecmaFeatures: { globalReturn: true } }
        },
        unIndent`
            var foo = [
                bar,
                baz
            ]
        `,
        unIndent`
            var foo = [bar,
                baz,
                qux
            ]
        `,
        {
            code: unIndent`
                var foo = [bar,
                baz,
                qux
                ]
            `,
            options: [2, { ArrayExpression: 0 }]
        },
        {
            code: unIndent`
                var foo = [bar,
                                baz,
                                qux
                ]
            `,
            options: [2, { ArrayExpression: 8 }]
        },
        {
            code: unIndent`
                var foo = [bar,
                           baz,
                           qux
                ]
            `,
            options: [2, { ArrayExpression: "first" }]
        },
        {
            code: unIndent`
                var foo = [bar,
                           baz, qux
                ]
            `,
            options: [2, { ArrayExpression: "first" }]
        },
        {
            code: unIndent`
                var foo = [
                        { bar: 1,
                          baz: 2 },
                        { bar: 3,
                          baz: 4 }
                ]
            `,
            options: [4, { ArrayExpression: 2, ObjectExpression: "first" }]
        },
        {
            code: unIndent`
                var foo = {
                bar: 1,
                baz: 2
                };
            `,
            options: [2, { ObjectExpression: 0 }]
        },
        {
            code: unIndent`
                var foo = { foo: 1, bar: 2,
                            baz: 3 }
            `,
            options: [2, { ObjectExpression: "first" }]
        },
        {
            code: unIndent`
                var foo = [
                        {
                            foo: 1
                        }
                ]
            `,
            options: [4, { ArrayExpression: 2 }]
        },
        {
            code: unIndent`
                function foo() {
                  [
                          foo
                  ]
                }
            `,
            options: [2, { ArrayExpression: 4 }]
        },
        {
            code: "[\n]",
            options: [2, { ArrayExpression: "first" }]
        },
        {
            code: "[\n]",
            options: [2, { ArrayExpression: 1 }]
        },
        {
            code: "{\n}",
            options: [2, { ObjectExpression: "first" }]
        },
        {
            code: "{\n}",
            options: [2, { ObjectExpression: 1 }]
        },
        {
            code: unIndent`
                var foo = [
                  [
                    1
                  ]
                ]
            `,
            options: [2, { ArrayExpression: "first" }]
        },
        {
            code: unIndent`
                var foo = [ 1,
                            [
                              2
                            ]
                ];
            `,
            options: [2, { ArrayExpression: "first" }]
        },
        {
            code: unIndent`
                var foo = bar(1,
                              [ 2,
                                3
                              ]
                );
            `,
            options: [4, { ArrayExpression: "first", CallExpression: { arguments: "first" } }]
        },
        {
            code: unIndent`
                var foo =
                    [
                    ]()
            `,
            options: [4, { CallExpression: { arguments: "first" }, ArrayExpression: "first" }]
        },

        // https://github.com/eslint/eslint/issues/7732
        {
            code: unIndent`
                const lambda = foo => {
                  Object.assign({},
                    filterName,
                    {
                      display
                    }
                  );
                }
            `,
            options: [2, { ObjectExpression: 1 }]
        },
        {
            code: unIndent`
                const lambda = foo => {
                  Object.assign({},
                    filterName,
                    {
                      display
                    }
                  );
                }
            `,
            options: [2, { ObjectExpression: "first" }]
        },

        // https://github.com/eslint/eslint/issues/7733
        {
            code: unIndent`
                var foo = function() {
                \twindow.foo('foo',
                \t\t{
                \t\t\tfoo: 'bar',
                \t\t\tbar: {
                \t\t\t\tfoo: 'bar'
                \t\t\t}
                \t\t}
                \t);
                }
            `,
            options: ["tab"]
        },
        {
            code: unIndent`
                echo = spawn('cmd.exe',
                             ['foo', 'bar',
                              'baz']);
            `,
            options: [2, { ArrayExpression: "first", CallExpression: { arguments: "first" } }]
        },
        {
            code: unIndent`
                if (foo)
                  bar();
                // Otherwise, if foo is false, do baz.
                // baz is very important.
                else {
                  baz();
                }
            `,
            options: [2]
        },
        {
            code: unIndent`
                if (
                    foo && bar ||
                    baz && qux // This line is ignored because BinaryExpressions are not checked.
                ) {
                    qux();
                }
            `,
            options: [4]
        },
        unIndent`
            [
            ] || [
            ]
        `,
        unIndent`
            (
                [
                ] || [
                ]
            )
        `,
        unIndent`
            1
            + (
                1
            )
        `,
        unIndent`
            (
                foo && (
                    bar ||
                    baz
                )
            )
        `,
        unIndent`
            foo
                || (
                    bar
                )
        `,
        unIndent`
            foo
                            || (
                                bar
                            )
        `,
        {
            code: unIndent`
                var foo =
                        1;
            `,
            options: [4, { VariableDeclarator: 2 }]
        },
        {
            code: unIndent`
                var foo = 1,
                    bar =
                    2;
            `,
            options: [4]
        },
        {
            code: unIndent`
                switch (foo) {
                  case bar:
                  {
                    baz();
                  }
                }
            `,
            options: [2, { SwitchCase: 1 }]
        },

        // Template curlies
        {
            code: unIndent`
                \`foo\${
                  bar}\`
            `,
            options: [2]
        },
        {
            code: unIndent`
                \`foo\${
                  \`bar\${
                    baz}\`}\`
            `,
            options: [2]
        },
        {
            code: unIndent`
                \`foo\${
                  \`bar\${
                    baz
                  }\`
                }\`
            `,
            options: [2]
        },
        {
            code: unIndent`
                \`foo\${
                  (
                    bar
                  )
                }\`
            `,
            options: [2]
        },
        unIndent`
            foo(\`
                bar
            \`, {
                baz: 1
            });
        `,
        unIndent`
            function foo() {
                \`foo\${bar}baz\${
                    qux}foo\${
                    bar}baz\`
            }
        `,
        unIndent`
            JSON
                .stringify(
                    {
                        ok: true
                    }
                );
        `,

        // Don't check AssignmentExpression assignments
        unIndent`
            foo =
                bar =
                baz;
        `,
        unIndent`
            foo =
            bar =
                baz;
        `,
        unIndent`
            function foo() {
                const template = \`this indentation is not checked
            because it's part of a template literal.\`;
            }
        `,
        unIndent`
                function foo() {
                    const template = \`the indentation of a \${
                        node.type
                    } node is checked.\`;
                }
            `,
        {

            // https://github.com/eslint/eslint/issues/7320
            code: unIndent`
                JSON
                    .stringify(
                        {
                            test: 'test'
                        }
                    );
            `,
            options: [4, { CallExpression: { arguments: 1 } }]
        },
        unIndent`
            [
                foo,
                // comment
                // another comment
                bar
            ]
        `,
        unIndent`
            if (foo) {
                /* comment */ bar();
            }
        `,
        unIndent`
            function foo() {
                return (
                    1
                );
            }
        `,
        unIndent`
            function foo() {
                return (
                    1
                )
            }
        `,
        unIndent`
            if (
                foo &&
                !(
                    bar
                )
            ) {}
        `,
        {

            // https://github.com/eslint/eslint/issues/6007
            code: unIndent`
                var abc = [
                  (
                    ''
                  ),
                  def,
                ]
            `,
            options: [2]
        },
        {
            code: unIndent`
                var abc = [
                  (
                    ''
                  ),
                  (
                    'bar'
                  )
                ]
            `,
            options: [2]
        },
        unIndent`
            function f() {
                return asyncCall()
                    .then(
                        'some string',
                        [
                            1,
                            2,
                            3
                        ]
                    );
            }
        `,
        {

            // https://github.com/eslint/eslint/issues/6670
            code: unIndent`
                function f() {
                    return asyncCall()
                        .then(
                            'some string',
                            [
                                1,
                                2,
                                3
                            ]
                        );
                }
            `,
            options: [4, { MemberExpression: 1 }]
        },

        // https://github.com/eslint/eslint/issues/7242
        unIndent`
            var x = [
                [1],
                [2]
            ]
        `,
        unIndent`
            var y = [
                {a: 1},
                {b: 2}
            ]
        `,
        unIndent`
            foo(
            )
        `,
        {

            // https://github.com/eslint/eslint/issues/7616
            code: unIndent`
                foo(
                    bar,
                    {
                        baz: 1
                    }
                )
            `,
            options: [4, { CallExpression: { arguments: "first" } }]
        },
        "new Foo",
        "new (Foo)",
        unIndent`
            if (Foo) {
                new Foo
            }
        `,
        {
            code: unIndent`
                var foo = 0, bar = 0, baz = 0;
                export {
                    foo,
                    bar,
                    baz
                }
            `,
            parserOptions: { sourceType: "module" }
        },
        {
            code: unIndent`
                foo
                    ? bar
                    : baz
            `,
            options: [4, { flatTernaryExpressions: true }]
        },
        {
            code: unIndent`
                foo ?
                    bar :
                    baz
            `,
            options: [4, { flatTernaryExpressions: true }]
        },
        {
            code: unIndent`
                foo ?
                    bar
                    : baz
            `,
            options: [4, { flatTernaryExpressions: true }]
        },
        {
            code: unIndent`
                foo
                    ? bar :
                    baz
            `,
            options: [4, { flatTernaryExpressions: true }]
        },
        {
            code: unIndent`
                foo
                    ? bar
                    : baz
                        ? qux
                        : foobar
                            ? boop
                            : beep
            `,
            options: [4, { flatTernaryExpressions: true }]
        },
        {
            code: unIndent`
                foo ?
                    bar :
                    baz ?
                        qux :
                        foobar ?
                            boop :
                            beep
            `,
            options: [4, { flatTernaryExpressions: true }]
        },
        {
            code: unIndent`
                var a =
                    foo ? bar :
                    baz ? qux :
                    foobar ? boop :
                    /*else*/ beep
            `,
            options: [4, { flatTernaryExpressions: true }]
        },
        {
            code: unIndent`
                var a = foo
                    ? bar
                    : baz
            `,
            options: [4, { flatTernaryExpressions: true }]
        },
        {
            code: unIndent`
                var a =
                    foo
                        ? bar
                        : baz
            `,
            options: [4, { flatTernaryExpressions: true }]
        },
        {
            code: unIndent`
                a =
                    foo ? bar :
                    baz ? qux :
                    foobar ? boop :
                    /*else*/ beep
            `,
            options: [4, { flatTernaryExpressions: true }]
        },
        {
            code: unIndent`
                a = foo
                    ? bar
                    : baz
            `,
            options: [4, { flatTernaryExpressions: true }]
        },
        {
            code: unIndent`
                a =
                    foo
                        ? bar
                        : baz
            `,
            options: [4, { flatTernaryExpressions: true }]
        },
        {
            code: unIndent`
                foo(
                    foo ? bar :
                    baz ? qux :
                    foobar ? boop :
                    /*else*/ beep
                )
            `,
            options: [4, { flatTernaryExpressions: true }]
        },
        {
            code: unIndent`
                function wrap() {
                    return (
                        foo ? bar :
                        baz ? qux :
                        foobar ? boop :
                        /*else*/ beep
                    )
                }
            `,
            options: [4, { flatTernaryExpressions: true }]
        },
        {
            code: unIndent`
                function wrap() {
                    return foo
                        ? bar
                        : baz
                }
            `,
            options: [4, { flatTernaryExpressions: true }]
        },
        {
            code: unIndent`
                function wrap() {
                    return (
                        foo
                            ? bar
                            : baz
                    )
                }
            `,
            options: [4, { flatTernaryExpressions: true }]
        },
        {
            code: unIndent`
                foo(
                    foo
                        ? bar
                        : baz
                )
            `,
            options: [4, { flatTernaryExpressions: true }]
        },
        {
            code: unIndent`
                foo(foo
                    ? bar
                    : baz
                )
            `,
            options: [4, { flatTernaryExpressions: true }]
        },
        {
            code: unIndent`
                foo
                    ? bar
                    : baz
                        ? qux
                        : foobar
                            ? boop
                            : beep
            `,
            options: [4, { flatTernaryExpressions: false }]
        },
        {
            code: unIndent`
                foo ?
                    bar :
                    baz ?
                        qux :
                        foobar ?
                            boop :
                            beep
            `,
            options: [4, { flatTernaryExpressions: false }]
        },
        {
            code: "[,]",
            options: [2, { ArrayExpression: "first" }]
        },
        {
            code: "[,]",
            options: [2, { ArrayExpression: "off" }]
        },
        {
            code: unIndent`
                [
                    ,
                    foo
                ]
            `,
            options: [4, { ArrayExpression: "first" }]
        },
        {
            code: "[sparse, , array];",
            options: [2, { ArrayExpression: "first" }]
        },
        {
            code: unIndent`
                foo.bar('baz', function(err) {
                  qux;
                });
            `,
            options: [2, { CallExpression: { arguments: "first" } }]
        },
        {
            code: unIndent`
                foo.bar(function() {
                  cookies;
                }).baz(function() {
                  cookies;
                });
            `,
            options: [2, { MemberExpression: 1 }]
        },
        {
            code: unIndent`
                foo.bar().baz(function() {
                  cookies;
                }).qux(function() {
                  cookies;
                });
            `,
            options: [2, { MemberExpression: 1 }]
        },
        {
            code: unIndent`
                (
                  {
                    foo: 1,
                    baz: 2
                  }
                );
            `,
            options: [2, { ObjectExpression: "first" }]
        },
        {
            code: unIndent`
                foo(() => {
                    bar;
                }, () => {
                    baz;
                })
            `,
            options: [4, { CallExpression: { arguments: "first" } }]
        },
        {
            code: unIndent`
                [ foo,
                  bar ].forEach(function() {
                  baz;
                })
            `,
            options: [2, { ArrayExpression: "first", MemberExpression: 1 }]
        },
        unIndent`
            foo = bar[
                baz
            ];
        `,
        {
            code: unIndent`
                foo[
                    bar
                ];
            `,
            options: [4, { MemberExpression: 1 }]
        },
        {
            code: unIndent`
                foo[
                    (
                        bar
                    )
                ];
            `,
            options: [4, { MemberExpression: 1 }]
        },
        unIndent`
            if (foo)
                bar;
            else if (baz)
                qux;
        `,
        unIndent`
            if (foo) bar()

            ; [1, 2, 3].map(baz)
        `,
        unIndent`
            if (foo)
                ;
        `,
        "x => {}",
        {
            code: unIndent`
                import {foo}
                    from 'bar';
            `,
            parserOptions: { sourceType: "module" }
        },
        {
            code: "import 'foo'",
            parserOptions: { sourceType: "module" }
        },
        {
            code: unIndent`
                import { foo,
                    bar,
                    baz,
                } from 'qux';
            `,
            options: [4, { ImportDeclaration: 1 }],
            parserOptions: { sourceType: "module" }
        },
        {
            code: unIndent`
                import {
                    foo,
                    bar,
                    baz,
                } from 'qux';
            `,
            options: [4, { ImportDeclaration: 1 }],
            parserOptions: { sourceType: "module" }
        },
        {
            code: unIndent`
                import { apple as a,
                         banana as b } from 'fruits';
                import { cat } from 'animals';
            `,
            options: [4, { ImportDeclaration: "first" }],
            parserOptions: { sourceType: "module" }
        },
        {
            code: unIndent`
                import { declaration,
                                 can,
                                  be,
                              turned } from 'off';
            `,
            options: [4, { ImportDeclaration: "off" }],
            parserOptions: { sourceType: "module" }
        },

        // https://github.com/eslint/eslint/issues/8455
        unIndent`
            (
                a
            ) => b => {
                c
            }
        `,
        unIndent`
            (
                a
            ) => b => c => d => {
                e
            }
        `,
        unIndent`
            (
                a
            ) =>
                (
                    b
                ) => {
                    c
                }
        `,
        unIndent`
            if (
                foo
            ) bar(
                baz
            );
        `,
        unIndent`
            if (foo)
            {
                bar();
            }
        `,
        unIndent`
            function foo(bar)
            {
                baz();
            }
        `,
        unIndent`
            () =>
                ({})
        `,
        unIndent`
            () =>
                (({}))
        `,
        unIndent`
            (
                () =>
                    ({})
            )
        `,
        unIndent`
            var x = function foop(bar)
            {
                baz();
            }
        `,
        unIndent`
            var x = (bar) =>
            {
                baz();
            }
        `,
        unIndent`
            class Foo
            {
                constructor()
                {
                    foo();
                }

                bar()
                {
                    baz();
                }
            }
        `,
        unIndent`
            class Foo
                extends Bar
            {
                constructor()
                {
                    foo();
                }

                bar()
                {
                    baz();
                }
            }
        `,
        unIndent`
            (
                class Foo
                {
                    constructor()
                    {
                        foo();
                    }

                    bar()
                    {
                        baz();
                    }
                }
            )
        `,
        {
            code: unIndent`
                switch (foo)
                {
                    case 1:
                        bar();
                }
            `,
            options: [4, { SwitchCase: 1 }]
        },
        unIndent`
            foo
                .bar(function() {
                    baz
                })
        `,
        {
            code: unIndent`
                foo
                        .bar(function() {
                            baz
                        })
            `,
            options: [4, { MemberExpression: 2 }]
        },
        unIndent`
            foo
                [bar](function() {
                    baz
                })
        `,
        unIndent`
            foo.
                bar.
                baz
        `,
        {
            code: unIndent`
                foo
                    .bar(function() {
                        baz
                    })
            `,
            options: [4, { MemberExpression: "off" }]
        },
        {
            code: unIndent`
                foo
                                .bar(function() {
                                    baz
                                })
            `,
            options: [4, { MemberExpression: "off" }]
        },
        {
            code: unIndent`
                foo
                                [bar](function() {
                                    baz
                                })
            `,
            options: [4, { MemberExpression: "off" }]
        },
        {
            code: unIndent`
                  foo.
                          bar.
                                      baz
            `,
            options: [4, { MemberExpression: "off" }]
        },
        {
            code: unIndent`
                  foo = bar(
                  ).baz(
                  )
            `,
            options: [4, { MemberExpression: "off" }]
        },
        {
            code: unIndent`
                foo[
                    bar ? baz :
                    qux
                ]
            `,
            options: [4, { flatTernaryExpressions: true }]
        },
        {
            code: unIndent`
                function foo() {
                    return foo ? bar :
                        baz
                }
            `,
            options: [4, { flatTernaryExpressions: true }]
        },
        {
            code: unIndent`
                throw foo ? bar :
                    baz
            `,
            options: [4, { flatTernaryExpressions: true }]
        },
        {
            code: unIndent`
                foo(
                    bar
                ) ? baz :
                    qux
            `,
            options: [4, { flatTernaryExpressions: true }]
        },
        unIndent`
                foo
                    [
                        bar
                    ]
                    .baz(function() {
                        quz();
                    })
        `,
        unIndent`
                [
                    foo
                ][
                    "map"](function() {
                    qux();
                })
        `,
        unIndent`
            (
                a.b(function() {
                    c;
                })
            )
        `,
        unIndent`
            (
                foo
            ).bar(function() {
                baz();
            })
        `,
        unIndent`
            new Foo(
                bar
                    .baz
                    .qux
            )
        `,
        unIndent`
            const foo = a.b(),
                longName =
                    (baz(
                        'bar',
                        'bar'
                    ));
        `,
        unIndent`
            const foo = a.b(),
                longName =
                (baz(
                    'bar',
                    'bar'
                ));
        `,
        unIndent`
            const foo = a.b(),
                longName =
                    baz(
                        'bar',
                        'bar'
                    );
        `,
        unIndent`
            const foo = a.b(),
                longName =
                baz(
                    'bar',
                    'bar'
                );
        `,
        unIndent`
            const foo = a.b(),
                longName
                    = baz(
                        'bar',
                        'bar'
                    );
        `,
        unIndent`
            const foo = a.b(),
                longName
                = baz(
                    'bar',
                    'bar'
                );
        `,
        unIndent`
            const foo = a.b(),
                longName =
                    ('fff');
        `,
        unIndent`
            const foo = a.b(),
                longName =
                ('fff');
        `,
        unIndent`
            const foo = a.b(),
                longName
                    = ('fff');

        `,
        unIndent`
            const foo = a.b(),
                longName
                = ('fff');

        `,
        unIndent`
            const foo = a.b(),
                longName =
                    (
                        'fff'
                    );
        `,
        unIndent`
            const foo = a.b(),
                longName =
                (
                    'fff'
                );
        `,
        unIndent`
            const foo = a.b(),
                longName
                    =(
                        'fff'
                    );
        `,
        unIndent`
            const foo = a.b(),
                longName
                =(
                    'fff'
                );
        `,


        //----------------------------------------------------------------------
        // Ignore Unknown Nodes
        //----------------------------------------------------------------------

        {
            code: unIndent`
                interface Foo {
                    bar: string;
                    baz: number;
                }
            `,
            parser: parser("unknown-nodes/interface")
        },
        {
            code: unIndent`
                namespace Foo {
                    const bar = 3,
                        baz = 2;

                    if (true) {
                        const bax = 3;
                    }
                }
            `,
            parser: parser("unknown-nodes/namespace-valid")
        },
        {
            code: unIndent`
                abstract class Foo {
                    public bar() {
                        let aaa = 4,
                            boo;

                        if (true) {
                            boo = 3;
                        }

                        boo = 3 + 2;
                    }
                }
            `,
            parser: parser("unknown-nodes/abstract-class-valid")
        },
        {
            code: unIndent`
                function foo() {
                    function bar() {
                        abstract class X {
                            public baz() {
                                if (true) {
                                    qux();
                                }
                            }
                        }
                    }
                }
            `,
            parser: parser("unknown-nodes/functions-with-abstract-class-valid")
        },
        {
            code: unIndent`
                namespace Unknown {
                    function foo() {
                        function bar() {
                            abstract class X {
                                public baz() {
                                    if (true) {
                                        qux();
                                    }
                                }
                            }
                        }
                    }
                }
            `,
            parser: parser("unknown-nodes/namespace-with-functions-with-abstract-class-valid")
        },
        {
            code: unIndent`
                type httpMethod = 'GET'
                  | 'POST'
                  | 'PUT';
            `,
            options: [2, { VariableDeclarator: 0 }],
            parser: parser("unknown-nodes/variable-declarator-type-indent-two-spaces")
        },
        {
            code: unIndent`
                type httpMethod = 'GET'
                | 'POST'
                | 'PUT';
            `,
            options: [2, { VariableDeclarator: 1 }],
            parser: parser("unknown-nodes/variable-declarator-type-no-indent")
        },
        unIndent`
            foo(\`foo
                    \`, {
                ok: true
            },
            {
                ok: false
            })
        `,
        unIndent`
            foo(tag\`foo
                    \`, {
                ok: true
            },
            {
                ok: false
            }
            )
        `,

        // https://github.com/eslint/eslint/issues/8815
        unIndent`
            async function test() {
                const {
                    foo,
                    bar,
                } = await doSomethingAsync(
                    1,
                    2,
                    3,
                );
            }
        `,
        unIndent`
            function* test() {
                const {
                    foo,
                    bar,
                } = yield doSomethingAsync(
                    1,
                    2,
                    3,
                );
            }
        `,
        unIndent`
            ({
                a: b
            } = +foo(
                bar
            ));
        `,
        unIndent`
            const {
                foo,
                bar,
            } = typeof foo(
                1,
                2,
                3,
            );
        `,
        unIndent`
            const {
                foo,
                bar,
            } = +(
                foo
            );
        `,

        //----------------------------------------------------------------------
        // JSX tests
        // https://github.com/eslint/eslint/issues/8425
        // Some of the following tests are adapted from the the tests in eslint-plugin-react.
        // License: https://github.com/yannickcr/eslint-plugin-react/blob/7ca9841f22d599f447a27ef5b2a97def9229d6c8/LICENSE
        //----------------------------------------------------------------------

        "<Foo a=\"b\" c=\"d\"/>;",
        unIndent`
            <Foo
                a="b"
                c="d"
            />;
        `,
        "var foo = <Bar a=\"b\" c=\"d\"/>;",
        unIndent`
            var foo = <Bar
                a="b"
                c="d"
            />;
        `,
        unIndent`
            var foo = (<Bar
                a="b"
                c="d"
            />);
        `,
        unIndent`
            var foo = (
                <Bar
                    a="b"
                    c="d"
                />
            );
        `,
        unIndent`
            <
                Foo
                a="b"
                c="d"
            />;
        `,
        unIndent`
            <Foo
                a="b"
                c="d"/>;
        `,
        unIndent`
            <
                Foo
                a="b"
                c="d"/>;
        `,
        "<a href=\"foo\">bar</a>;",
        unIndent`
            <a href="foo">
                bar
            </a>;
        `,
        unIndent`
            <a
                href="foo"
            >
                bar
            </a>;
        `,
        unIndent`
            <a
                href="foo">
                bar
            </a>;
        `,
        unIndent`
            <
                a
                href="foo">
                bar
            </a>;
        `,
        unIndent`
            <a
                href="foo">
                bar
            </
                a>;
        `,
        unIndent`
            <a
                href="foo">
                bar
            </a
            >;
        `,
        unIndent`
                var foo = <a href="bar">
                    baz
                </a>;
            `,
        unIndent`
            var foo = <a
                href="bar"
            >
                baz
            </a>;
        `,
        unIndent`
            var foo = <a
                href="bar">
                baz
            </a>;
        `,
        unIndent`
            var foo = <
                a
                href="bar">
                baz
            </a>;
        `,
        unIndent`
            var foo = <a
                href="bar">
                baz
            </
                a>;
        `,
        unIndent`
            var foo = <a
                href="bar">
                baz
            </a
            >
        `,
        unIndent`
            var foo = (<a
                href="bar">
                baz
            </a>);
        `,
        unIndent`
            var foo = (
                <a href="bar">baz</a>
            );
        `,
        unIndent`
            var foo = (
                <a href="bar">
                    baz
                </a>
            );
        `,
        unIndent`
            var foo = (
                <a
                    href="bar">
                    baz
                </a>
            );
        `,
        "var foo = <a href=\"bar\">baz</a>;",
        unIndent`
            <a>
                {
                }
            </a>
        `,
        unIndent`
            <a>
                {
                    foo
                }
            </a>
        `,
        unIndent`
            function foo() {
                return (
                    <a>
                        {
                            b.forEach(() => {
                                // comment
                                a = c
                                    .d()
                                    .e();
                            })
                        }
                    </a>
                );
            }
        `,
        "<App></App>",
        unIndent`
            <App>
            </App>
        `,
        {
            code: unIndent`
                <App>
                  <Foo />
                </App>
            `,
            options: [2]
        },
        {
            code: unIndent`
                <App>
                <Foo />
                </App>
            `,
            options: [0]
        },
        {
            code: unIndent`
                <App>
                \t<Foo />
                </App>
            `,
            options: ["tab"]
        },
        {
            code: unIndent`
                function App() {
                  return <App>
                    <Foo />
                  </App>;
                }
            `,
            options: [2]
        },
        {
            code: unIndent`
                function App() {
                  return (<App>
                    <Foo />
                  </App>);
                }
            `,
            options: [2]
        },
        {
            code: unIndent`
                function App() {
                  return (
                    <App>
                      <Foo />
                    </App>
                  );
                }
            `,
            options: [2]
        },
        {
            code: unIndent`
                it(
                  (
                    <div>
                      <span />
                    </div>
                  )
                )
            `,
            options: [2]
        },
        {
            code: unIndent`
                it(
                  (<div>
                    <span />
                    <span />
                    <span />
                  </div>)
                )
            `,
            options: [2]
        },
        {
            code: unIndent`
                (
                  <div>
                    <span />
                  </div>
                )
            `,
            options: [2]
        },
        {
            code: unIndent`
                {
                  head.title &&
                  <h1>
                    {head.title}
                  </h1>
                }
            `,
            options: [2]
        },
        {
            code: unIndent`
                {
                  head.title &&
                    <h1>
                      {head.title}
                    </h1>
                }
            `,
            options: [2]
        },
        {
            code: unIndent`
                {
                  head.title && (
                    <h1>
                      {head.title}
                    </h1>)
                }
            `,
            options: [2]
        },
        {
            code: unIndent`
                {
                  head.title && (
                    <h1>
                      {head.title}
                    </h1>
                  )
                }
            `,
            options: [2]
        },
        {
            code: unIndent`
                [
                  <div />,
                  <div />
                ]
            `,
            options: [2]
        },
        unIndent`
            <div>
                {
                    [
                        <Foo />,
                        <Bar />
                    ]
                }
            </div>
        `,
        unIndent`
            <div>
                {foo &&
                    [
                        <Foo />,
                        <Bar />
                    ]
                }
            </div>
        `,
        unIndent`
            <div>
            bar <div>
                bar
                bar {foo}
            bar </div>
            </div>
        `,
        unIndent`
            foo ?
                <Foo /> :
                <Bar />
        `,
        unIndent`
            foo ?
                <Foo />
                : <Bar />
        `,
        unIndent`
            foo ?
                <Foo />
                :
                <Bar />
        `,
        unIndent`
            <div>
                {!foo ?
                    <Foo
                        onClick={this.onClick}
                    />
                    :
                    <Bar
                        onClick={this.onClick}
                    />
                }
            </div>
        `,
        {
            code: unIndent`
                <span>
                  {condition ?
                    <Thing
                      foo={\`bar\`}
                    /> :
                    <Thing/>
                  }
                </span>
            `,
            options: [2]
        },
        {
            code: unIndent`
                <span>
                  {condition ?
                    <Thing
                      foo={"bar"}
                    /> :
                    <Thing/>
                  }
                </span>
            `,
            options: [2]
        },
        {
            code: unIndent`
                function foo() {
                  <span>
                    {condition ?
                      <Thing
                        foo={bar}
                      /> :
                      <Thing/>
                    }
                  </span>
                }
            `,
            options: [2]
        },
        unIndent`
              <App foo
              />
            `,
        {
            code: unIndent`
              <App
                foo
              />
            `,
            options: [2]
        },
        {
            code: unIndent`
              <App
              foo
              />
            `,
            options: [0]
        },
        {
            code: unIndent`
              <App
              \tfoo
              />
            `,
            options: ["tab"]
        },
        unIndent`
                <App
                    foo
                />
            `,
        unIndent`
                <App
                    foo
                ></App>
            `,
        {
            code: unIndent`
                <App
                  foo={function() {
                    console.log('bar');
                  }}
                />
            `,
            options: [2]
        },
        {
            code: unIndent`
                <App foo={function() {
                  console.log('bar');
                }}
                />
            `,
            options: [2]
        },
        {
            code: unIndent`
                var x = function() {
                  return <App
                    foo={function() {
                      console.log('bar');
                    }}
                  />
                }
            `,
            options: [2]
        },
        {
            code: unIndent`
                var x = <App
                  foo={function() {
                    console.log('bar');
                  }}
                />
            `,
            options: [2]
        },
        {
            code: unIndent`
                <Provider
                  store
                >
                  <App
                    foo={function() {
                      console.log('bar');
                    }}
                  />
                </Provider>
            `,
            options: [2]
        },
        {
            code: unIndent`
                <Provider
                  store
                >
                  {baz && <App
                    foo={function() {
                      console.log('bar');
                    }}
                  />}
                </Provider>
            `,
            options: [2]
        },
        {
            code: unIndent`
                <App
                \tfoo
                />
            `,
            options: ["tab"]
        },
        {
            code: unIndent`
                <App
                \tfoo
                ></App>
            `,
            options: ["tab"]
        },
        {
            code: unIndent`
                <App foo={function() {
                \tconsole.log('bar');
                }}
                />
            `,
            options: ["tab"]
        },
        {
            code: unIndent`
                var x = <App
                \tfoo={function() {
                \t\tconsole.log('bar');
                \t}}
                />
            `,
            options: ["tab"]
        },
        unIndent`
                <App
                    foo />
            `,
        unIndent`
                <div>
                   unrelated{
                        foo
                    }
                </div>
            `,
        unIndent`
                <div>unrelated{
                    foo
                }
                </div>
            `,
        unIndent`
                <
                    foo
                        .bar
                        .baz
                >
                    foo
                </
                    foo.
                        bar.
                        baz
                >
            `,
        unIndent`
                <
                    input
                    type=
                        "number"
                />
            `,
        unIndent`
                <
                    input
                    type=
                        {'number'}
                />
            `,
        unIndent`
                <
                    input
                    type
                        ="number"
                />
            `,
        unIndent`
                foo ? (
                    bar
                ) : (
                    baz
                )
            `,
        unIndent`
                foo ? (
                    <div>
                    </div>
                ) : (
                    <span>
                    </span>
                )
            `,
        unIndent`
                <div>
                    {
                        /* foo */
                    }
                </div>
            `,

        // https://github.com/eslint/eslint/issues/8832
        unIndent`
                <div>
                    {
                        (
                            1
                        )
                    }
                </div>
            `,
        unIndent`
                function A() {
                    return (
                        <div>
                            {
                                b && (
                                    <div>
                                    </div>
                                )
                            }
                        </div>
                    );
                }
            `,
        unIndent`
            <div>foo
                <div>bar</div>
            </div>
        `,
        unIndent`
            <small>Foo bar&nbsp;
                <a>baz qux</a>.
            </small>
        `,
        {
            code: unIndent`
                a(b
                  , c
                )
            `,
            options: [2, { CallExpression: { arguments: "off" } }]
        },
        {
            code: unIndent`
                a(
                  new B({
                    c,
                  })
                );
            `,
            options: [2, { CallExpression: { arguments: "off" } }]
        },
        {
            code: unIndent`
                foo
                ? bar
                            : baz
            `,
            options: [4, { ignoredNodes: ["ConditionalExpression"] }]
        },
        {
            code: unIndent`
                class Foo {
                foo() {
                    bar();
                }
                }
            `,
            options: [4, { ignoredNodes: ["ClassBody"] }]
        },
        {
            code: unIndent`
                class Foo {
                foo() {
                bar();
                }
                }
            `,
            options: [4, { ignoredNodes: ["ClassBody", "BlockStatement"] }]
        },
        {
            code: unIndent`
                foo({
                        bar: 1
                    },
                    {
                        baz: 2
                    },
                    {
                        qux: 3
                })
            `,
            options: [4, { ignoredNodes: ["CallExpression > ObjectExpression"] }]
        },
        {
            code: unIndent`
                foo
                                            .bar
            `,
            options: [4, { ignoredNodes: ["MemberExpression"] }]
        },
        {
            code: unIndent`
                $(function() {

                foo();
                bar();

                });
            `,
            options: [4, {
                ignoredNodes: ["Program > ExpressionStatement > CallExpression[callee.name='$'] > FunctionExpression > BlockStatement"]
            }]
        },
        {
            code: unIndent`
                <Foo
                            bar="1" />
            `,
            options: [4, { ignoredNodes: ["JSXOpeningElement"] }]
        },
        {
            code: unIndent`
                foo &&
                <Bar
                >
                </Bar>
            `,
            options: [4, { ignoredNodes: ["JSXElement", "JSXOpeningElement"] }]
        },
        {
            code: unIndent`
                (function($) {
                $(function() {
                    foo;
                });
                }())
            `,
            options: [4, { ignoredNodes: ["ExpressionStatement > CallExpression > FunctionExpression.callee > BlockStatement"] }]
        },
        {
            code: unIndent`
                const value = (
                    condition ?
                    valueIfTrue :
                    valueIfFalse
                );
            `,
            options: [4, { ignoredNodes: ["ConditionalExpression"] }]
        },
        {
            code: unIndent`
                var a = 0, b = 0, c = 0;
                export default foo(
                    a,
                    b, {
                    c
                    }
                )
            `,
            options: [4, { ignoredNodes: ["ExportDefaultDeclaration > CallExpression > ObjectExpression"] }],
            parserOptions: { sourceType: "module" }
        },
        {
            code: unIndent`
                foobar = baz
                       ? qux
                       : boop
            `,
            options: [4, { ignoredNodes: ["ConditionalExpression"] }]
        },
        {
            code: unIndent`
                \`
                    SELECT
                        \${
                            foo
                        } FROM THE_DATABASE
                \`
            `,
            options: [4, { ignoredNodes: ["TemplateLiteral"] }]
        },
        {
            code: unIndent`
                <foo
                    prop='bar'
                    >
                    Text
                </foo>
            `,
            options: [4, { ignoredNodes: ["JSXOpeningElement"] }]
        },
        {
            code: unIndent`
                {
                \tvar x = 1,
                \t    y = 2;
                }
            `,
            options: ["tab"]
        },
        {
            code: unIndent`
                var x = 1,
                    y = 2;
                var z;
            `,
            options: ["tab", { ignoredNodes: ["VariableDeclarator"] }]
        },
        {
            code: unIndent`
                [
                    foo(),
                    bar
                ]
            `,
            options: ["tab", { ArrayExpression: "first", ignoredNodes: ["CallExpression"] }]
        },
        {
            code: unIndent`
                if (foo) {
                    doSomething();

                // Intentionally unindented comment
                    doSomethingElse();
                }
            `,
            options: [4, { ignoreComments: true }]
        },
        {
            code: unIndent`
                if (foo) {
                    doSomething();

                /* Intentionally unindented comment */
                    doSomethingElse();
                }
            `,
            options: [4, { ignoreComments: true }]
        },
        unIndent`
            const obj = {
                foo () {
                    return condition ? // comment
                        1 :
                        2
                }
            }
        `,

        //----------------------------------------------------------------------
        // Comment alignment tests
        //----------------------------------------------------------------------
        unIndent`
            if (foo) {
            // Comment can align with code immediately above even if "incorrect" alignment
                doSomething();
            }
        `,
        unIndent`
            if (foo) {
                doSomething();
            // Comment can align with code immediately below even if "incorrect" alignment
            }
        `,
        unIndent`
            if (foo) {
                // Comment can be in correct alignment even if not aligned with code above/below
            }
        `,
        unIndent`
            if (foo) {

                // Comment can be in correct alignment even if gaps between (and not aligned with) code above/below

            }
        `,
        unIndent`
            [{
                foo
            },

            // Comment between nodes

            {
                bar
            }];
        `,
        unIndent`
            [{
                foo
            },

            // Comment between nodes

            { // comment
                bar
            }];
        `
    ],

    invalid: [
        {
            code: unIndent`
                var a = b;
                if (a) {
                b();
                }
            `,
            output: unIndent`
                var a = b;
                if (a) {
                  b();
                }
            `,
            options: [2],
            errors: expectedErrors([[3, 2, 0, "Identifier"]])
        },
        {
            code: unIndent`
                require('http').request({hostname: 'localhost',
                                  port: 80}, function(res) {
                    res.end();
                  });
            `,
            output: unIndent`
                require('http').request({hostname: 'localhost',
                  port: 80}, function(res) {
                  res.end();
                });
            `,
            options: [2],
            errors: expectedErrors([[2, 2, 18, "Identifier"], [3, 2, 4, "Identifier"], [4, 0, 2, "Punctuator"]])
        },
        {
            code: unIndent`
                if (array.some(function(){
                  return true;
                })) {
                a++; // ->
                  b++;
                    c++; // <-
                }
            `,
            output: unIndent`
                if (array.some(function(){
                  return true;
                })) {
                  a++; // ->
                  b++;
                  c++; // <-
                }
            `,
            options: [2],
            errors: expectedErrors([[4, 2, 0, "Identifier"], [6, 2, 4, "Identifier"]])
        },
        {
            code: unIndent`
                if (a){
                \tb=c;
                \t\tc=d;
                e=f;
                }
            `,
            output: unIndent`
                if (a){
                \tb=c;
                \tc=d;
                \te=f;
                }
            `,
            options: ["tab"],
            errors: expectedErrors("tab", [[3, 1, 2, "Identifier"], [4, 1, 0, "Identifier"]])
        },
        {
            code: unIndent`
                if (a){
                    b=c;
                      c=d;
                 e=f;
                }
            `,
            output: unIndent`
                if (a){
                    b=c;
                    c=d;
                    e=f;
                }
            `,
            options: [4],
            errors: expectedErrors([[3, 4, 6, "Identifier"], [4, 4, 1, "Identifier"]])
        },
        {
            code: fixture,
            output: fixedFixture,
            options: [2, { SwitchCase: 1, MemberExpression: 1, CallExpression: { arguments: "off" } }],
            errors: expectedErrors([
                [5, 2, 4, "Keyword"],
                [6, 2, 0, "Line"],
                [10, 4, 6, "Punctuator"],
                [11, 2, 4, "Punctuator"],

                [15, 4, 2, "Identifier"],
                [16, 2, 4, "Punctuator"],
                [23, 2, 4, "Punctuator"],
                [29, 2, 4, "Keyword"],
                [30, 4, 6, "Identifier"],
                [36, 4, 6, "Identifier"],
                [38, 2, 4, "Punctuator"],
                [39, 4, 2, "Identifier"],
                [40, 2, 0, "Punctuator"],
                [54, 2, 4, "Punctuator"],
                [114, 4, 2, "Keyword"],
                [120, 4, 6, "Keyword"],
                [124, 4, 2, "Keyword"],
                [134, 4, 6, "Keyword"],
                [138, 2, 3, "Punctuator"],
                [139, 2, 3, "Punctuator"],
                [143, 4, 0, "Identifier"],
                [144, 6, 2, "Punctuator"],
                [145, 6, 2, "Punctuator"],
                [151, 4, 6, "Identifier"],
                [152, 6, 8, "Punctuator"],
                [153, 6, 8, "Punctuator"],
                [159, 4, 2, "Identifier"],
                [161, 4, 6, "Identifier"],
                [175, 2, 0, "Identifier"],
                [177, 2, 4, "Identifier"],
                [189, 2, 0, "Keyword"],
                [192, 6, 18, "Identifier"],
                [193, 6, 4, "Identifier"],
                [195, 6, 8, "Identifier"],
                [228, 5, 4, "Identifier"],
                [231, 3, 2, "Punctuator"],
                [245, 0, 2, "Punctuator"],
                [248, 0, 2, "Punctuator"],
                [304, 4, 6, "Identifier"],
                [306, 4, 8, "Identifier"],
                [307, 2, 4, "Punctuator"],
                [308, 2, 4, "Identifier"],
                [311, 4, 6, "Identifier"],
                [312, 4, 6, "Identifier"],
                [313, 4, 6, "Identifier"],
                [314, 2, 4, "Punctuator"],
                [315, 2, 4, "Identifier"],
                [318, 4, 6, "Identifier"],
                [319, 4, 6, "Identifier"],
                [320, 4, 6, "Identifier"],
                [321, 2, 4, "Punctuator"],
                [322, 2, 4, "Identifier"],
                [326, 2, 1, "Numeric"],
                [327, 2, 1, "Numeric"],
                [328, 2, 1, "Numeric"],
                [329, 2, 1, "Numeric"],
                [330, 2, 1, "Numeric"],
                [331, 2, 1, "Numeric"],
                [332, 2, 1, "Numeric"],
                [333, 2, 1, "Numeric"],
                [334, 2, 1, "Numeric"],
                [335, 2, 1, "Numeric"],
                [340, 2, 4, "Identifier"],
                [341, 2, 0, "Identifier"],
                [344, 2, 4, "Identifier"],
                [345, 2, 0, "Identifier"],
                [348, 2, 4, "Identifier"],
                [349, 2, 0, "Identifier"],
                [355, 2, 0, "Identifier"],
                [357, 2, 4, "Identifier"],
                [361, 4, 6, "Identifier"],
                [362, 2, 4, "Punctuator"],
                [363, 2, 4, "Identifier"],
                [368, 2, 0, "Keyword"],
                [370, 2, 4, "Keyword"],
                [374, 4, 6, "Keyword"],
                [376, 4, 2, "Keyword"],
                [383, 2, 0, "Identifier"],
                [385, 2, 4, "Identifier"],
                [390, 2, 0, "Identifier"],
                [392, 2, 4, "Identifier"],
                [409, 2, 0, "Identifier"],
                [410, 2, 4, "Identifier"],
                [416, 2, 0, "Identifier"],
                [417, 2, 4, "Identifier"],
                [418, 0, 4, "Punctuator"],
                [422, 2, 4, "Identifier"],
                [423, 2, 0, "Identifier"],
                [427, 2, 6, "Identifier"],
                [428, 2, 8, "Identifier"],
                [429, 2, 4, "Identifier"],
                [430, 0, 4, "Punctuator"],
                [433, 2, 4, "Identifier"],
                [434, 0, 4, "Punctuator"],
                [437, 2, 0, "Identifier"],
                [438, 0, 4, "Punctuator"],
                [442, 2, 4, "Identifier"],
                [443, 2, 4, "Identifier"],
                [444, 0, 2, "Punctuator"],
                [451, 2, 0, "Identifier"],
                [453, 2, 4, "Identifier"],
                [499, 6, 8, "Punctuator"],
                [500, 8, 6, "Identifier"],
                [504, 4, 6, "Punctuator"],
                [505, 6, 8, "Identifier"],
                [506, 4, 8, "Punctuator"]
            ])
        },
        {
            code: unIndent`
                switch(value){
                    case "1":
                        a();
                    break;
                    case "2":
                        a();
                    break;
                    default:
                        a();
                        break;
                }
            `,
            output: unIndent`
                switch(value){
                    case "1":
                        a();
                        break;
                    case "2":
                        a();
                        break;
                    default:
                        a();
                        break;
                }
            `,
            options: [4, { SwitchCase: 1 }],
            errors: expectedErrors([[4, 8, 4, "Keyword"], [7, 8, 4, "Keyword"]])
        },
        {
            code: unIndent`
                var x = 0 &&
                    {
                       a: 1,
                          b: 2
                    };
            `,
            output: unIndent`
                var x = 0 &&
                    {
                        a: 1,
                        b: 2
                    };
            `,
            options: [4],
            errors: expectedErrors([[3, 8, 7, "Identifier"], [4, 8, 10, "Identifier"]])
        },
        {
            code: unIndent`
                switch(value){
                    case "1":
                        a();
                        break;
                    case "2":
                        a();
                        break;
                    default:
                    break;
                }
            `,
            output: unIndent`
                switch(value){
                    case "1":
                        a();
                        break;
                    case "2":
                        a();
                        break;
                    default:
                        break;
                }
            `,
            options: [4, { SwitchCase: 1 }],
            errors: expectedErrors([9, 8, 4, "Keyword"])
        },
        {
            code: unIndent`
                switch(value){
                    case "1":
                    case "2":
                        a();
                        break;
                    default:
                        break;
                }
                switch(value){
                    case "1":
                    break;
                    case "2":
                        a();
                    break;
                    default:
                        a();
                    break;
                }
            `,
            output: unIndent`
                switch(value){
                    case "1":
                    case "2":
                        a();
                        break;
                    default:
                        break;
                }
                switch(value){
                    case "1":
                        break;
                    case "2":
                        a();
                        break;
                    default:
                        a();
                        break;
                }
            `,
            options: [4, { SwitchCase: 1 }],
            errors: expectedErrors([[11, 8, 4, "Keyword"], [14, 8, 4, "Keyword"], [17, 8, 4, "Keyword"]])
        },
        {
            code: unIndent`
                switch(value){
                case "1":
                        a();
                        break;
                    case "2":
                        break;
                    default:
                        break;
                }
            `,
            output: unIndent`
                switch(value){
                case "1":
                    a();
                    break;
                case "2":
                    break;
                default:
                    break;
                }
            `,
            options: [4],
            errors: expectedErrors([
                [3, 4, 8, "Identifier"],
                [4, 4, 8, "Keyword"],
                [5, 0, 4, "Keyword"],
                [6, 4, 8, "Keyword"],
                [7, 0, 4, "Keyword"],
                [8, 4, 8, "Keyword"]
            ])
        },
        {
            code: unIndent`
                var obj = {foo: 1, bar: 2};
                with (obj) {
                console.log(foo + bar);
                }
            `,
            output: unIndent`
                var obj = {foo: 1, bar: 2};
                with (obj) {
                    console.log(foo + bar);
                }
            `,
            errors: expectedErrors([3, 4, 0, "Identifier"])
        },
        {
            code: unIndent`
                switch (a) {
                case '1':
                b();
                break;
                default:
                c();
                break;
                }
            `,
            output: unIndent`
                switch (a) {
                    case '1':
                        b();
                        break;
                    default:
                        c();
                        break;
                }
            `,
            options: [4, { SwitchCase: 1 }],
            errors: expectedErrors([
                [2, 4, 0, "Keyword"],
                [3, 8, 0, "Identifier"],
                [4, 8, 0, "Keyword"],
                [5, 4, 0, "Keyword"],
                [6, 8, 0, "Identifier"],
                [7, 8, 0, "Keyword"]
            ])
        },
        {
            code: unIndent`
                var foo = function(){
                    foo
                          .bar
                }
            `,
            output: unIndent`
                var foo = function(){
                    foo
                        .bar
                }
            `,
            options: [4, { MemberExpression: 1 }],
            errors: expectedErrors(
                [3, 8, 10, "Punctuator"]
            )
        },
        {
            code: unIndent`
                (
                    foo
                    .bar
                )
            `,
            output: unIndent`
                (
                    foo
                        .bar
                )
            `,
            errors: expectedErrors([3, 8, 4, "Punctuator"])
        },
        {
            code: unIndent`
                var foo = function(){
                    foo
                             .bar
                }
            `,
            output: unIndent`
                var foo = function(){
                    foo
                            .bar
                }
            `,
            options: [4, { MemberExpression: 2 }],
            errors: expectedErrors(
                [3, 12, 13, "Punctuator"]
            )
        },
        {
            code: unIndent`
                var foo = () => {
                    foo
                             .bar
                }
            `,
            output: unIndent`
                var foo = () => {
                    foo
                            .bar
                }
            `,
            options: [4, { MemberExpression: 2 }],
            errors: expectedErrors(
                [3, 12, 13, "Punctuator"]
            )
        },
        {
            code: unIndent`
                TestClass.prototype.method = function () {
                  return Promise.resolve(3)
                      .then(function (x) {
                      return x;
                    });
                };
            `,
            output: unIndent`
                TestClass.prototype.method = function () {
                  return Promise.resolve(3)
                    .then(function (x) {
                      return x;
                    });
                };
            `,
            options: [2, { MemberExpression: 1 }],
            errors: expectedErrors([3, 4, 6, "Punctuator"])
        },
        {
            code: unIndent`
                while (a)
                b();
            `,
            output: unIndent`
                while (a)
                    b();
            `,
            options: [4],
            errors: expectedErrors([
                [2, 4, 0, "Identifier"]
            ])
        },
        {
            code: unIndent`
                lmn = [{
                        a: 1
                    },
                    {
                        b: 2
                    },
                    {
                        x: 2
                }];
            `,
            output: unIndent`
                lmn = [{
                    a: 1
                },
                {
                    b: 2
                },
                {
                    x: 2
                }];
            `,
            errors: expectedErrors([
                [2, 4, 8, "Identifier"],
                [3, 0, 4, "Punctuator"],
                [4, 0, 4, "Punctuator"],
                [5, 4, 8, "Identifier"],
                [6, 0, 4, "Punctuator"],
                [7, 0, 4, "Punctuator"],
                [8, 4, 8, "Identifier"]
            ])
        },
        {
            code: unIndent`
                for (var foo = 1;
                foo < 10;
                foo++) {}
            `,
            output: unIndent`
                for (var foo = 1;
                    foo < 10;
                    foo++) {}
            `,
            errors: expectedErrors([[2, 4, 0, "Identifier"], [3, 4, 0, "Identifier"]])
        },
        {
            code: unIndent`
                for (
                var foo = 1;
                foo < 10;
                foo++
                    ) {}
            `,
            output: unIndent`
                for (
                    var foo = 1;
                    foo < 10;
                    foo++
                ) {}
            `,
            errors: expectedErrors([[2, 4, 0, "Keyword"], [3, 4, 0, "Identifier"], [4, 4, 0, "Identifier"], [5, 0, 4, "Punctuator"]])
        },
        {
            code: unIndent`
                for (;;)
                b();
            `,
            output: unIndent`
                for (;;)
                    b();
            `,
            options: [4],
            errors: expectedErrors([
                [2, 4, 0, "Identifier"]
            ])
        },
        {
            code: unIndent`
                for (a in x)
                b();
            `,
            output: unIndent`
                for (a in x)
                    b();
            `,
            options: [4],
            errors: expectedErrors([
                [2, 4, 0, "Identifier"]
            ])
        },
        {
            code: unIndent`
                do
                b();
                while(true)
            `,
            output: unIndent`
                do
                    b();
                while(true)
            `,
            options: [4],
            errors: expectedErrors([
                [2, 4, 0, "Identifier"]
            ])
        },
        {
            code: unIndent`
                if(true)
                b();
            `,
            output: unIndent`
                if(true)
                    b();
            `,
            options: [4],
            errors: expectedErrors([
                [2, 4, 0, "Identifier"]
            ])
        },
        {
            code: unIndent`
                var test = {
                      a: 1,
                    b: 2
                    };
            `,
            output: unIndent`
                var test = {
                  a: 1,
                  b: 2
                };
            `,
            options: [2],
            errors: expectedErrors([
                [2, 2, 6, "Identifier"],
                [3, 2, 4, "Identifier"],
                [4, 0, 4, "Punctuator"]
            ])
        },
        {
            code: unIndent`
                var a = function() {
                      a++;
                    b++;
                          c++;
                    },
                    b;
            `,
            output: unIndent`
                var a = function() {
                        a++;
                        b++;
                        c++;
                    },
                    b;
            `,
            options: [4],
            errors: expectedErrors([
                [2, 8, 6, "Identifier"],
                [3, 8, 4, "Identifier"],
                [4, 8, 10, "Identifier"]
            ])
        },
        {
            code: unIndent`
                var a = 1,
                b = 2,
                c = 3;
            `,
            output: unIndent`
                var a = 1,
                    b = 2,
                    c = 3;
            `,
            options: [4],
            errors: expectedErrors([
                [2, 4, 0, "Identifier"],
                [3, 4, 0, "Identifier"]
            ])
        },
        {
            code: unIndent`
                [a, b,
                    c].forEach((index) => {
                        index;
                    });
            `,
            output: unIndent`
                [a, b,
                    c].forEach((index) => {
                    index;
                });
            `,
            options: [4],
            errors: expectedErrors([
                [3, 4, 8, "Identifier"],
                [4, 0, 4, "Punctuator"]
            ])
        },
        {
            code: unIndent`
                [a, b,
                c].forEach(function(index){
                  return index;
                });
            `,
            output: unIndent`
                [a, b,
                    c].forEach(function(index){
                    return index;
                });
            `,
            options: [4],
            errors: expectedErrors([
                [2, 4, 0, "Identifier"],
                [3, 4, 2, "Keyword"]
            ])
        },
        {
            code: unIndent`
                [a, b, c].forEach(function(index){
                  return index;
                });
            `,
            output: unIndent`
                [a, b, c].forEach(function(index){
                    return index;
                });
            `,
            options: [4],
            errors: expectedErrors([
                [2, 4, 2, "Keyword"]
            ])
        },
        {
            code: unIndent`
                (foo)
                    .bar([
                    baz
                ]);
            `,
            output: unIndent`
                (foo)
                    .bar([
                        baz
                    ]);
            `,
            options: [4, { MemberExpression: 1 }],
            errors: expectedErrors([[3, 8, 4, "Identifier"], [4, 4, 0, "Punctuator"]])
        },
        {
            code: unIndent`
                var x = ['a',
                         'b',
                         'c'
                ];
            `,
            output: unIndent`
                var x = ['a',
                    'b',
                    'c'
                ];
            `,
            options: [4],
            errors: expectedErrors([
                [2, 4, 9, "String"],
                [3, 4, 9, "String"]
            ])
        },
        {
            code: unIndent`
                var x = [
                         'a',
                         'b',
                         'c'
                ];
            `,
            output: unIndent`
                var x = [
                    'a',
                    'b',
                    'c'
                ];
            `,
            options: [4],
            errors: expectedErrors([
                [2, 4, 9, "String"],
                [3, 4, 9, "String"],
                [4, 4, 9, "String"]
            ])
        },
        {
            code: unIndent`
                var x = [
                         'a',
                         'b',
                         'c',
                'd'];
            `,
            output: unIndent`
                var x = [
                    'a',
                    'b',
                    'c',
                    'd'];
            `,
            options: [4],
            errors: expectedErrors([
                [2, 4, 9, "String"],
                [3, 4, 9, "String"],
                [4, 4, 9, "String"],
                [5, 4, 0, "String"]
            ])
        },
        {
            code: unIndent`
                var x = [
                         'a',
                         'b',
                         'c'
                  ];
            `,
            output: unIndent`
                var x = [
                    'a',
                    'b',
                    'c'
                ];
            `,
            options: [4],
            errors: expectedErrors([
                [2, 4, 9, "String"],
                [3, 4, 9, "String"],
                [4, 4, 9, "String"],
                [5, 0, 2, "Punctuator"]
            ])
        },
        {
            code: unIndent`
                [[
                ], function(
                        foo
                    ) {}
                ]
            `,
            output: unIndent`
                [[
                ], function(
                    foo
                ) {}
                ]
            `,
            errors: expectedErrors([[3, 4, 8, "Identifier"], [4, 0, 4, "Punctuator"]])
        },
        {
            code: unIndent`
                define([
                    'foo'
                ], function(
                        bar
                    ) {
                    baz;
                }
                )
            `,
            output: unIndent`
                define([
                    'foo'
                ], function(
                    bar
                ) {
                    baz;
                }
                )
            `,
            errors: expectedErrors([[4, 4, 8, "Identifier"], [5, 0, 4, "Punctuator"]])
        },
        {
            code: unIndent`
                while (1 < 2)
                console.log('foo')
                  console.log('bar')
            `,
            output: unIndent`
                while (1 < 2)
                  console.log('foo')
                console.log('bar')
            `,
            options: [2],
            errors: expectedErrors([
                [2, 2, 0, "Identifier"],
                [3, 0, 2, "Identifier"]
            ])
        },
        {
            code: unIndent`
                function salutation () {
                  switch (1) {
                  case 0: return console.log('hi')
                    case 1: return console.log('hey')
                  }
                }
            `,
            output: unIndent`
                function salutation () {
                  switch (1) {
                    case 0: return console.log('hi')
                    case 1: return console.log('hey')
                  }
                }
            `,
            options: [2, { SwitchCase: 1 }],
            errors: expectedErrors([
                [3, 4, 2, "Keyword"]
            ])
        },
        {
            code: unIndent`
                var geometry, box, face1, face2, colorT, colorB, sprite, padding, maxWidth,
                height, rotate;
            `,
            output: unIndent`
                var geometry, box, face1, face2, colorT, colorB, sprite, padding, maxWidth,
                  height, rotate;
            `,
            options: [2, { SwitchCase: 1 }],
            errors: expectedErrors([
                [2, 2, 0, "Identifier"]
            ])
        },
        {
            code: unIndent`
                switch (a) {
                case '1':
                b();
                break;
                default:
                c();
                break;
                }
            `,
            output: unIndent`
                switch (a) {
                        case '1':
                            b();
                            break;
                        default:
                            c();
                            break;
                }
            `,
            options: [4, { SwitchCase: 2 }],
            errors: expectedErrors([
                [2, 8, 0, "Keyword"],
                [3, 12, 0, "Identifier"],
                [4, 12, 0, "Keyword"],
                [5, 8, 0, "Keyword"],
                [6, 12, 0, "Identifier"],
                [7, 12, 0, "Keyword"]
            ])
        },
        {
            code: unIndent`
                var geometry,
                rotate;
            `,
            output: unIndent`
                var geometry,
                  rotate;
            `,
            options: [2, { VariableDeclarator: 1 }],
            errors: expectedErrors([
                [2, 2, 0, "Identifier"]
            ])
        },
        {
            code: unIndent`
                var geometry,
                  rotate;
            `,
            output: unIndent`
                var geometry,
                    rotate;
            `,
            options: [2, { VariableDeclarator: 2 }],
            errors: expectedErrors([
                [2, 4, 2, "Identifier"]
            ])
        },
        {
            code: unIndent`
                var geometry,
                \trotate;
            `,
            output: unIndent`
                var geometry,
                \t\trotate;
            `,
            options: ["tab", { VariableDeclarator: 2 }],
            errors: expectedErrors("tab", [
                [2, 2, 1, "Identifier"]
            ])
        },
        {
            code: unIndent`
                let geometry,
                  rotate;
            `,
            output: unIndent`
                let geometry,
                    rotate;
            `,
            options: [2, { VariableDeclarator: 2 }],
            errors: expectedErrors([
                [2, 4, 2, "Identifier"]
            ])
        },
        {
            code: unIndent`
                let foo = 'foo',
                  bar = bar;
                const a = 'a',
                  b = 'b';
            `,
            output: unIndent`
                let foo = 'foo',
                    bar = bar;
                const a = 'a',
                      b = 'b';
            `,
            options: [2, { VariableDeclarator: "first" }],
            errors: expectedErrors([
                [2, 4, 2, "Identifier"],
                [4, 6, 2, "Identifier"]
            ])
        },
        {
            code: unIndent`
                var foo = 'foo',
                  bar = bar;
            `,
            output: unIndent`
                var foo = 'foo',
                    bar = bar;
            `,
            options: [2, { VariableDeclarator: { var: "first" } }],
            errors: expectedErrors([
                [2, 4, 2, "Identifier"]
            ])
        },
        {
            code: unIndent`
                if(true)
                  if (true)
                    if (true)
                    console.log(val);
            `,
            output: unIndent`
                if(true)
                  if (true)
                    if (true)
                      console.log(val);
            `,
            options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
            errors: expectedErrors([
                [4, 6, 4, "Identifier"]
            ])
        },
        {
            code: unIndent`
                var a = {
                    a: 1,
                    b: 2
                }
            `,
            output: unIndent`
                var a = {
                  a: 1,
                  b: 2
                }
            `,
            options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
            errors: expectedErrors([
                [2, 2, 4, "Identifier"],
                [3, 2, 4, "Identifier"]
            ])
        },
        {
            code: unIndent`
                var a = [
                    a,
                    b
                ]
            `,
            output: unIndent`
                var a = [
                  a,
                  b
                ]
            `,
            options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
            errors: expectedErrors([
                [2, 2, 4, "Identifier"],
                [3, 2, 4, "Identifier"]
            ])
        },
        {
            code: unIndent`
                let a = [
                    a,
                    b
                ]
            `,
            output: unIndent`
                let a = [
                  a,
                  b
                ]
            `,
            options: [2, { VariableDeclarator: { let: 2 }, SwitchCase: 1 }],
            errors: expectedErrors([
                [2, 2, 4, "Identifier"],
                [3, 2, 4, "Identifier"]
            ])
        },
        {
            code: unIndent`
                var a = new Test({
                      a: 1
                  }),
                    b = 4;
            `,
            output: unIndent`
                var a = new Test({
                        a: 1
                    }),
                    b = 4;
            `,
            options: [4],
            errors: expectedErrors([
                [2, 8, 6, "Identifier"],
                [3, 4, 2, "Punctuator"]
            ])
        },
        {
            code: unIndent`
                var a = new Test({
                      a: 1
                    }),
                    b = 4;
                const c = new Test({
                      a: 1
                    }),
                    d = 4;
            `,
            output: unIndent`
                var a = new Test({
                      a: 1
                    }),
                    b = 4;
                const c = new Test({
                    a: 1
                  }),
                  d = 4;
            `,
            options: [2, { VariableDeclarator: { var: 2 } }],
            errors: expectedErrors([
                [6, 4, 6, "Identifier"],
                [7, 2, 4, "Punctuator"],
                [8, 2, 4, "Identifier"]
            ])
        },
        {
            code: unIndent`
                var abc = 5,
                    c = 2,
                    xyz =
                    {
                      a: 1,
                       b: 2
                    };
            `,
            output: unIndent`
                var abc = 5,
                    c = 2,
                    xyz =
                    {
                      a: 1,
                      b: 2
                    };
            `,
            options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
            errors: expectedErrors([6, 6, 7, "Identifier"])
        },
        {
            code: unIndent`
                var abc =
                     {
                       a: 1,
                        b: 2
                     };
            `,
            output: unIndent`
                var abc =
                     {
                       a: 1,
                       b: 2
                     };
            `,
            options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
            errors: expectedErrors([4, 7, 8, "Identifier"])
        },
        {
            code: unIndent`
                var foo = {
                    bar: 1,
                    baz: {
                        qux: 2
                      }
                  },
                  bar = 1;
            `,
            output: unIndent`
                var foo = {
                    bar: 1,
                    baz: {
                      qux: 2
                    }
                  },
                  bar = 1;
            `,
            options: [2],
            errors: expectedErrors([[4, 6, 8, "Identifier"], [5, 4, 6, "Punctuator"]])
        },
        {
            code: unIndent`
                var path     = require('path')
                 , crypto    = require('crypto')
                ;
            `,
            output: unIndent`
                var path     = require('path')
                  , crypto    = require('crypto')
                ;
            `,
            options: [2],
            errors: expectedErrors([
                [2, 2, 1, "Punctuator"]
            ])
        },
        {
            code: unIndent`
                var a = 1
                   ,b = 2
                ;
            `,
            output: unIndent`
                var a = 1
                    ,b = 2
                ;
            `,
            errors: expectedErrors([
                [2, 4, 3, "Punctuator"]
            ])
        },
        {
            code: unIndent`
                class A{
                  constructor(){}
                    a(){}
                    get b(){}
                }
            `,
            output: unIndent`
                class A{
                    constructor(){}
                    a(){}
                    get b(){}
                }
            `,
            options: [4, { VariableDeclarator: 1, SwitchCase: 1 }],
            errors: expectedErrors([[2, 4, 2, "Identifier"]])
        },
        {
            code: unIndent`
                var A = class {
                  constructor(){}
                    a(){}
                  get b(){}
                };
            `,
            output: unIndent`
                var A = class {
                    constructor(){}
                    a(){}
                    get b(){}
                };
            `,
            options: [4, { VariableDeclarator: 1, SwitchCase: 1 }],
            errors: expectedErrors([[2, 4, 2, "Identifier"], [4, 4, 2, "Identifier"]])
        },
        {
            code: unIndent`
                var a = 1,
                    B = class {
                    constructor(){}
                      a(){}
                      get b(){}
                    };
            `,
            output: unIndent`
                var a = 1,
                    B = class {
                      constructor(){}
                      a(){}
                      get b(){}
                    };
            `,
            options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
            errors: expectedErrors([[3, 6, 4, "Identifier"]])
        },
        {
            code: unIndent`
                {
                    if(a){
                        foo();
                    }
                  else{
                        bar();
                    }
                }
            `,
            output: unIndent`
                {
                    if(a){
                        foo();
                    }
                    else{
                        bar();
                    }
                }
            `,
            options: [4],
            errors: expectedErrors([[5, 4, 2, "Keyword"]])
        },
        {
            code: unIndent`
                {
                    if(a){
                        foo();
                    }
                  else
                        bar();

                }
            `,
            output: unIndent`
                {
                    if(a){
                        foo();
                    }
                    else
                        bar();

                }
            `,
            options: [4],
            errors: expectedErrors([[5, 4, 2, "Keyword"]])
        },
        {
            code: unIndent`
                {
                    if(a)
                        foo();
                  else
                        bar();
                }
            `,
            output: unIndent`
                {
                    if(a)
                        foo();
                    else
                        bar();
                }
            `,
            options: [4],
            errors: expectedErrors([[4, 4, 2, "Keyword"]])
        },
        {
            code: unIndent`
                (function(){
                  function foo(x) {
                    return x + 1;
                  }
                })();
            `,
            output: unIndent`
                (function(){
                function foo(x) {
                  return x + 1;
                }
                })();
            `,
            options: [2, { outerIIFEBody: 0 }],
            errors: expectedErrors([[2, 0, 2, "Keyword"], [3, 2, 4, "Keyword"], [4, 0, 2, "Punctuator"]])
        },
        {
            code: unIndent`
                (function(){
                    function foo(x) {
                        return x + 1;
                    }
                })();
            `,
            output: unIndent`
                (function(){
                        function foo(x) {
                            return x + 1;
                        }
                })();
            `,
            options: [4, { outerIIFEBody: 2 }],
            errors: expectedErrors([[2, 8, 4, "Keyword"], [3, 12, 8, "Keyword"], [4, 8, 4, "Punctuator"]])
        },
        {
            code: unIndent`
                if(data) {
                console.log('hi');
                }
            `,
            output: unIndent`
                if(data) {
                  console.log('hi');
                }
            `,
            options: [2, { outerIIFEBody: 0 }],
            errors: expectedErrors([[2, 2, 0, "Identifier"]])
        },
        {
            code: unIndent`
                var ns = function(){
                    function fooVar(x) {
                        return x + 1;
                    }
                }(x);
            `,
            output: unIndent`
                var ns = function(){
                        function fooVar(x) {
                            return x + 1;
                        }
                }(x);
            `,
            options: [4, { outerIIFEBody: 2 }],
            errors: expectedErrors([[2, 8, 4, "Keyword"], [3, 12, 8, "Keyword"], [4, 8, 4, "Punctuator"]])
        },
        {
            code: unIndent`
                var obj = {
                  foo: function() {
                  return true;
                  }()
                };
            `,
            output: unIndent`
                var obj = {
                  foo: function() {
                    return true;
                  }()
                };
            `,
            options: [2, { outerIIFEBody: 0 }],
            errors: expectedErrors([[3, 4, 2, "Keyword"]])
        },
        {
            code: unIndent`
                typeof function() {
                    function fooVar(x) {
                      return x + 1;
                    }
                }();
            `,
            output: unIndent`
                typeof function() {
                  function fooVar(x) {
                    return x + 1;
                  }
                }();
            `,
            options: [2, { outerIIFEBody: 2 }],
            errors: expectedErrors([[2, 2, 4, "Keyword"], [3, 4, 6, "Keyword"], [4, 2, 4, "Punctuator"]])
        },
        {
            code: unIndent`
                {
                \t!function(x) {
                \t\t\t\treturn x + 1;
                \t}()
                };
            `,
            output: unIndent`
                {
                \t!function(x) {
                \t\treturn x + 1;
                \t}()
                };
            `,
            options: ["tab", { outerIIFEBody: 3 }],
            errors: expectedErrors("tab", [[3, 2, 4, "Keyword"]])
        },
        {
            code: unIndent`
                Buffer
                .toString()
            `,
            output: unIndent`
                Buffer
                    .toString()
            `,
            options: [4, { MemberExpression: 1 }],
            errors: expectedErrors([[2, 4, 0, "Punctuator"]])
        },
        {
            code: unIndent`
                Buffer
                    .indexOf('a')
                .toString()
            `,
            output: unIndent`
                Buffer
                    .indexOf('a')
                    .toString()
            `,
            options: [4, { MemberExpression: 1 }],
            errors: expectedErrors([[3, 4, 0, "Punctuator"]])
        },
        {
            code: unIndent`
                Buffer.
                length
            `,
            output: unIndent`
                Buffer.
                    length
            `,
            options: [4, { MemberExpression: 1 }],
            errors: expectedErrors([[2, 4, 0, "Identifier"]])
        },
        {
            code: unIndent`
                Buffer.
                \t\tlength
            `,
            output: unIndent`
                Buffer.
                \tlength
            `,
            options: ["tab", { MemberExpression: 1 }],
            errors: expectedErrors("tab", [[2, 1, 2, "Identifier"]])
        },
        {
            code: unIndent`
                Buffer
                  .foo
                  .bar
            `,
            output: unIndent`
                Buffer
                    .foo
                    .bar
            `,
            options: [2, { MemberExpression: 2 }],
            errors: expectedErrors([[2, 4, 2, "Punctuator"], [3, 4, 2, "Punctuator"]])
        },
        {
            code: unIndent`
                function foo() {
                    new
                    .target
                }
            `,
            output: unIndent`
                function foo() {
                    new
                        .target
                }
            `,
            errors: expectedErrors([3, 8, 4, "Punctuator"])
        },
        {
            code: unIndent`
                function foo() {
                    new.
                    target
                }
            `,
            output: unIndent`
                function foo() {
                    new.
                        target
                }
            `,
            errors: expectedErrors([3, 8, 4, "Identifier"])
        },
        {

            // Indentation with multiple else statements: https://github.com/eslint/eslint/issues/6956

            code: unIndent`
                if (foo) bar();
                else if (baz) foobar();
                  else if (qux) qux();
            `,
            output: unIndent`
                if (foo) bar();
                else if (baz) foobar();
                else if (qux) qux();
            `,
            options: [2],
            errors: expectedErrors([3, 0, 2, "Keyword"])
        },
        {
            code: unIndent`
                if (foo) bar();
                else if (baz) foobar();
                  else qux();
            `,
            output: unIndent`
                if (foo) bar();
                else if (baz) foobar();
                else qux();
            `,
            options: [2],
            errors: expectedErrors([3, 0, 2, "Keyword"])
        },
        {
            code: unIndent`
                foo();
                  if (baz) foobar();
                  else qux();
            `,
            output: unIndent`
                foo();
                if (baz) foobar();
                else qux();
            `,
            options: [2],
            errors: expectedErrors([[2, 0, 2, "Keyword"], [3, 0, 2, "Keyword"]])
        },
        {
            code: unIndent`
                if (foo) bar();
                else if (baz) foobar();
                     else if (bip) {
                       qux();
                     }
            `,
            output: unIndent`
                if (foo) bar();
                else if (baz) foobar();
                else if (bip) {
                  qux();
                }
            `,
            options: [2],
            errors: expectedErrors([[3, 0, 5, "Keyword"], [4, 2, 7, "Identifier"], [5, 0, 5, "Punctuator"]])
        },
        {
            code: unIndent`
                if (foo) bar();
                else if (baz) {
                    foobar();
                     } else if (boop) {
                       qux();
                     }
            `,
            output: unIndent`
                if (foo) bar();
                else if (baz) {
                  foobar();
                } else if (boop) {
                  qux();
                }
            `,
            options: [2],
            errors: expectedErrors([[3, 2, 4, "Identifier"], [4, 0, 5, "Punctuator"], [5, 2, 7, "Identifier"], [6, 0, 5, "Punctuator"]])
        },
        {
            code: unIndent`
                function foo(aaa,
                    bbb, ccc, ddd) {
                      bar();
                }
            `,
            output: unIndent`
                function foo(aaa,
                  bbb, ccc, ddd) {
                    bar();
                }
            `,
            options: [2, { FunctionDeclaration: { parameters: 1, body: 2 } }],
            errors: expectedErrors([[2, 2, 4, "Identifier"], [3, 4, 6, "Identifier"]])
        },
        {
            code: unIndent`
                function foo(aaa, bbb,
                  ccc, ddd) {
                bar();
                }
            `,
            output: unIndent`
                function foo(aaa, bbb,
                      ccc, ddd) {
                  bar();
                }
            `,
            options: [2, { FunctionDeclaration: { parameters: 3, body: 1 } }],
            errors: expectedErrors([[2, 6, 2, "Identifier"], [3, 2, 0, "Identifier"]])
        },
        {
            code: unIndent`
                function foo(aaa,
                        bbb,
                  ccc) {
                      bar();
                }
            `,
            output: unIndent`
                function foo(aaa,
                    bbb,
                    ccc) {
                            bar();
                }
            `,
            options: [4, { FunctionDeclaration: { parameters: 1, body: 3 } }],
            errors: expectedErrors([[2, 4, 8, "Identifier"], [3, 4, 2, "Identifier"], [4, 12, 6, "Identifier"]])
        },
        {
            code: unIndent`
                function foo(aaa,
                  bbb, ccc,
                                   ddd, eee, fff) {
                   bar();
                }
            `,
            output: unIndent`
                function foo(aaa,
                             bbb, ccc,
                             ddd, eee, fff) {
                  bar();
                }
            `,
            options: [2, { FunctionDeclaration: { parameters: "first", body: 1 } }],
            errors: expectedErrors([[2, 13, 2, "Identifier"], [3, 13, 19, "Identifier"], [4, 2, 3, "Identifier"]])
        },
        {
            code: unIndent`
                function foo(aaa, bbb)
                {
                bar();
                }
            `,
            output: unIndent`
                function foo(aaa, bbb)
                {
                      bar();
                }
            `,
            options: [2, { FunctionDeclaration: { body: 3 } }],
            errors: expectedErrors([3, 6, 0, "Identifier"])
        },
        {
            code: unIndent`
                function foo(
                aaa,
                    bbb) {
                bar();
                }
            `,
            output: unIndent`
                function foo(
                  aaa,
                  bbb) {
                    bar();
                }
            `,
            options: [2, { FunctionDeclaration: { parameters: "first", body: 2 } }],
            errors: expectedErrors([[2, 2, 0, "Identifier"], [3, 2, 4, "Identifier"], [4, 4, 0, "Identifier"]])
        },
        {
            code: unIndent`
                var foo = function(aaa,
                  bbb,
                    ccc,
                      ddd) {
                  bar();
                }
            `,
            output: unIndent`
                var foo = function(aaa,
                    bbb,
                    ccc,
                    ddd) {
                bar();
                }
            `,
            options: [2, { FunctionExpression: { parameters: 2, body: 0 } }],
            errors: expectedErrors([[2, 4, 2, "Identifier"], [4, 4, 6, "Identifier"], [5, 0, 2, "Identifier"]])
        },
        {
            code: unIndent`
                var foo = function(aaa,
                   bbb,
                 ccc) {
                  bar();
                }
            `,
            output: unIndent`
                var foo = function(aaa,
                  bbb,
                  ccc) {
                                    bar();
                }
            `,
            options: [2, { FunctionExpression: { parameters: 1, body: 10 } }],
            errors: expectedErrors([[2, 2, 3, "Identifier"], [3, 2, 1, "Identifier"], [4, 20, 2, "Identifier"]])
        },
        {
            code: unIndent`
                var foo = function(aaa,
                  bbb, ccc, ddd,
                                        eee, fff) {
                        bar();
                }
            `,
            output: unIndent`
                var foo = function(aaa,
                                   bbb, ccc, ddd,
                                   eee, fff) {
                    bar();
                }
            `,
            options: [4, { FunctionExpression: { parameters: "first", body: 1 } }],
            errors: expectedErrors([[2, 19, 2, "Identifier"], [3, 19, 24, "Identifier"], [4, 4, 8, "Identifier"]])
        },
        {
            code: unIndent`
                var foo = function(
                aaa, bbb, ccc,
                    ddd, eee) {
                  bar();
                }
            `,
            output: unIndent`
                var foo = function(
                  aaa, bbb, ccc,
                  ddd, eee) {
                      bar();
                }
            `,
            options: [2, { FunctionExpression: { parameters: "first", body: 3 } }],
            errors: expectedErrors([[2, 2, 0, "Identifier"], [3, 2, 4, "Identifier"], [4, 6, 2, "Identifier"]])
        },
        {
            code: unIndent`
                var foo = bar;
                \t\t\tvar baz = qux;
            `,
            output: unIndent`
                var foo = bar;
                var baz = qux;
            `,
            options: [2],
            errors: expectedErrors([2, "0 spaces", "3 tabs", "Keyword"])
        },
        {
            code: unIndent`
                function foo() {
                \tbar();
                  baz();
                              qux();
                }
            `,
            output: unIndent`
                function foo() {
                \tbar();
                \tbaz();
                \tqux();
                }
            `,
            options: ["tab"],
            errors: expectedErrors("tab", [[3, "1 tab", "2 spaces", "Identifier"], [4, "1 tab", "14 spaces", "Identifier"]])
        },
        {
            code: unIndent`
                function foo() {
                  bar();
                \t\t}
            `,
            output: unIndent`
                function foo() {
                  bar();
                }
            `,
            options: [2],
            errors: expectedErrors([[3, "0 spaces", "2 tabs", "Punctuator"]])
        },
        {
            code: unIndent`
                function foo() {
                  function bar() {
                        baz();
                  }
                }
            `,
            output: unIndent`
                function foo() {
                  function bar() {
                    baz();
                  }
                }
            `,
            options: [2, { FunctionDeclaration: { body: 1 } }],
            errors: expectedErrors([3, 4, 8, "Identifier"])
        },
        {
            code: unIndent`
                function foo() {
                  function bar(baz,
                    qux) {
                    foobar();
                  }
                }
            `,
            output: unIndent`
                function foo() {
                  function bar(baz,
                      qux) {
                    foobar();
                  }
                }
            `,
            options: [2, { FunctionDeclaration: { body: 1, parameters: 2 } }],
            errors: expectedErrors([3, 6, 4, "Identifier"])
        },
        {
            code: unIndent`
                function foo() {
                  var bar = function(baz,
                          qux) {
                    foobar();
                  };
                }
            `,
            output: unIndent`
                function foo() {
                  var bar = function(baz,
                        qux) {
                    foobar();
                  };
                }
            `,
            options: [2, { FunctionExpression: { parameters: 3 } }],
            errors: expectedErrors([3, 8, 10, "Identifier"])
        },
        {
            code: unIndent`
                foo.bar(
                      baz, qux, function() {
                        qux;
                      }
                );
            `,
            output: unIndent`
                foo.bar(
                      baz, qux, function() {
                            qux;
                      }
                );
            `,
            options: [2, { FunctionExpression: { body: 3 }, CallExpression: { arguments: 3 } }],
            errors: expectedErrors([3, 12, 8, "Identifier"])
        },
        {
            code: unIndent`
                {
                    try {
                    }
                catch (err) {
                    }
                finally {
                    }
                }
            `,
            output: unIndent`
                {
                    try {
                    }
                    catch (err) {
                    }
                    finally {
                    }
                }
            `,
            errors: expectedErrors([
                [4, 4, 0, "Keyword"],
                [6, 4, 0, "Keyword"]
            ])
        },
        {
            code: unIndent`
                {
                    do {
                    }
                while (true)
                }
            `,
            output: unIndent`
                {
                    do {
                    }
                    while (true)
                }
            `,
            errors: expectedErrors([4, 4, 0, "Keyword"])
        },
        {
            code: unIndent`
                function foo() {
                  return (
                    1
                    )
                }
            `,
            output: unIndent`
                function foo() {
                  return (
                    1
                  )
                }
            `,
            options: [2],
            errors: expectedErrors([[4, 2, 4, "Punctuator"]])
        },
        {
            code: unIndent`
                function foo() {
                  return (
                    1
                    );
                }
            `,
            output: unIndent`
                function foo() {
                  return (
                    1
                  );
                }
            `,
            options: [2],
            errors: expectedErrors([[4, 2, 4, "Punctuator"]])
        },
        {
            code: unIndent`
                function test(){
                  switch(length){
                    case 1: return function(a){
                    return fn.call(that, a);
                    };
                  }
                }
            `,
            output: unIndent`
                function test(){
                  switch(length){
                    case 1: return function(a){
                      return fn.call(that, a);
                    };
                  }
                }
            `,
            options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
            errors: expectedErrors([[4, 6, 4, "Keyword"]])
        },
        {
            code: unIndent`
                function foo() {
                   return 1
                }
            `,
            output: unIndent`
                function foo() {
                  return 1
                }
            `,
            options: [2],
            errors: expectedErrors([[2, 2, 3, "Keyword"]])
        },
        {
            code: unIndent`
                foo(
                bar,
                  baz,
                    qux);
            `,
            output: unIndent`
                foo(
                  bar,
                  baz,
                  qux);
            `,
            options: [2, { CallExpression: { arguments: 1 } }],
            errors: expectedErrors([[2, 2, 0, "Identifier"], [4, 2, 4, "Identifier"]])
        },
        {
            code: unIndent`
                foo(
                \tbar,
                \tbaz);
            `,
            output: unIndent`
                foo(
                    bar,
                    baz);
            `,
            options: [2, { CallExpression: { arguments: 2 } }],
            errors: expectedErrors([[2, "4 spaces", "1 tab", "Identifier"], [3, "4 spaces", "1 tab", "Identifier"]])
        },
        {
            code: unIndent`
                foo(bar,
                \t\tbaz,
                \t\tqux);
            `,
            output: unIndent`
                foo(bar,
                \tbaz,
                \tqux);
            `,
            options: ["tab", { CallExpression: { arguments: 1 } }],
            errors: expectedErrors("tab", [[2, 1, 2, "Identifier"], [3, 1, 2, "Identifier"]])
        },
        {
            code: unIndent`
                foo(bar, baz,
                         qux);
            `,
            output: unIndent`
                foo(bar, baz,
                    qux);
            `,
            options: [2, { CallExpression: { arguments: "first" } }],
            errors: expectedErrors([2, 4, 9, "Identifier"])
        },
        {
            code: unIndent`
                foo(
                          bar,
                    baz);
            `,
            output: unIndent`
                foo(
                  bar,
                  baz);
            `,
            options: [2, { CallExpression: { arguments: "first" } }],
            errors: expectedErrors([[2, 2, 10, "Identifier"], [3, 2, 4, "Identifier"]])
        },
        {
            code: unIndent`
                foo(bar,
                  1 + 2,
                              !baz,
                        new Car('!')
                );
            `,
            output: unIndent`
                foo(bar,
                      1 + 2,
                      !baz,
                      new Car('!')
                );
            `,
            options: [2, { CallExpression: { arguments: 3 } }],
            errors: expectedErrors([[2, 6, 2, "Numeric"], [3, 6, 14, "Punctuator"], [4, 6, 8, "Keyword"]])
        },

        // https://github.com/eslint/eslint/issues/7573
        {
            code: unIndent`
                return (
                    foo
                    );
            `,
            output: unIndent`
                return (
                    foo
                );
            `,
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            errors: expectedErrors([3, 0, 4, "Punctuator"])
        },
        {
            code: unIndent`
                return (
                    foo
                    )
            `,
            output: unIndent`
                return (
                    foo
                )
            `,
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            errors: expectedErrors([3, 0, 4, "Punctuator"])
        },

        // https://github.com/eslint/eslint/issues/7604
        {
            code: unIndent`
                if (foo) {
                        /* comment */bar();
                }
            `,
            output: unIndent`
                if (foo) {
                    /* comment */bar();
                }
            `,
            errors: expectedErrors([2, 4, 8, "Block"])
        },
        {
            code: unIndent`
                foo('bar',
                        /** comment */{
                        ok: true
                    });
            `,
            output: unIndent`
                foo('bar',
                    /** comment */{
                        ok: true
                    });
            `,
            errors: expectedErrors([2, 4, 8, "Block"])
        },
        {
            code: unIndent`
                foo(
                (bar)
                );
            `,
            output: unIndent`
                foo(
                    (bar)
                );
            `,
            options: [4, { CallExpression: { arguments: 1 } }],
            errors: expectedErrors([2, 4, 0, "Punctuator"])
        },
        {
            code: unIndent`
                ((
                foo
                ))
            `,
            output: unIndent`
                ((
                    foo
                ))
            `,
            options: [4],
            errors: expectedErrors([2, 4, 0, "Identifier"])
        },

        // ternary expressions (https://github.com/eslint/eslint/issues/7420)
        {
            code: unIndent`
                foo
                ? bar
                    : baz
            `,
            output: unIndent`
                foo
                  ? bar
                  : baz
            `,
            options: [2],
            errors: expectedErrors([[2, 2, 0, "Punctuator"], [3, 2, 4, "Punctuator"]])
        },
        {
            code: unIndent`
                [
                    foo ?
                        bar :
                        baz,
                        qux
                ]
            `,
            output: unIndent`
                [
                    foo ?
                        bar :
                        baz,
                    qux
                ]
            `,
            errors: expectedErrors([5, 4, 8, "Identifier"])
        },
        {

            /*
             * Checking comments:
             * https://github.com/eslint/eslint/issues/6571
             */
            code: unIndent`
                foo();
                  // comment
                    /* multiline
                  comment */
                bar();
                 // trailing comment
            `,
            output: unIndent`
                foo();
                // comment
                /* multiline
                  comment */
                bar();
                // trailing comment
            `,
            options: [2],
            errors: expectedErrors([[2, 0, 2, "Line"], [3, 0, 4, "Block"], [6, 0, 1, "Line"]])
        },
        {
            code: "  // comment",
            output: "// comment",
            errors: expectedErrors([1, 0, 2, "Line"])
        },
        {
            code: unIndent`
                foo
                  // comment
            `,
            output: unIndent`
                foo
                // comment
            `,
            errors: expectedErrors([2, 0, 2, "Line"])
        },
        {
            code: unIndent`
                  // comment
                foo
            `,
            output: unIndent`
                // comment
                foo
            `,
            errors: expectedErrors([1, 0, 2, "Line"])
        },
        {
            code: unIndent`
                [
                        // no elements
                ]
            `,
            output: unIndent`
                [
                    // no elements
                ]
            `,
            errors: expectedErrors([2, 4, 8, "Line"])
        },
        {

            /*
             * Destructuring assignments:
             * https://github.com/eslint/eslint/issues/6813
             */
            code: unIndent`
                var {
                foo,
                  bar,
                    baz: qux,
                      foobar: baz = foobar
                  } = qux;
            `,
            output: unIndent`
                var {
                  foo,
                  bar,
                  baz: qux,
                  foobar: baz = foobar
                } = qux;
            `,
            options: [2],
            errors: expectedErrors([[2, 2, 0, "Identifier"], [4, 2, 4, "Identifier"], [5, 2, 6, "Identifier"], [6, 0, 2, "Punctuator"]])
        },
        {
            code: unIndent`
                const {
                  a
                } = {
                    a: 1
                  }
            `,
            output: unIndent`
                const {
                  a
                } = {
                  a: 1
                }
            `,
            options: [2],
            errors: expectedErrors([[4, 2, 4, "Identifier"], [5, 0, 2, "Punctuator"]])
        },
        {
            code: unIndent`
                var foo = [
                           bar,
                  baz
                          ]
            `,
            output: unIndent`
                var foo = [
                    bar,
                    baz
                ]
            `,
            errors: expectedErrors([[2, 4, 11, "Identifier"], [3, 4, 2, "Identifier"], [4, 0, 10, "Punctuator"]])
        },
        {
            code: unIndent`
                var foo = [bar,
                baz,
                    qux
                ]
            `,
            output: unIndent`
                var foo = [bar,
                    baz,
                    qux
                ]
            `,
            errors: expectedErrors([2, 4, 0, "Identifier"])
        },
        {
            code: unIndent`
                var foo = [bar,
                  baz,
                  qux
                ]
            `,
            output: unIndent`
                var foo = [bar,
                baz,
                qux
                ]
            `,
            options: [2, { ArrayExpression: 0 }],
            errors: expectedErrors([[2, 0, 2, "Identifier"], [3, 0, 2, "Identifier"]])
        },
        {
            code: unIndent`
                var foo = [bar,
                  baz,
                  qux
                ]
            `,
            output: unIndent`
                var foo = [bar,
                                baz,
                                qux
                ]
            `,
            options: [2, { ArrayExpression: 8 }],
            errors: expectedErrors([[2, 16, 2, "Identifier"], [3, 16, 2, "Identifier"]])
        },
        {
            code: unIndent`
                var foo = [bar,
                    baz,
                    qux
                ]
            `,
            output: unIndent`
                var foo = [bar,
                           baz,
                           qux
                ]
            `,
            options: [2, { ArrayExpression: "first" }],
            errors: expectedErrors([[2, 11, 4, "Identifier"], [3, 11, 4, "Identifier"]])
        },
        {
            code: unIndent`
                var foo = [bar,
                    baz, qux
                ]
            `,
            output: unIndent`
                var foo = [bar,
                           baz, qux
                ]
            `,
            options: [2, { ArrayExpression: "first" }],
            errors: expectedErrors([2, 11, 4, "Identifier"])
        },
        {
            code: unIndent`
                var foo = [
                        { bar: 1,
                            baz: 2 },
                        { bar: 3,
                            qux: 4 }
                ]
            `,
            output: unIndent`
                var foo = [
                        { bar: 1,
                          baz: 2 },
                        { bar: 3,
                          qux: 4 }
                ]
            `,
            options: [4, { ArrayExpression: 2, ObjectExpression: "first" }],
            errors: expectedErrors([[3, 10, 12, "Identifier"], [5, 10, 12, "Identifier"]])
        },
        {
            code: unIndent`
                var foo = {
                  bar: 1,
                  baz: 2
                };
            `,
            output: unIndent`
                var foo = {
                bar: 1,
                baz: 2
                };
            `,
            options: [2, { ObjectExpression: 0 }],
            errors: expectedErrors([[2, 0, 2, "Identifier"], [3, 0, 2, "Identifier"]])
        },
        {
            code: unIndent`
                var quux = { foo: 1, bar: 2,
                baz: 3 }
            `,
            output: unIndent`
                var quux = { foo: 1, bar: 2,
                             baz: 3 }
            `,
            options: [2, { ObjectExpression: "first" }],
            errors: expectedErrors([2, 13, 0, "Identifier"])
        },
        {
            code: unIndent`
                function foo() {
                    [
                            foo
                    ]
                }
            `,
            output: unIndent`
                function foo() {
                  [
                          foo
                  ]
                }
            `,
            options: [2, { ArrayExpression: 4 }],
            errors: expectedErrors([[2, 2, 4, "Punctuator"], [3, 10, 12, "Identifier"], [4, 2, 4, "Punctuator"]])
        },
        {
            code: unIndent`
                var [
                foo,
                  bar,
                    baz,
                      foobar = baz
                  ] = qux;
            `,
            output: unIndent`
                var [
                  foo,
                  bar,
                  baz,
                  foobar = baz
                ] = qux;
            `,
            options: [2],
            errors: expectedErrors([[2, 2, 0, "Identifier"], [4, 2, 4, "Identifier"], [5, 2, 6, "Identifier"], [6, 0, 2, "Punctuator"]])
        },
        {
            code: unIndent`
                import {
                foo,
                  bar,
                    baz
                } from 'qux';
            `,
            output: unIndent`
                import {
                    foo,
                    bar,
                    baz
                } from 'qux';
            `,
            parserOptions: { sourceType: "module" },
            errors: expectedErrors([[2, 4, 0, "Identifier"], [3, 4, 2, "Identifier"]])
        },
        {
            code: unIndent`
                import { foo,
                         bar,
                          baz,
                } from 'qux';
            `,
            output: unIndent`
                import { foo,
                         bar,
                         baz,
                } from 'qux';
            `,
            options: [4, { ImportDeclaration: "first" }],
            parserOptions: { sourceType: "module" },
            errors: expectedErrors([[3, 9, 10, "Identifier"]])
        },
        {
            code: unIndent`
                import { foo,
                    bar,
                     baz,
                } from 'qux';
            `,
            output: unIndent`
                import { foo,
                    bar,
                    baz,
                } from 'qux';
            `,
            options: [2, { ImportDeclaration: 2 }],
            parserOptions: { sourceType: "module" },
            errors: expectedErrors([[3, 4, 5, "Identifier"]])
        },
        {
            code: unIndent`
                var foo = 0, bar = 0, baz = 0;
                export {
                foo,
                  bar,
                    baz
                };
            `,
            output: unIndent`
                var foo = 0, bar = 0, baz = 0;
                export {
                    foo,
                    bar,
                    baz
                };
            `,
            parserOptions: { sourceType: "module" },
            errors: expectedErrors([[3, 4, 0, "Identifier"], [4, 4, 2, "Identifier"]])
        },
        {
            code: unIndent`
                var foo = 0, bar = 0, baz = 0;
                export {
                foo,
                  bar,
                    baz
                } from 'qux';
            `,
            output: unIndent`
                var foo = 0, bar = 0, baz = 0;
                export {
                    foo,
                    bar,
                    baz
                } from 'qux';
            `,
            parserOptions: { sourceType: "module" },
            errors: expectedErrors([[3, 4, 0, "Identifier"], [4, 4, 2, "Identifier"]])
        },
        {

            // https://github.com/eslint/eslint/issues/7233
            code: unIndent`
                var folder = filePath
                  .foo()
                      .bar;
            `,
            output: unIndent`
                var folder = filePath
                    .foo()
                    .bar;
            `,
            options: [2, { MemberExpression: 2 }],
            errors: expectedErrors([[2, 4, 2, "Punctuator"], [3, 4, 6, "Punctuator"]])
        },
        {
            code: unIndent`
                for (const foo of bar)
                    baz();
            `,
            output: unIndent`
                for (const foo of bar)
                  baz();
            `,
            options: [2],
            errors: expectedErrors([2, 2, 4, "Identifier"])
        },
        {
            code: unIndent`
                var x = () =>
                    5;
            `,
            output: unIndent`
                var x = () =>
                  5;
            `,
            options: [2],
            errors: expectedErrors([2, 2, 4, "Numeric"])
        },
        {

            // BinaryExpressions with parens
            code: unIndent`
                foo && (
                        bar
                )
            `,
            output: unIndent`
                foo && (
                    bar
                )
            `,
            options: [4],
            errors: expectedErrors([2, 4, 8, "Identifier"])
        },
        {
            code: unIndent`
                foo &&
                    !bar(
                )
            `,
            output: unIndent`
                foo &&
                    !bar(
                    )
            `,
            errors: expectedErrors([3, 4, 0, "Punctuator"])
        },
        {
            code: unIndent`
                foo &&
                    ![].map(() => {
                    bar();
                })
            `,
            output: unIndent`
                foo &&
                    ![].map(() => {
                        bar();
                    })
            `,
            errors: expectedErrors([[3, 8, 4, "Identifier"], [4, 4, 0, "Punctuator"]])
        },
        {
            code: unIndent`
                [
                ] || [
                    ]
            `,
            output: unIndent`
                [
                ] || [
                ]
            `,
            errors: expectedErrors([3, 0, 4, "Punctuator"])
        },
        {
            code: unIndent`
                foo
                        || (
                                bar
                            )
            `,
            output: unIndent`
                foo
                        || (
                            bar
                        )
            `,
            errors: expectedErrors([[3, 12, 16, "Identifier"], [4, 8, 12, "Punctuator"]])
        },
        {
            code: unIndent`
                1
                + (
                        1
                    )
            `,
            output: unIndent`
                1
                + (
                    1
                )
            `,
            errors: expectedErrors([[3, 4, 8, "Numeric"], [4, 0, 4, "Punctuator"]])
        },

        // Template curlies
        {
            code: unIndent`
                \`foo\${
                bar}\`
            `,
            output: unIndent`
                \`foo\${
                  bar}\`
            `,
            options: [2],
            errors: expectedErrors([2, 2, 0, "Identifier"])
        },
        {
            code: unIndent`
                \`foo\${
                    \`bar\${
                baz}\`}\`
            `,
            output: unIndent`
                \`foo\${
                  \`bar\${
                    baz}\`}\`
            `,
            options: [2],
            errors: expectedErrors([[2, 2, 4, "Template"], [3, 4, 0, "Identifier"]])
        },
        {
            code: unIndent`
                \`foo\${
                    \`bar\${
                  baz
                    }\`
                  }\`
            `,
            output: unIndent`
                \`foo\${
                  \`bar\${
                    baz
                  }\`
                }\`
            `,
            options: [2],
            errors: expectedErrors([[2, 2, 4, "Template"], [3, 4, 2, "Identifier"], [4, 2, 4, "Template"], [5, 0, 2, "Template"]])
        },
        {
            code: unIndent`
                \`foo\${
                (
                  bar
                )
                }\`
            `,
            output: unIndent`
                \`foo\${
                  (
                    bar
                  )
                }\`
            `,
            options: [2],
            errors: expectedErrors([[2, 2, 0, "Punctuator"], [3, 4, 2, "Identifier"], [4, 2, 0, "Punctuator"]])
        },
        {
            code: unIndent`
                function foo() {
                    \`foo\${bar}baz\${
                qux}foo\${
                  bar}baz\`
                }
            `,
            output: unIndent`
                function foo() {
                    \`foo\${bar}baz\${
                        qux}foo\${
                        bar}baz\`
                }
            `,
            errors: expectedErrors([[3, 8, 0, "Identifier"], [4, 8, 2, "Identifier"]])
        },
        {
            code: unIndent`
                function foo() {
                    const template = \`the indentation of
                a curly element in a \${
                        node.type
                    } node is checked.\`;
                }
            `,
            output: unIndent`
                function foo() {
                    const template = \`the indentation of
                a curly element in a \${
                    node.type
                } node is checked.\`;
                }
            `,
            errors: expectedErrors([[4, 4, 8, "Identifier"], [5, 0, 4, "Template"]])
        },
        {
            code: unIndent`
                function foo() {
                    const template = \`this time the
                closing curly is at the end of the line \${
                            foo}
                        so the spaces before this line aren't removed.\`;
                }
            `,
            output: unIndent`
                function foo() {
                    const template = \`this time the
                closing curly is at the end of the line \${
                    foo}
                        so the spaces before this line aren't removed.\`;
                }
            `,
            errors: expectedErrors([4, 4, 12, "Identifier"])
        },
        {

            /*
             * https://github.com/eslint/eslint/issues/1801
             * Note: This issue also mentioned checking the indentation for the 2 below. However,
             * this is intentionally ignored because everyone seems to have a different idea of how
             * BinaryExpressions should be indented.
             */
            code: unIndent`
                if (true) {
                    a = (
                1 +
                        2);
                }
            `,
            output: unIndent`
                if (true) {
                    a = (
                        1 +
                        2);
                }
            `,
            errors: expectedErrors([3, 8, 0, "Numeric"])
        },
        {

            // https://github.com/eslint/eslint/issues/3737
            code: unIndent`
                if (true) {
                    for (;;) {
                      b();
                  }
                }
            `,
            output: unIndent`
                if (true) {
                  for (;;) {
                    b();
                  }
                }
            `,
            options: [2],
            errors: expectedErrors([[2, 2, 4, "Keyword"], [3, 4, 6, "Identifier"]])
        },
        {

            // https://github.com/eslint/eslint/issues/6670
            code: unIndent`
                function f() {
                    return asyncCall()
                    .then(
                               'some string',
                              [
                              1,
                         2,
                                                   3
                                      ]
                );
                 }
            `,
            output: unIndent`
                function f() {
                    return asyncCall()
                        .then(
                            'some string',
                            [
                                1,
                                2,
                                3
                            ]
                        );
                }
            `,
            options: [4, { MemberExpression: 1, CallExpression: { arguments: 1 } }],
            errors: expectedErrors([
                [3, 8, 4, "Punctuator"],
                [4, 12, 15, "String"],
                [5, 12, 14, "Punctuator"],
                [6, 16, 14, "Numeric"],
                [7, 16, 9, "Numeric"],
                [8, 16, 35, "Numeric"],
                [9, 12, 22, "Punctuator"],
                [10, 8, 0, "Punctuator"],
                [11, 0, 1, "Punctuator"]
            ])
        },

        // https://github.com/eslint/eslint/issues/7242
        {
            code: unIndent`
                var x = [
                      [1],
                  [2]
                ]
            `,
            output: unIndent`
                var x = [
                    [1],
                    [2]
                ]
            `,
            errors: expectedErrors([[2, 4, 6, "Punctuator"], [3, 4, 2, "Punctuator"]])
        },
        {
            code: unIndent`
                var y = [
                      {a: 1},
                  {b: 2}
                ]
            `,
            output: unIndent`
                var y = [
                    {a: 1},
                    {b: 2}
                ]
            `,
            errors: expectedErrors([[2, 4, 6, "Punctuator"], [3, 4, 2, "Punctuator"]])
        },
        {
            code: unIndent`
                echo = spawn('cmd.exe',
                            ['foo', 'bar',
                             'baz']);
            `,
            output: unIndent`
                echo = spawn('cmd.exe',
                             ['foo', 'bar',
                              'baz']);
            `,
            options: [2, { ArrayExpression: "first", CallExpression: { arguments: "first" } }],
            errors: expectedErrors([[2, 13, 12, "Punctuator"], [3, 14, 13, "String"]])
        },
        {

            // https://github.com/eslint/eslint/issues/7522
            code: unIndent`
                foo(
                  )
            `,
            output: unIndent`
                foo(
                )
            `,
            errors: expectedErrors([2, 0, 2, "Punctuator"])
        },
        {

            // https://github.com/eslint/eslint/issues/7616
            code: unIndent`
                foo(
                        bar,
                    {
                        baz: 1
                    }
                )
            `,
            output: unIndent`
                foo(
                    bar,
                    {
                        baz: 1
                    }
                )
            `,
            options: [4, { CallExpression: { arguments: "first" } }],
            errors: expectedErrors([[2, 4, 8, "Identifier"]])
        },
        {
            code: "  new Foo",
            output: "new Foo",
            errors: expectedErrors([1, 0, 2, "Keyword"])
        },
        {
            code: unIndent`
                var foo = 0, bar = 0, baz = 0;
                export {
                foo,
                        bar,
                  baz
                }
            `,
            output: unIndent`
                var foo = 0, bar = 0, baz = 0;
                export {
                    foo,
                    bar,
                    baz
                }
            `,
            parserOptions: { sourceType: "module" },
            errors: expectedErrors([[3, 4, 0, "Identifier"], [4, 4, 8, "Identifier"], [5, 4, 2, "Identifier"]])
        },
        {
            code: unIndent`
                foo
                    ? bar
                : baz
            `,
            output: unIndent`
                foo
                    ? bar
                    : baz
            `,
            options: [4, { flatTernaryExpressions: true }],
            errors: expectedErrors([3, 4, 0, "Punctuator"])
        },
        {
            code: unIndent`
                foo ?
                    bar :
                baz
            `,
            output: unIndent`
                foo ?
                    bar :
                    baz
            `,
            options: [4, { flatTernaryExpressions: true }],
            errors: expectedErrors([3, 4, 0, "Identifier"])
        },
        {
            code: unIndent`
                foo ?
                    bar
                  : baz
            `,
            output: unIndent`
                foo ?
                    bar
                    : baz
            `,
            options: [4, { flatTernaryExpressions: true }],
            errors: expectedErrors([3, 4, 2, "Punctuator"])
        },
        {
            code: unIndent`
                foo
                    ? bar :
                baz
            `,
            output: unIndent`
                foo
                    ? bar :
                    baz
            `,
            options: [4, { flatTernaryExpressions: true }],
            errors: expectedErrors([3, 4, 0, "Identifier"])
        },
        {
            code: unIndent`
                foo ? bar
                    : baz ? qux
                        : foobar ? boop
                            : beep
            `,
            output: unIndent`
                foo ? bar
                    : baz ? qux
                    : foobar ? boop
                    : beep
            `,
            options: [4, { flatTernaryExpressions: true }],
            errors: expectedErrors([
                [3, 4, 8, "Punctuator"],
                [4, 4, 12, "Punctuator"]
            ])
        },
        {
            code: unIndent`
                foo ? bar :
                    baz ? qux :
                        foobar ? boop :
                            beep
            `,
            output: unIndent`
                foo ? bar :
                    baz ? qux :
                    foobar ? boop :
                    beep
            `,
            options: [4, { flatTernaryExpressions: true }],
            errors: expectedErrors([
                [3, 4, 8, "Identifier"],
                [4, 4, 12, "Identifier"]
            ])
        },
        {
            code: unIndent`
                var a =
                    foo ? bar :
                      baz ? qux :
                  foobar ? boop :
                    /*else*/ beep
            `,
            output: unIndent`
                var a =
                    foo ? bar :
                    baz ? qux :
                    foobar ? boop :
                    /*else*/ beep
            `,
            options: [4, { flatTernaryExpressions: true }],
            errors: expectedErrors([
                [3, 4, 6, "Identifier"],
                [4, 4, 2, "Identifier"]
            ])
        },
        {
            code: unIndent`
                var a =
                    foo
                    ? bar
                    : baz
            `,
            output: unIndent`
                var a =
                    foo
                        ? bar
                        : baz
            `,
            options: [4, { flatTernaryExpressions: true }],
            errors: expectedErrors([
                [3, 8, 4, "Punctuator"],
                [4, 8, 4, "Punctuator"]
            ])
        },
        {
            code: unIndent`
                foo ? bar
                    : baz ? qux
                    : foobar ? boop
                    : beep
            `,
            output: unIndent`
                foo ? bar
                    : baz ? qux
                        : foobar ? boop
                            : beep
            `,
            options: [4, { flatTernaryExpressions: false }],
            errors: expectedErrors([
                [3, 8, 4, "Punctuator"],
                [4, 12, 4, "Punctuator"]
            ])
        },
        {
            code: unIndent`
                foo ? bar :
                    baz ? qux :
                    foobar ? boop :
                    beep
            `,
            output: unIndent`
                foo ? bar :
                    baz ? qux :
                        foobar ? boop :
                            beep
            `,
            options: [4, { flatTernaryExpressions: false }],
            errors: expectedErrors([
                [3, 8, 4, "Identifier"],
                [4, 12, 4, "Identifier"]
            ])
        },
        {
            code: unIndent`
                foo
                    ? bar
                    : baz
                    ? qux
                    : foobar
                    ? boop
                    : beep
            `,
            output: unIndent`
                foo
                    ? bar
                    : baz
                        ? qux
                        : foobar
                            ? boop
                            : beep
            `,
            options: [4, { flatTernaryExpressions: false }],
            errors: expectedErrors([
                [4, 8, 4, "Punctuator"],
                [5, 8, 4, "Punctuator"],
                [6, 12, 4, "Punctuator"],
                [7, 12, 4, "Punctuator"]
            ])
        },
        {
            code: unIndent`
                foo ?
                    bar :
                    baz ?
                    qux :
                    foobar ?
                    boop :
                    beep
            `,
            output: unIndent`
                foo ?
                    bar :
                    baz ?
                        qux :
                        foobar ?
                            boop :
                            beep
            `,
            options: [4, { flatTernaryExpressions: false }],
            errors: expectedErrors([
                [4, 8, 4, "Identifier"],
                [5, 8, 4, "Identifier"],
                [6, 12, 4, "Identifier"],
                [7, 12, 4, "Identifier"]
            ])
        },
        {
            code: unIndent`
                foo.bar('baz', function(err) {
                          qux;
                });
            `,
            output: unIndent`
                foo.bar('baz', function(err) {
                  qux;
                });
            `,
            options: [2, { CallExpression: { arguments: "first" } }],
            errors: expectedErrors([2, 2, 10, "Identifier"])
        },
        {
            code: unIndent`
                foo.bar(function() {
                  cookies;
                }).baz(function() {
                    cookies;
                  });
            `,
            output: unIndent`
                foo.bar(function() {
                  cookies;
                }).baz(function() {
                  cookies;
                });
            `,
            options: [2, { MemberExpression: 1 }],
            errors: expectedErrors([[4, 2, 4, "Identifier"], [5, 0, 2, "Punctuator"]])
        },
        {
            code: unIndent`
                foo.bar().baz(function() {
                  cookies;
                }).qux(function() {
                    cookies;
                  });
            `,
            output: unIndent`
                foo.bar().baz(function() {
                  cookies;
                }).qux(function() {
                  cookies;
                });
            `,
            options: [2, { MemberExpression: 1 }],
            errors: expectedErrors([[4, 2, 4, "Identifier"], [5, 0, 2, "Punctuator"]])
        },
        {
            code: unIndent`
                [ foo,
                  bar ].forEach(function() {
                    baz;
                  })
            `,
            output: unIndent`
                [ foo,
                  bar ].forEach(function() {
                  baz;
                })
            `,
            options: [2, { ArrayExpression: "first", MemberExpression: 1 }],
            errors: expectedErrors([[3, 2, 4, "Identifier"], [4, 0, 2, "Punctuator"]])
        },
        {
            code: unIndent`
                foo[
                    bar
                    ];
            `,
            output: unIndent`
                foo[
                    bar
                ];
            `,
            options: [4, { MemberExpression: 1 }],
            errors: expectedErrors([3, 0, 4, "Punctuator"])
        },
        {
            code: unIndent`
                foo({
                bar: 1,
                baz: 2
                })
            `,
            output: unIndent`
                foo({
                    bar: 1,
                    baz: 2
                })
            `,
            options: [4, { ObjectExpression: "first" }],
            errors: expectedErrors([[2, 4, 0, "Identifier"], [3, 4, 0, "Identifier"]])
        },
        {
            code: unIndent`
                foo(
                                        bar, baz,
                                        qux);
            `,
            output: unIndent`
                foo(
                  bar, baz,
                  qux);
            `,
            options: [2, { CallExpression: { arguments: "first" } }],
            errors: expectedErrors([[2, 2, 24, "Identifier"], [3, 2, 24, "Identifier"]])
        },
        {
            code: unIndent`
                if (foo) bar()

                    ; [1, 2, 3].map(baz)
            `,
            output: unIndent`
                if (foo) bar()

                ; [1, 2, 3].map(baz)
            `,
            errors: expectedErrors([3, 0, 4, "Punctuator"])
        },
        {
            code: unIndent`
                if (foo)
                ;
            `,
            output: unIndent`
                if (foo)
                    ;
            `,
            errors: expectedErrors([2, 4, 0, "Punctuator"])
        },
        {
            code: unIndent`
                import {foo}
                from 'bar';
            `,
            output: unIndent`
                import {foo}
                    from 'bar';
            `,
            parserOptions: { sourceType: "module" },
            errors: expectedErrors([2, 4, 0, "Identifier"])
        },
        {
            code: unIndent`
                export {foo}
                from 'bar';
            `,
            output: unIndent`
                export {foo}
                    from 'bar';
            `,
            parserOptions: { sourceType: "module" },
            errors: expectedErrors([2, 4, 0, "Identifier"])
        },
        {
            code: unIndent`
                (
                    a
                ) => b => {
                        c
                    }
            `,
            output: unIndent`
                (
                    a
                ) => b => {
                    c
                }
            `,
            errors: expectedErrors([[4, 4, 8, "Identifier"], [5, 0, 4, "Punctuator"]])
        },
        {
            code: unIndent`
                (
                    a
                ) => b => c => d => {
                        e
                    }
            `,
            output: unIndent`
                (
                    a
                ) => b => c => d => {
                    e
                }
            `,
            errors: expectedErrors([[4, 4, 8, "Identifier"], [5, 0, 4, "Punctuator"]])
        },
        {
            code: unIndent`
                if (
                    foo
                ) bar(
                        baz
                    );
            `,
            output: unIndent`
                if (
                    foo
                ) bar(
                    baz
                );
            `,
            errors: expectedErrors([[4, 4, 8, "Identifier"], [5, 0, 4, "Punctuator"]])
        },
        {
            code: unIndent`
                (
                    foo
                )(
                        bar
                    )
            `,
            output: unIndent`
                (
                    foo
                )(
                    bar
                )
            `,
            errors: expectedErrors([[4, 4, 8, "Identifier"], [5, 0, 4, "Punctuator"]])
        },
        {
            code: unIndent`
                (() =>
                    foo
                )(
                        bar
                    )
            `,
            output: unIndent`
                (() =>
                    foo
                )(
                    bar
                )
            `,
            errors: expectedErrors([[4, 4, 8, "Identifier"], [5, 0, 4, "Punctuator"]])
        },
        {
            code: unIndent`
                (() => {
                    foo();
                })(
                        bar
                    )
            `,
            output: unIndent`
                (() => {
                    foo();
                })(
                    bar
                )
            `,
            errors: expectedErrors([[4, 4, 8, "Identifier"], [5, 0, 4, "Punctuator"]])
        },
        {
            code: unIndent`
                foo.
                  bar.
                      baz
            `,
            output: unIndent`
                foo.
                    bar.
                    baz
            `,
            errors: expectedErrors([[2, 4, 2, "Identifier"], [3, 4, 6, "Identifier"]])
        },
        {
            code: unIndent`
                const foo = a.b(),
                    longName
                    = (baz(
                            'bar',
                            'bar'
                        ));
            `,
            output: unIndent`
                const foo = a.b(),
                    longName
                    = (baz(
                        'bar',
                        'bar'
                    ));
            `,
            errors: expectedErrors([[4, 8, 12, "String"], [5, 8, 12, "String"], [6, 4, 8, "Punctuator"]])
        },
        {
            code: unIndent`
                const foo = a.b(),
                    longName =
                    (baz(
                            'bar',
                            'bar'
                        ));
            `,
            output: unIndent`
                const foo = a.b(),
                    longName =
                    (baz(
                        'bar',
                        'bar'
                    ));
            `,
            errors: expectedErrors([[4, 8, 12, "String"], [5, 8, 12, "String"], [6, 4, 8, "Punctuator"]])
        },
        {
            code: unIndent`
                const foo = a.b(),
                    longName
                        =baz(
                            'bar',
                            'bar'
                    );
            `,
            output: unIndent`
                const foo = a.b(),
                    longName
                        =baz(
                            'bar',
                            'bar'
                        );
            `,
            errors: expectedErrors([[6, 8, 4, "Punctuator"]])
        },
        {
            code: unIndent`
                const foo = a.b(),
                    longName
                        =(
                        'fff'
                        );
            `,
            output: unIndent`
                const foo = a.b(),
                    longName
                        =(
                            'fff'
                        );
            `,
            errors: expectedErrors([[4, 12, 8, "String"]])
        },

        //----------------------------------------------------------------------
        // Ignore Unknown Nodes
        //----------------------------------------------------------------------

        {
            code: unIndent`
                namespace Foo {
                    const bar = 3,
                    baz = 2;

                    if (true) {
                    const bax = 3;
                    }
                }
            `,
            output: unIndent`
                namespace Foo {
                    const bar = 3,
                        baz = 2;

                    if (true) {
                        const bax = 3;
                    }
                }
            `,
            errors: expectedErrors([[3, 8, 4, "Identifier"], [6, 8, 4, "Keyword"]]),
            parser: parser("unknown-nodes/namespace-invalid")
        },
        {
            code: unIndent`
                abstract class Foo {
                    public bar() {
                        let aaa = 4,
                        boo;

                        if (true) {
                        boo = 3;
                        }

                    boo = 3 + 2;
                    }
                }
            `,
            output: unIndent`
                abstract class Foo {
                    public bar() {
                        let aaa = 4,
                            boo;

                        if (true) {
                            boo = 3;
                        }

                        boo = 3 + 2;
                    }
                }
            `,
            errors: expectedErrors([[4, 12, 8, "Identifier"], [7, 12, 8, "Identifier"], [10, 8, 4, "Identifier"]]),
            parser: parser("unknown-nodes/abstract-class-invalid")
        },
        {
            code: unIndent`
                function foo() {
                    function bar() {
                        abstract class X {
                        public baz() {
                        if (true) {
                        qux();
                        }
                        }
                        }
                    }
                }
            `,
            output: unIndent`
                function foo() {
                    function bar() {
                        abstract class X {
                            public baz() {
                                if (true) {
                                    qux();
                                }
                            }
                        }
                    }
                }
            `,
            errors: expectedErrors([
                [4, 12, 8, "Keyword"],
                [5, 16, 8, "Keyword"],
                [6, 20, 8, "Identifier"],
                [7, 16, 8, "Punctuator"],
                [8, 12, 8, "Punctuator"]
            ]),
            parser: parser("unknown-nodes/functions-with-abstract-class-invalid")
        },
        {
            code: unIndent`
                namespace Unknown {
                    function foo() {
                    function bar() {
                            abstract class X {
                                public baz() {
                                    if (true) {
                                    qux();
                                    }
                                }
                            }
                        }
                    }
                }
            `,
            output: unIndent`
                namespace Unknown {
                    function foo() {
                        function bar() {
                            abstract class X {
                                public baz() {
                                    if (true) {
                                        qux();
                                    }
                                }
                            }
                        }
                    }
                }
            `,
            errors: expectedErrors([
                [3, 8, 4, "Keyword"],
                [7, 24, 20, "Identifier"]
            ]),
            parser: parser("unknown-nodes/namespace-with-functions-with-abstract-class-invalid")
        },

        //----------------------------------------------------------------------
        // JSX tests
        // Some of the following tests are adapted from the the tests in eslint-plugin-react.
        // License: https://github.com/yannickcr/eslint-plugin-react/blob/7ca9841f22d599f447a27ef5b2a97def9229d6c8/LICENSE
        //----------------------------------------------------------------------

        {
            code: unIndent`
                <App>
                  <Foo />
                </App>
            `,
            output: unIndent`
                <App>
                    <Foo />
                </App>
            `,
            errors: expectedErrors([2, 4, 2, "Punctuator"])
        },
        {
            code: unIndent`
                <App>
                    <Foo />
                </App>
            `,
            output: unIndent`
                <App>
                  <Foo />
                </App>
            `,
            options: [2],
            errors: expectedErrors([2, 2, 4, "Punctuator"])
        },
        {
            code: unIndent`
                <App>
                    <Foo />
                </App>
            `,
            output: unIndent`
                <App>
                \t<Foo />
                </App>
            `,
            options: ["tab"],
            errors: expectedErrors([2, "1 tab", "4 spaces", "Punctuator"])
        },
        {
            code: unIndent`
                function App() {
                  return <App>
                    <Foo />
                         </App>;
                }
            `,
            output: unIndent`
                function App() {
                  return <App>
                    <Foo />
                  </App>;
                }
            `,
            options: [2],
            errors: expectedErrors([4, 2, 9, "Punctuator"])
        },
        {
            code: unIndent`
                function App() {
                  return (<App>
                    <Foo />
                    </App>);
                }
            `,
            output: unIndent`
                function App() {
                  return (<App>
                    <Foo />
                  </App>);
                }
            `,
            options: [2],
            errors: expectedErrors([4, 2, 4, "Punctuator"])
        },
        {
            code: unIndent`
                function App() {
                  return (
                <App>
                  <Foo />
                </App>
                  );
                }
            `,
            output: unIndent`
                function App() {
                  return (
                    <App>
                      <Foo />
                    </App>
                  );
                }
            `,
            options: [2],
            errors: expectedErrors([[3, 4, 0, "Punctuator"], [4, 6, 2, "Punctuator"], [5, 4, 0, "Punctuator"]])
        },
        {
            code: unIndent`
                <App>
                 {test}
                </App>
            `,
            output: unIndent`
                <App>
                    {test}
                </App>
            `,
            errors: expectedErrors([2, 4, 1, "Punctuator"])
        },
        {
            code: unIndent`
                <App>
                    {options.map((option, index) => (
                        <option key={index} value={option.key}>
                           {option.name}
                        </option>
                    ))}
                </App>
            `,
            output: unIndent`
                <App>
                    {options.map((option, index) => (
                        <option key={index} value={option.key}>
                            {option.name}
                        </option>
                    ))}
                </App>
            `,
            errors: expectedErrors([4, 12, 11, "Punctuator"])
        },
        {
            code: unIndent`
                [
                  <div />,
                    <div />
                ]
            `,
            output: unIndent`
                [
                  <div />,
                  <div />
                ]
            `,
            options: [2],
            errors: expectedErrors([3, 2, 4, "Punctuator"])
        },
        {
            code: unIndent`
                <App>

                 <Foo />

                </App>
            `,
            output: unIndent`
                <App>

                \t<Foo />

                </App>
            `,
            options: ["tab"],
            errors: expectedErrors([3, "1 tab", "1 space", "Punctuator"])
        },
        {

            /*
             * Multiline ternary
             * (colon at the end of the first expression)
             */
            code: unIndent`
                foo ?
                    <Foo /> :
                <Bar />
            `,
            output: unIndent`
                foo ?
                    <Foo /> :
                    <Bar />
            `,
            errors: expectedErrors([3, 4, 0, "Punctuator"])
        },
        {

            /*
             * Multiline ternary
             * (colon on its own line)
             */
            code: unIndent`
                foo ?
                    <Foo />
                :
                <Bar />
            `,
            output: unIndent`
                foo ?
                    <Foo />
                    :
                    <Bar />
            `,
            errors: expectedErrors([[3, 4, 0, "Punctuator"], [4, 4, 0, "Punctuator"]])
        },
        {

            /*
             * Multiline ternary
             * (colon at the end of the first expression, parenthesized first expression)
             */
            code: unIndent`
                foo ? (
                    <Foo />
                ) :
                <Bar />
            `,
            output: unIndent`
                foo ? (
                    <Foo />
                ) :
                    <Bar />
            `,
            errors: expectedErrors([4, 4, 0, "Punctuator"])
        },
        {
            code: unIndent`
                <App
                  foo
                />
            `,
            output: unIndent`
                <App
                    foo
                />
            `,
            errors: expectedErrors([2, 4, 2, "JSXIdentifier"])
        },
        {
            code: unIndent`
                <App
                  foo
                  />
            `,
            output: unIndent`
                <App
                  foo
                />
            `,
            options: [2],
            errors: expectedErrors([3, 0, 2, "Punctuator"])
        },
        {
            code: unIndent`
                <App
                  foo
                  ></App>
            `,
            output: unIndent`
                <App
                  foo
                ></App>
            `,
            options: [2],
            errors: expectedErrors([3, 0, 2, "Punctuator"])
        },
        {
            code: unIndent`
                const Button = function(props) {
                  return (
                    <Button
                      size={size}
                      onClick={onClick}
                                                    >
                      Button Text
                    </Button>
                  );
                };
            `,
            output: unIndent`
                const Button = function(props) {
                  return (
                    <Button
                      size={size}
                      onClick={onClick}
                    >
                      Button Text
                    </Button>
                  );
                };
            `,
            options: [2],
            errors: expectedErrors([6, 4, 36, "Punctuator"])
        },
        {
            code: unIndent`
                var x = function() {
                  return <App
                    foo
                         />
                }
            `,
            output: unIndent`
                var x = function() {
                  return <App
                    foo
                  />
                }
            `,
            options: [2],
            errors: expectedErrors([4, 2, 9, "Punctuator"])
        },
        {
            code: unIndent`
                var x = <App
                  foo
                        />
            `,
            output: unIndent`
                var x = <App
                  foo
                />
            `,
            options: [2],
            errors: expectedErrors([3, 0, 8, "Punctuator"])
        },
        {
            code: unIndent`
                var x = (
                  <Something
                    />
                )
            `,
            output: unIndent`
                var x = (
                  <Something
                  />
                )
            `,
            options: [2],
            errors: expectedErrors([3, 2, 4, "Punctuator"])
        },
        {
            code: unIndent`
                <App
                \tfoo
                \t/>
            `,
            output: unIndent`
                <App
                \tfoo
                />
            `,
            options: ["tab"],
            errors: expectedErrors("tab", [3, 0, 1, "Punctuator"])
        },
        {
            code: unIndent`
                <App
                \tfoo
                \t></App>
            `,
            output: unIndent`
                <App
                \tfoo
                ></App>
            `,
            options: ["tab"],
            errors: expectedErrors("tab", [3, 0, 1, "Punctuator"])
        },
        {
            code: unIndent`
                <
                    foo
                    .bar
                    .baz
                >
                    foo
                </
                    foo.
                    bar.
                    baz
                >
            `,
            output: unIndent`
                <
                    foo
                        .bar
                        .baz
                >
                    foo
                </
                    foo.
                        bar.
                        baz
                >
            `,
            errors: expectedErrors([
                [3, 8, 4, "Punctuator"],
                [4, 8, 4, "Punctuator"],
                [9, 8, 4, "JSXIdentifier"],
                [10, 8, 4, "JSXIdentifier"]
            ])
        },
        {
            code: unIndent`
                <
                    input
                    type=
                    "number"
                />
            `,
            output: unIndent`
                <
                    input
                    type=
                        "number"
                />
            `,
            errors: expectedErrors([4, 8, 4, "JSXText"])
        },
        {
            code: unIndent`
                <
                    input
                    type=
                    {'number'}
                />
            `,
            output: unIndent`
                <
                    input
                    type=
                        {'number'}
                />
            `,
            errors: expectedErrors([4, 8, 4, "Punctuator"])
        },
        {
            code: unIndent`
                <
                    input
                    type
                    ="number"
                />
            `,
            output: unIndent`
                <
                    input
                    type
                        ="number"
                />
            `,
            errors: expectedErrors([4, 8, 4, "Punctuator"])
        },
        {
            code: unIndent`
                foo ? (
                    bar
                ) : (
                        baz
                    )
            `,
            output: unIndent`
                foo ? (
                    bar
                ) : (
                    baz
                )
            `,
            errors: expectedErrors([[4, 4, 8, "Identifier"], [5, 0, 4, "Punctuator"]])
        },
        {
            code: unIndent`
                foo ? (
                    <div>
                    </div>
                ) : (
                        <span>
                        </span>
                    )
            `,
            output: unIndent`
                foo ? (
                    <div>
                    </div>
                ) : (
                    <span>
                    </span>
                )
            `,
            errors: expectedErrors([[5, 4, 8, "Punctuator"], [6, 4, 8, "Punctuator"], [7, 0, 4, "Punctuator"]])
        },
        {
            code: unIndent`
                <div>
                    {
                    (
                        1
                    )
                    }
                </div>
            `,
            output: unIndent`
                <div>
                    {
                        (
                            1
                        )
                    }
                </div>
            `,
            errors: expectedErrors([[3, 8, 4, "Punctuator"], [4, 12, 8, "Numeric"], [5, 8, 4, "Punctuator"]])
        },
        {
            code: unIndent`
                <div>
                    {
                      /* foo */
                    }
                </div>
            `,
            output: unIndent`
                <div>
                    {
                        /* foo */
                    }
                </div>
            `,
            errors: expectedErrors([3, 8, 6, "Block"])
        },
        {
            code: unIndent`
                <div>foo
                <div>bar</div>
                </div>
            `,
            output: unIndent`
                <div>foo
                    <div>bar</div>
                </div>
            `,
            errors: expectedErrors([2, 4, 0, "Punctuator"])
        },
        {
            code: unIndent`
                <small>Foo bar&nbsp;
                <a>baz qux</a>.
                </small>
            `,
            output: unIndent`
                <small>Foo bar&nbsp;
                    <a>baz qux</a>.
                </small>
            `,
            errors: expectedErrors([2, 4, 0, "Punctuator"])
        },
        {
            code: unIndent`
                ({
                    foo
                    }: bar) => baz
            `,
            output: unIndent`
                ({
                    foo
                }: bar) => baz
            `,
            errors: expectedErrors([3, 0, 4, "Punctuator"]),
            parser: require.resolve("../../fixtures/parsers/babel-eslint7/object-pattern-with-annotation")
        },
        {
            code: unIndent`
                ([
                    foo
                    ]: bar) => baz
            `,
            output: unIndent`
                ([
                    foo
                ]: bar) => baz
            `,
            errors: expectedErrors([3, 0, 4, "Punctuator"]),
            parser: require.resolve("../../fixtures/parsers/babel-eslint7/array-pattern-with-annotation")
        },
        {
            code: unIndent`
                ({
                    foo
                    }: {}) => baz
            `,
            output: unIndent`
                ({
                    foo
                }: {}) => baz
            `,
            errors: expectedErrors([3, 0, 4, "Punctuator"]),
            parser: require.resolve("../../fixtures/parsers/babel-eslint7/object-pattern-with-object-annotation")
        },
        {
            code: unIndent`
                class Foo {
                foo() {
                bar();
                }
                }
            `,
            output: unIndent`
                class Foo {
                foo() {
                    bar();
                }
                }
            `,
            options: [4, { ignoredNodes: ["ClassBody"] }],
            errors: expectedErrors([3, 4, 0, "Identifier"])
        },
        {
            code: unIndent`
                $(function() {

                foo();
                bar();

                foo(function() {
                baz();
                });

                });
            `,
            output: unIndent`
                $(function() {

                foo();
                bar();

                foo(function() {
                    baz();
                });

                });
            `,
            options: [4, {
                ignoredNodes: ["ExpressionStatement > CallExpression[callee.name='$'] > FunctionExpression > BlockStatement"]
            }],
            errors: expectedErrors([7, 4, 0, "Identifier"])
        },
        {
            code: unIndent`
                (function($) {
                $(function() {
                foo;
                });
                })()
            `,
            output: unIndent`
                (function($) {
                $(function() {
                    foo;
                });
                })()
            `,
            options: [4, {
                ignoredNodes: ["ExpressionStatement > CallExpression > FunctionExpression.callee > BlockStatement"]
            }],
            errors: expectedErrors([3, 4, 0, "Identifier"])
        },
        {
            code: unIndent`
                if (foo) {
                    doSomething();

                // Intentionally unindented comment
                    doSomethingElse();
                }
            `,
            output: unIndent`
                if (foo) {
                    doSomething();

                    // Intentionally unindented comment
                    doSomethingElse();
                }
            `,
            options: [4, { ignoreComments: false }],
            errors: expectedErrors([4, 4, 0, "Line"])
        },
        {
            code: unIndent`
                if (foo) {
                    doSomething();

                /* Intentionally unindented comment */
                    doSomethingElse();
                }
            `,
            output: unIndent`
                if (foo) {
                    doSomething();

                    /* Intentionally unindented comment */
                    doSomethingElse();
                }
            `,
            options: [4, { ignoreComments: false }],
            errors: expectedErrors([4, 4, 0, "Block"])
        },
        {
            code: unIndent`
                const obj = {
                    foo () {
                        return condition ? // comment
                        1 :
                            2
                    }
                }
            `,
            output: unIndent`
                const obj = {
                    foo () {
                        return condition ? // comment
                            1 :
                            2
                    }
                }
            `,
            errors: expectedErrors([4, 12, 8, "Numeric"])
        },

        //----------------------------------------------------------------------
        // Comment alignment tests
        //----------------------------------------------------------------------
        {
            code: unIndent`
                if (foo) {

                // Comment cannot align with code immediately above if there is a whitespace gap
                    doSomething();
                }
            `,
            output: unIndent`
                if (foo) {

                    // Comment cannot align with code immediately above if there is a whitespace gap
                    doSomething();
                }
            `,
            errors: expectedErrors([3, 4, 0, "Line"])
        },
        {
            code: unIndent`
                if (foo) {
                    foo(
                        bar);
                // Comment cannot align with code immediately below if there is a whitespace gap

                }
            `,
            output: unIndent`
                if (foo) {
                    foo(
                        bar);
                    // Comment cannot align with code immediately below if there is a whitespace gap

                }
            `,
            errors: expectedErrors([4, 4, 0, "Line"])
        },
        {
            code: unIndent`
                [{
                    foo
                },

                    // Comment between nodes

                {
                    bar
                }];
            `,
            output: unIndent`
                [{
                    foo
                },

                // Comment between nodes

                {
                    bar
                }];
            `,
            errors: expectedErrors([5, 0, 4, "Line"])
        }
    ]
});
