/**
 * @fileoverview Tests for switch-final-break rule.
 * @author Eran Shabi <https://github.com/eranshabi>
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require("../../../lib/rule-tester");
const rule = require("../../../lib/rules/switch-final-break");

const ruleTester = new RuleTester();

ruleTester.run("switch-final-break", rule, {
    valid: [

        // default option
        `switch (x) {
    case 0:
        foo();
}
`,
        `
    switch (x) {}
    `,
        `
switch (x) {
    case 0: {
        foo();
    }
}
`,
        `switch (x) {
    default:
        foo();
}
`,
        `switch (x) {
    default: {
        foo();
    }
}
`,
        `
switch (x) {
    case 0:
}
`,
        `outer: while (true) {
    switch (x) {
        case 0:
            x++;
            break;
        default:
            break outer;
    }
}`,

        // always option
        {
            code: `switch (x) {
  case 0:
    foo();
    break;
  }`,
            options: ["always"]
        },
        {
            code: `switch (x) {
  case 0: {
      foo();
      break;
    }
  }`,
            options: ["always"]
        },
        {
            code: `switch (x) {
  default:
    foo();
    break;
  }`,
            options: ["always"]
        },
        {
            code: `function a() {
            switch (x) {
              case 0: throw 1;
              }
  }`,
            options: ["always"]
        },
        {
            code: `function a() {
            switch (x) {
              case 0: return 1;
              }
  }`,
            options: ["always"]
        },
        {
            code: `function a() {
            switch (x) {
              case 0: return 1; console.log(1);
              }
  }`,
            options: ["always"]
        },
        {
            code: `function a() { switch (foo) {
                  case bar:
                    if (baz) {
                      return 1;
                    } else {
                      return 2;
                    }
                }
                }`,
            options: ["always"]
        },
        {
            code: `function a() { switch (foo) {
                  case bar:
                    console.log(1);
                  case baz:
                    console.log(2);
                    break;
                }
                }`,
            options: ["always"]
        }
    ],
    invalid: [
        {
            code: `switch (x) {
    case 0:
        foo();
        break;
}
      `,
            output: `switch (x) {
    case 0:
        foo();
}
      `,
            errors: [
                {
                    messageId: "switchFinalBreakNever",
                    line: 4,
                    column: 9
                }
            ]
        },
        {
            code: `
switch (x) {
    case 0: {
        foo();
        break;
    }
}
      `,
            output: `
switch (x) {
    case 0: {
        foo();
    }
}
      `,
            errors: [
                {
                    messageId: "switchFinalBreakNever",
                    line: 5,
                    column: 9
                }
            ]
        },
        {
            code: `switch (x) {
    case 0: {
        foo();break;
    }
}`,
            output: `switch (x) {
    case 0: {
        foo();
    }
}`,
            errors: [
                {
                    messageId: "switchFinalBreakNever",
                    line: 3,
                    column: 15
                }
            ]
        },
        {
            code: `switch (x) {
    case 0: {
        foo();  break;
    }
}`,
            output: `switch (x) {
    case 0: {
        foo();
    }
}`,
            errors: [
                {
                    messageId: "switchFinalBreakNever",
                    line: 3,
                    column: 17
                }
            ]
        },
        {
            code: `
switch (x) {
    default:
        foo();
        break;
}
      `,
            output: `
switch (x) {
    default:
        foo();
}
      `,
            errors: [
                {
                    messageId: "switchFinalBreakNever",
                    line: 5,
                    column: 9
                }
            ]
        },

        {
            code: `
outer2: while (true) {
    inner: switch (x) {
        case 0:
            ++x;
            break;
        default:
            break inner;
    }
}      `,
            output: `
outer2: while (true) {
    inner: switch (x) {
        case 0:
            ++x;
            break;
        default:
    }
}      `,
            errors: [
                {
                    messageId: "switchFinalBreakNever",
                    line: 8,
                    column: 13
                }
            ]
        },

        // always option
        {
            code: `switch (x) {
  case 0:
    foo();
  }`,
            output: `switch (x) {
  case 0:
    foo();
    break;
  }`,
            options: ["always"],
            errors: [
                {
                    messageId: "switchFinalBreakAlways",
                    line: 2,
                    column: 3
                }
            ]
        },
        {
            code: `switch (x) {
  case 0: {
      foo();
    }
  }`,
            output: `switch (x) {
  case 0: {
      foo();
      break;
    }
  }`,
            options: ["always"],
            errors: [
                {
                    messageId: "switchFinalBreakAlways",
                    line: 2,
                    column: 3
                }
            ]
        },
        {
            code: `switch (x) {
  default:
    foo();
  }`,
            output: `switch (x) {
  default:
    foo();
    break;
  }`,
            options: ["always"],
            errors: [
                {
                    messageId: "switchFinalBreakAlways",
                    line: 2,
                    column: 3
                }
            ]
        },
        {
            code: `switch (x) {
  default: {
      foo();
    }
  }`,
            output: `switch (x) {
  default: {
      foo();
      break;
    }
  }`,
            options: ["always"],
            errors: [
                {
                    messageId: "switchFinalBreakAlways",
                    line: 2,
                    column: 3
                }
            ]
        },
        {
            code: `switch (x) {
  case 0:
  }`,
            output: `switch (x) {
  case 0: break;
  }`,
            options: ["always"],
            errors: [
                {
                    messageId: "switchFinalBreakAlways",
                    line: 2,
                    column: 3
                }
            ]
        }
    ]
});
