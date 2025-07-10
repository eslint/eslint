/*eslint no-restricted-imports: ["error", {
  "paths": [{
    "name": "some-module",
    "importNames": ["someModule"]
  }]
}]*/

// This is allowed
import someModule = require("some-module");
