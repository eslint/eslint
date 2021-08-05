"use strict";

exports.parse = function (text, parserOptions) {
    return {
        "type": "Program",
        "start": 0,
        "end": 0,
        "loc": {
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 0
          }
        },
        "range": [
          0,
          0
        ],
        "body": [],
        "sourceType": "script",
        "comments": [],
        "tokens": []
      };
};
