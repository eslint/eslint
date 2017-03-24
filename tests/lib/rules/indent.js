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

/**
 * Create error message object for failure cases with a single 'found' indentation type
 * @param {string} indentType indent type of string or tab
 * @param {array} errors error info
 * @returns {Object} returns the error messages collection
 * @private
 */
function expectedErrors(indentType, errors) {
    if (Array.isArray(indentType)) {
        errors = indentType;
        indentType = "space";
    }

    if (!errors[0].length) {
        errors = [errors];
    }

    return errors.map(err => {
        let message;

        if (typeof err[1] === "string" && typeof err[2] === "string") {
            message = `Expected indentation of ${err[1]} but found ${err[2]}.`;
        } else {
            const chars = indentType + (err[1] === 1 ? "" : "s");

            message = `Expected indentation of ${err[1]} ${chars} but found ${err[2]}.`;
        }
        return { message, type: err[3], line: err[0], endLine: err[0], column: 1, endColumn: parseInt(err[2], 10) + 1 };
    });
}

/**
* Prevents leading spaces in a multiline template literal from appearing in the resulting string
* @param {string[]} strings The strings in the template literal
* @returns {string} The template literal, with spaces removed from all lines
*/
function unIndent(strings) {
    const templateValue = strings[0];
    const lines = templateValue.replace(/^\n/, "").replace(/\n\s*$/, "").split("\n");
    const lineIndents = lines.filter(line => line.trim()).map(line => line.match(/ */)[0].length);
    const minLineIndent = Math.min.apply(null, lineIndents);

    return lines.map(line => line.slice(minLineIndent)).join("\n");
}

