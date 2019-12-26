# the JSON Schema of JSON Schema

This is downloaded from https://json-schema.org/draft-04/schema and modifies a line in order to support `bigint` type.

```diff
@@ -18,3 +18,3 @@
          "simpleTypes": {
-             "enum": [ "array", "boolean", "integer", "null", "number", "object", "string" ]
+             "enum": [ "array", "boolean", "integer", "null", "number", "object", "string", "bigint" ]
          }
```
