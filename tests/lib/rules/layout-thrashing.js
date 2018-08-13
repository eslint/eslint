/*
 * @fileoverview Rule to find Layout Thrashing
 * @author Bala Sundar @jankhuter
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/layout-thrashing"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("layout-thrashing", rule, {
    valid: [
        "function f(){var dimensions = document.getElementById('id').getBoundingClientRect();document.getElementById('id').appendChild(elem);}",
        "function f(){for(var i = 0; i < len; i++){dimensions[i] = document.getElementById('id').children[i].getBoundingClientRect();}for(var i = 0; i < len; i++){document.getElementById('id'+i).appendChild(elem);}}",
        "function f(){document.getElementById('id').forEach(function(){var dimensions = document.getElementById('id').getBoundingClientRect();});document.getElementById('id').forEach(function(){document.getElementById('id').appendChild(elem);});}",
        "function f(){document.getElementById('id').forEach(function(){var dimensions = document.getElementById('id').getBoundingClientRect();document.getElementById('myBtn').addEventListener('click', function(){document.getElementById('id').appendChild(elem);});});}",
        "function f(){if(a){document.getElementById('id').appendChild(elem);}else{var dimensions = document.getElementById('id').getBoundingClientRect();}}",
        "function f(){switch(a){case 'bala':document.getElementById('id').appendChild(elem);break;case 'sundar':var dimensions = document.getElementById('id').getBoundingClientRect();break;}}",
        "function f(){document.getElementById('id').appendChild(elem);var dimensions = document.getElementById('id').style.height;}",
        "function f(){var boundingRect = document.getElementById('id').getBoundingClientRect();document.getElementById('id').appendChild(elem);document.getElementById('id').top=boundingRect.top}",
        "function f(){var boundingRect = {}; boundingRect.top= document.getElementById('id').getBoundingClientRect().top;document.getElementById('id').appendChild(elem);document.getElementById('id').top=boundingRect.top}",
        "function f(){var width = document.getElementById('id').offsetWidth;document.getElementById('id').appendChild(elem);}",
        "function f(){var width = document.getElementById('id').offsetWidth;document.getElementById('id').setAttribute('height','100px');}",
        "function f(){var width = document.getElementById('id').offsetWidth;document.getElementById('id').removeAttribute('height');}"
    ],
    invalid: [
        {
            code: "function f(){document.getElementById('id').appendChild(elem);var dimensions = document.getElementById('id').getBoundingClientRect();}",
            errors: [{ messageId: "alternate", line: 1, column: 79 }]
        },
        {
            code: "function f(){for(var i = 0; i < len; i++){var dimensions = document.getElementById('id').children[i].getBoundingClientRect();document.getElementById('id'+i).appendChild(elem);}}",
            errors: [{ messageId: "alternate", line: 1, column: 126 }]
        },
        {
            code: "function f(){document.getElementById('id').forEach(function(){var dimensions = document.getElementById('id').getBoundingClientRect();document.getElementById('id').appendChild(elem);});}",
            errors: [{ messageId: "alternate", line: 1, column: 134 }]
        },
        {
            code: "function f(){document.getElementById('id').style.height='100px';var width = document.getElementById('id').offsetWidth;}",
            errors: [{ messageId: "alternate", line: 1, column: 77 }]
        },
        {
            code: "function f(){document.getElementById('id').setAttribute('height','100px');var width = document.getElementById('id').offsetWidth;}",
            errors: [{ messageId: "alternate", line: 1, column: 87 }]
        }
    ]
});