const ruleTester = new RuleTester();

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
            options: [4],
            parserOptions: { ecmaVersion: 6 }
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
            options: [4],
            parserOptions: { ecmaVersion: 6 }
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
            code: "var x = 0 && { a: 1, b: 2 };",
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
            options: [2],
            parserOptions: { ecmaVersion: 6 }
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
            options: [2, { VariableDeclarator: 1, SwitchCase: 1 }],
            parserOptions: { ecmaVersion: 6 }
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
        {
            code: unIndent`
                [{
                    foo: 1
                }, {
                    foo: 2
                }, {
                    foo: 3
                }]
            `
        },
        {
            code: unIndent`
                foo([
                    bar
                ], [
                    baz
                ], [
                    qux
                ]);
            `
        },
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
        {
            code: unIndent`
                var foo = bar ||
                    !(
                        baz
                    );
            `
        },
        {
            code: unIndent`
                for (var foo = 1;
                    foo < 10;
                    foo++) {}
            `
        },
        {
            code: unIndent`
                for (
                    var foo = 1;
                    foo < 10;
                    foo++
                ) {}
            `
        },
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
            options: [2, { VariableDeclarator: 2 }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: unIndent`
                const geometry = 2,
                    rotate = 3;
            `,
            options: [2, { VariableDeclarator: 2 }],
            parserOptions: { ecmaVersion: 6 }
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
            options: [4],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: unIndent`
                [a, b,
                    c].forEach(function(index){
                        return index;
                    });
            `,
            options: [4],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: unIndent`
                [a, b, c].forEach((index) => {
                    index;
                });
            `,
            options: [4],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: unIndent`
                [a, b, c].forEach(function(index){
                    return index;
                });
            `,
            options: [4],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: unIndent`
                (foo)
                    .bar([
                        baz
                    ]);
            `,
            options: [4, { MemberExpression: 1 }],
            parserOptions: { ecmaVersion: 6 }
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
        {
            code: unIndent`
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
            `
        },
        {
            code: unIndent`
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
            `
        },
        {
            code: unIndent`
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
            `
        },
        {
            code: unIndent`
                switch (a) {
                case "foo":
                    a();
                    break;
                case "bar":
                    a(); break;
                case "baz":
                    a(); break;
                }
            `
        },
        {
            code: unIndent`
                switch (0) {
                }
            `
        },
        {
            code: unIndent`
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
            `
        },
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
        {
            code: unIndent`
                var obj = {foo: 1, bar: 2};
                with (obj) {
                    console.log(foo + bar);
                }
            `
        },
        {
            code: unIndent`
                if (a) {
                    (1 + 2 + 3); // no error on this line
                }
            `
        },
        {
            code: "switch(value){ default: a(); break; }"
        },
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
            options: [2, { VariableDeclarator: 3 }],
            parserOptions: { ecmaVersion: 6 }

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
            options: [2, { VariableDeclarator: { const: 3, let: 2 } }],
            parserOptions: { ecmaVersion: 6 }
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
            options: [2, { VariableDeclarator: { var: 2, const: 3 }, SwitchCase: 1 }],
            parserOptions: { ecmaVersion: 6 }
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
        {
            code: unIndent`
                var a = 1
                    ,b = 2
                    ;
            `
        },
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
            parserOptions: { sourceType: "module" },
            options: [2, { FunctionDeclaration: { parameters: "first" } }]
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
            parserOptions: { sourceType: "module" },
            options: [2, { FunctionDeclaration: { parameters: "first" } }]
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
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
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
        {
            code: unIndent`
                const someOtherFunction = argument => {
                        console.log(argument);
                    },
                    someOtherValue = 'someOtherValue';
            `,
            parserOptions: { ecmaVersion: 6 }
        },
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
            options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
            parserOptions: { ecmaVersion: 6 }
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
            options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: unIndent`
                class A{
                    constructor(){}
                    a(){}
                    get b(){}
                }
            `,
            options: [4, { VariableDeclarator: 1, SwitchCase: 1 }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: unIndent`
                var A = class {
                    constructor(){}
                    a(){}
                    get b(){}
                }
            `,
            options: [4, { VariableDeclarator: 1, SwitchCase: 1 }],
            parserOptions: { ecmaVersion: 6 }
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
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
            options: [2]
        },
        {
            code: unIndent`
                class Foo extends
                  Bar {
                  baz() {}
                }
            `,
            parserOptions: { ecmaVersion: 6 },
            options: [2]
        },
        {
            code: unIndent`
                fs.readdirSync(path.join(__dirname, '../rules')).forEach(name => {
                  files[name] = foo;
                });
            `,
            options: [2, { outerIIFEBody: 0 }],
            parserOptions: { ecmaVersion: 6 }
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
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
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
        {
            code: unIndent`
                [
                    foo ?
                        bar :
                        baz,
                    qux
                ];
            `
        },
        {

            // Checking comments:
            // https://github.com/eslint/eslint/issues/3845, https://github.com/eslint/eslint/issues/6571
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
        {
            code: unIndent`
                [
                    // no elements
                ]
            `
        },
        {

            // Destructuring assignments:
            // https://github.com/eslint/eslint/issues/6813
            code: unIndent`
                var {
                  foo,
                  bar,
                  baz: qux,
                  foobar: baz = foobar
                } = qux;
            `,
            options: [2],
            parserOptions: { ecmaVersion: 6 }
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
            options: [2],
            parserOptions: { ecmaVersion: 6 }
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
            options: [2],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: unIndent`
                var x = () =>
                  5;
            `,
            options: [2],
            parserOptions: { ecmaVersion: 6 }
        },
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
        {
            code: unIndent`
                function foo() {
                    return (bar === 1 || bar === 2 &&
                        (/Function/.test(grandparent.type))) &&
                        directives(parent).indexOf(node) >= 0;
                }
            `
        },
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
        {
            code: unIndent`
                if (
                    foo === 1 ||
                    bar === 1 ||
                    // comment
                    (baz === 1 && qux === 1)
                ) {}
            `
        },
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
        {
            code: unIndent`
                foo(
                    (bar)
                );
            `
        },
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
        {
            code: unIndent`
                var foo = [
                    bar,
                    baz
                ]
            `
        },
        {
            code: unIndent`
                var foo = [bar,
                    baz,
                    qux
                ]
            `
        },
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
            options: [2, { ObjectExpression: 1 }],
            parserOptions: { ecmaVersion: 6 }
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
            options: [2, { ObjectExpression: "first" }],
            parserOptions: { ecmaVersion: 6 }
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
            options: [2],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: unIndent`
                \`foo\${
                  \`bar\${
                    baz}\`}\`
            `,
            options: [2],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: unIndent`
                \`foo\${
                  \`bar\${
                    baz
                  }\`
                }\`
            `,
            options: [2],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: unIndent`
                \`foo\${
                  (
                    bar
                  )
                }\`
            `,
            options: [2],
            parserOptions: { ecmaVersion: 6 }
        },
        {

            code: unIndent`
                function foo() {
                    \`foo\${bar}baz\${
                        qux}foo\${
                        bar}baz\`
                }
            `,
            parserOptions: { ecmaVersion: 6 }
        },
        {

            // https://github.com/eslint/eslint/issues/7320
            code: unIndent`
                JSON
                    .stringify(
                        {
                            ok: true
                        }
                    );
            `
        },

        // Don't check AssignmentExpression assignments
        {
            code: unIndent`
                foo =
                    bar =
                    baz;
            `
        },
        {
            code: unIndent`
                foo =
                bar =
                    baz;
            `
        },
        {
            code: unIndent`
                function foo() {
                    const template = \`this indentation is not checked
                because it's part of a template literal.\`;
                }
            `,
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: unIndent`
                function foo() {
                    const template = \`the indentation of a \${
                        node.type
                    } node is checked.\`;
                }
            `,
            parserOptions: { ecmaVersion: 6 }
        },
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
        {
            code: unIndent`
                [
                    foo,
                    // comment
                    // another comment
                    bar
                ]
            `
        },
        {
            code: unIndent`
                if (foo) {
                    /* comment */ bar();
                }
            `
        },
        {
            code: unIndent`
                function foo() {
                    return (
                        1
                    );
                }
            `
        },
        {
            code: unIndent`
                function foo() {
                    return (
                        1
                    )
                }
            `
        },
        {
            code: unIndent`
                if (
                    foo &&
                    !(
                        bar
                    )
                ) {}
            `
        },
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
            `
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
            options: [4, { MemberExpression: 1 }]
        },

        // https://github.com/eslint/eslint/issues/7242
        {
            code: unIndent`
                var x = [
                    [1],
                    [2]
                ]
            `
        },
        {
            code: unIndent`
                var y = [
                    {a: 1},
                    {b: 2}
                ]
            `
        },
        {

            // https://github.com/eslint/eslint/issues/7522
            code: unIndent`
                foo(
                )
            `
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
            options: [4, { CallExpression: { arguments: "first" } }]
        },
        {
            code: "new Foo"
        },
        {
            code: "new (Foo)"
        },
        {
            code: unIndent`
                if (Foo) {
                    new Foo
                }
            `
        },
        {
            code: unIndent`
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
            options: [2, { ObjectExpression: "first" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: unIndent`
                foo(() => {
                    bar;
                }, () => {
                    baz;
                })
            `,
            options: [4, { CallExpression: { arguments: "first" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: unIndent`
                [ foop,
                  bar ].forEach(function() {
                    baz;
                  })
            `,
            options: [2, { ArrayExpression: "first", MemberExpression: 1 }]
        },
        {
            code: unIndent`
                foo = bar[
                    baz
                ];
            `
        },
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
        {
            code: unIndent`
                if (foo)
                    bar;
                else if (baz)
                    qux;
            `
        }
    ],


    invalid: [
        {
            code: unIndent`
                var a = b;
                if (a) {
                b();
                }
            `,
            options: [2],
            errors: expectedErrors([[3, 2, 0, "Identifier"]]),
            output: unIndent`
                var a = b;
                if (a) {
                  b();
                }
            `
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
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
            errors: expectedErrors([
                [2, 4, 0, "Identifier"],
                [3, 8, 2, "Identifier"],
                [4, 4, 0, "Punctuator"]
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
            parserOptions: { ecmaVersion: 6 },
            errors: expectedErrors([
                [2, 4, 0, "Identifier"],
                [3, 8, 2, "Keyword"],
                [4, 4, 0, "Punctuator"]
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
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
            errors: expectedErrors([
                [2, 4, 9, "String"],
                [3, 4, 9, "String"],
                [4, 4, 9, "String"],
                [5, 0, 2, "Punctuator"]
            ])
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
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
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

            // Checking comments:
            // https://github.com/eslint/eslint/issues/6571
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

            // Destructuring assignments:
            // https://github.com/eslint/eslint/issues/6813
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
            parserOptions: { ecmaVersion: 6 },
            errors: expectedErrors([[2, 2, 0, "Identifier"], [4, 2, 4, "Identifier"], [5, 2, 6, "Identifier"], [6, 0, 2, "Punctuator"]])
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
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
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
            errors: expectedErrors([[4, 4, 8, "Identifier"], [5, 0, 4, "Template"]]),
            parserOptions: { ecmaVersion: 6 }
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
            errors: expectedErrors([4, 4, 12, "Identifier"]),
            parserOptions: { ecmaVersion: 6 }
        },
        {

            // https://github.com/eslint/eslint/issues/1801
            // Note: This issue also mentioned checking the indentation for the 2 below. However,
            // this is intentionally ignored because everyone seems to have a different idea of how
            // BinaryExpressions should be indented.
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
                export {
                foo,
                        bar,
                  baz
                }
            `,
            output: unIndent`
                export {
                    foo,
                    bar,
                    baz
                }
            `,
            parserOptions: { sourceType: "module" },
            errors: expectedErrors([[2, 4, 0, "Identifier"], [3, 4, 8, "Identifier"], [4, 4, 2, "Identifier"]])
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
            options: [4, { flatTernaryExpressions: true }],
            errors: expectedErrors([
                [4, 4, 8, "Punctuator"],
                [5, 4, 8, "Punctuator"],
                [6, 4, 12, "Punctuator"],
                [7, 4, 12, "Punctuator"]
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
            options: [4, { flatTernaryExpressions: true }],
            errors: expectedErrors([
                [4, 4, 8, "Identifier"],
                [5, 4, 8, "Identifier"],
                [6, 4, 12, "Identifier"],
                [7, 4, 12, "Identifier"]
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
                [ foop,
                  bar ].forEach(function() {
                  baz;
                })
            `,
            output: unIndent`
                [ foop,
                  bar ].forEach(function() {
                    baz;
                  })
            `,
            options: [2, { ArrayExpression: "first", MemberExpression: 1 }],
            errors: expectedErrors([[3, 4, 2, "Identifier"], [4, 2, 0, "Punctuator"]])
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
        }
    ]
});
