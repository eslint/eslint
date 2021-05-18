# ScopeManager

This document was written based on the implementation of [eslint-scope](https://github.com/eslint/eslint-scope), a fork of [escope](https://github.com/estools/escope), and deprecates some members ESLint is not using.

----

## ScopeManager interface

`ScopeManager` object has all variable scopes.

### Fields

#### scopes

* **Type:** `Scope[]`
* **Description:** All scopes.

#### globalScope

* **Type:** `Scope`
* **Description:** The root scope.

### Methods

#### acquire(node, inner = false)

* **Parameters:**
    * `node` (`ASTNode`) ... An AST node to get their scope.
    * `inner` (`boolean`) ... If the node has multiple scope, this returns the outermost scope normally. If `inner` is `true` then this returns the innermost scope. Default is `false`.
* **Return type:** `Scope | null`
* **Description:** Get the scope of a given AST node. The gotten scope's `block` property is the node. This method never returns `function-expression-name` scope and `TDZ` scope. If the node does not have their scope, this returns `null`.

#### getDeclaredVariables(node)

* **Parameters:**
    * `node` (`ASTNode`) ... An AST node to get their variables.
* **Return type:** `Variable[]`
* **Description:** Get the variables that a given AST node defines. The gotten variables' `def[].node`/`def[].parent` property is the node. If the node does not define any variable, this returns an empty array.

### Deprecated members

Those members are defined but not used in ESLint.

#### isModule()

* **Parameters:**
* **Return type:** `boolean`
* **Description:** `true` if this program is module.

#### isImpliedStrict()

* **Parameters:**
* **Return type:** `boolean`
* **Description:** `true` if this program is strict mode implicitly. I.e., `options.impliedStrict === true`.

#### isStrictModeSupported()

* **Parameters:**
* **Return type:** `boolean`
* **Description:** `true` if this program supports strict mode. I.e., `options.ecmaVersion >= 5`.

#### acquireAll(node)

* **Parameters:**
    * `node` (`ASTNode`) ... An AST node to get their scope.
* **Return type:** `Scope[] | null`
* **Description:** Get the scopes of a given AST node. The gotten scopes' `block` property is the node. If the node does not have their scope, this returns `null`.

----

## Scope interface

`Scope` object has all variables and references in the scope.

### Fields

#### type

* **Type:** `string`
* **Description:** The type of this scope. This is one of `"block"`, `"catch"`, `"class"`, `"for"`, `"function"`, `"function-expression-name"`, `"global"`, `"module"`, `"switch"`, `"with"`, `"TDZ"`

#### isStrict

* **Type:** `boolean`
* **Description:** `true` if this scope is strict mode.

#### upper

* **Type:** `Scope | null`
* **Description:** The parent scope. If this is the global scope then this property is `null`.

#### childScopes

* **Type:** `Scope[]`
* **Description:** The array of child scopes. This does not include grandchild scopes.

#### variableScope

* **Type:** `Scope`
* **Description:** The scope which hosts variables which are defined by `var` declarations.

#### block

* **Type:** `ASTNode`
* **Description:** The AST node which created this scope.

#### variables

* **Type:** `Variable[]`
* **Description:** The array of all variables which are defined on this scope. This does not include variables which are defined in child scopes.

#### set

* **Type:** `Map<string, Variable>`
* **Description:** The map from variable names to variable objects.

> I hope to rename `set` field or replace by a method.

#### references

* **Type:** `Reference[]`
* **Description:** The array of all references on this scope. This does not include references in child scopes.

#### through

* **Type:** `Reference[]`
* **Description:** The array of references which could not be resolved in this scope.

#### functionExpressionScope

* **Type:** `boolean`
* **Description:** `true` if this scope is `"function-expression-name"` scope.

> I hope to deprecate `functionExpressionScope` field as replacing by `scope.type === "function-expression-name"`.

### Deprecated members

Those members are defined but not used in ESLint.

#### taints

* **Type:** `Map<string, boolean>`
* **Description:** The map from variable names to `tainted` flag.

#### dynamic

* **Type:** `boolean`
* **Description:** `true` if this scope is dynamic. I.e., the type of this scope is `"global"` or `"with"`.

#### directCallToEvalScope

* **Type:** `boolean`
* **Description:** `true` if this scope contains `eval()` invocations.

#### thisFound

* **Type:** `boolean`
* **Description:** `true` if this scope contains `this`.

#### resolve(node)

* **Parameters:**
    * `node` (`ASTNode`) ... An AST node to get their reference object. The type of the node must be `"Identifier"`.
* **Return type:** `Reference | null`
* **Description:** Returns `this.references.find(r => r.identifier === node)`.

#### isStatic()

* **Parameters:**
* **Return type:** `boolean`
* **Description:** Returns `!this.dynamic`.

#### isArgumentsMaterialized()

* **Parameters:**
* **Return type:** `boolean`
* **Description:** `true` if this is a `"function"` scope which has used `arguments` variable.

#### isThisMaterialized()

* **Parameters:**
* **Return type:** `boolean`
* **Description:** Returns `this.thisFound`.

#### isUsedName(name)

* **Parameters:**
    * `name` (`string`) ... The name to check.
* **Return type:** `boolean`
* **Description:** `true` if a given name is used in variable names or reference names.

----

## Variable interface

`Variable` object is variable's information.

### Fields

#### name

* **Type:** `string`
* **Description:** The name of this variable.

#### identifiers

* **Type:** `ASTNode[]`
* **Description:** The array of `Identifier` nodes which define this variable. If this variable is redeclared, this array includes two or more nodes.

> I hope to deprecate `identifiers` field as replacing by `defs[].name` field.

#### references

* **Type:** `Reference[]`
* **Description:** The array of the references of this variable.

#### defs

* **Type:** `Definition[]`
* **Description:** The array of the definitions of this variable.

### Deprecated members

Those members are defined but not used in ESLint.

#### tainted

* **Type:** `boolean`
* **Description:** The `tainted` flag. (always `false`)

#### stack

* **Type:** `boolean`
* **Description:** The `stack` flag. (I'm not sure what this means.)

----

## Reference interface

`Reference` object is reference's information.

### Fields

#### identifier

* **Type:** `ASTNode`
* **Description:** The `Identifier` node of this reference.

#### from

* **Type:** `Scope`
* **Description:** The `Scope` object that this reference is on.

#### resolved

* **Type:** `Variable | null`
* **Description:** The `Variable` object that this reference refers. If such variable was not defined, this is `null`.

#### writeExpr

* **Type:** `ASTNode | null`
* **Description:** The ASTNode object which is right-hand side.

#### init

* **Type:** `boolean`
* **Description:** `true` if this writing reference is a variable initializer or a default value.

### Methods

#### isWrite()

* **Parameters:**
* **Return type:** `boolean`
* **Description:** `true` if this reference is writing.

#### isRead()

* **Parameters:**
* **Return type:** `boolean`
* **Description:** `true` if this reference is reading.

#### isWriteOnly()

* **Parameters:**
* **Return type:** `boolean`
* **Description:** `true` if this reference is writing but not reading.

#### isReadOnly()

* **Parameters:**
* **Return type:** `boolean`
* **Description:** `true` if this reference is reading but not writing.

#### isReadWrite()

* **Parameters:**
* **Return type:** `boolean`
* **Description:** `true` if this reference is reading and writing.

### Deprecated members

Those members are defined but not used in ESLint.

#### tainted

* **Type:** `boolean`
* **Description:** The `tainted` flag. (always `false`)

#### flag

* **Type:** `number`
* **Description:** `1` is reading, `2` is writing, `3` is reading/writing.

#### partial

* **Type:** `boolean`
* **Description:** The `partial` flag.

#### isStatic()

* **Parameters:**
* **Return type:** `boolean`
* **Description:** `true` if this reference is resolved statically.

----

## Definition interface

`Definition` object is variable definition's information.

### Fields

#### type

* **Type:** `string`
* **Description:** The type of this definition. One of `"CatchClause"`, `"ClassName"`, `"FunctionName"`, `"ImplicitGlobalVariable"`, `"ImportBinding"`, `"Parameter"`, `"TDZ"`, and `"Variable"`.

#### name

* **Type:** `ASTNode`
* **Description:** The `Identifier` node of this definition.

#### node

* **Type:** `ASTNode`
* **Description:** The enclosing node of the name.

| type                       | node |
|:---------------------------|:-----|
| `"CatchClause"`            | `CatchClause`
| `"ClassName"`              | `ClassDeclaration` or `ClassExpression`
| `"FunctionName"`           | `FunctionDeclaration` or `FunctionExpression`
| `"ImplicitGlobalVariable"` | `Program`
| `"ImportBinding"`          | `ImportSpecifier`, `ImportDefaultSpecifier`, or `ImportNamespaceSpecifier`
| `"Parameter"`              | `FunctionDeclaration`, `FunctionExpression`, or `ArrowFunctionExpression`
| `"TDZ"`                    | ?
| `"Variable"`               | `VariableDeclarator`

#### parent

* **Type:** `ASTNode | undefined | null`
* **Description:** The enclosing statement node of the name.

| type                       | parent |
|:---------------------------|:-------|
| `"CatchClause"`            | `null`
| `"ClassName"`              | `null`
| `"FunctionName"`           | `null`
| `"ImplicitGlobalVariable"` | `null`
| `"ImportBinding"`          | `ImportDeclaration`
| `"Parameter"`              | `null`
| `"TDZ"`                    | `null`
| `"Variable"`               | `VariableDeclaration`

### Deprecated members

Those members are defined but not used in ESLint.

#### index

* **Type:** `number | undefined | null`
* **Description:** The index in the declaration statement.

#### kind

* **Type:** `string | undefined | null`
* **Description:** The kind of the declaration statement.
