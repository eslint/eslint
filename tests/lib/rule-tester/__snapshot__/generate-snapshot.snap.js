// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`RuleTester:generateSnapshot produces the snapshot for multiple lines 1`] = `
"
                    var foo = \\"const a = 1\\";
                    var a = eval(foo);
                            ~~~~~~~~~    [eval sucks.]
                    var bar = \\"const a = 2\\";
                    function test() {
                        return eval(bar);
                               ~~~~~~~~~    [eval sucks.]
                    }
                "
`;

exports[`RuleTester:generateSnapshot produces the snapshot for single line 1`] = `
"
                    eval(foo)
                    ~~~~~~~~~    [eval sucks.]
                "
`;
