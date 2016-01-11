# Import Sorting (sort-imports)

The import statement is used to import members (functions, objects or primitives) that have been exported from an external module. Using a specific member syntax:

```js
// single - Import single member.
import myMember from "my-module.js";

// multiple - Import multiple members.
import {foo, bar} from "my-module.js";

// all - Import all members, where myModule contains all the exported bindings.
import * as myModule from "my-module.js";
```

The import statement can also import a module without exported bindings. Used when the module does not export anything, but runs it own code or changes the global context object.

```js
// none - Import module without exported bindings.
import "my-module.js"
```

When declaring multiple imports, a sorted list of import declarations make it easier for developers to read the code and find necessary imports later. This rule is purely a matter of style.


## Rule Details

This rule checks all import declarations and verifies that all imports are first sorted by the used member syntax and then alphabetically by the first member or alias name.

The sort order of import declarations based on the member syntax can be configured via the `memberSyntaxSortOrder` option.
The default member syntax sort order is:

- `none` - import module without exported bindings.
- `all` - import all members provided by exported bindings.
- `multiple` - import multiple members.
- `single` - import single member.

The following example shows correct sorted import declarations:

```js
/*eslint sort-imports: 2*/
import 'module-without-export.js';
import * as foo from 'foo.js';
import * as bar from 'bar.js';
import {alpha, beta} from 'alpha.js';
import {delta, gamma} from 'delta.js';
import a from 'baz.js';
import b from 'qux.js';
```

The following patterns are considered problems:

```js
/*eslint sort-imports: 2*/
import b from 'foo.js';
import a from 'bar.js'; /*error Imports should be sorted alphabetically.*/

/*eslint sort-imports: 2*/
import a from 'foo.js';
import A from 'bar.js'; /*error Imports should be sorted alphabetically.*/

/*eslint sort-imports: 2*/
import {b, c} from 'foo.js';
import {a, b} from 'bar.js'; /*error Imports should be sorted alphabetically.*/

/*eslint sort-imports: 2*/
import a from 'foo.js';
import {b, c} from 'bar.js'; /*error Imports should be sorted by their member syntax. Use 'multiple' before 'single' member syntax.*/

/*eslint sort-imports: 2*/
import a from 'foo.js';
import * as b from 'bar.js'; /*error Imports should be sorted by their member syntax. Use 'all' before 'single' member syntax. */

/*eslint sort-imports: 2*/
import {b, a, c} from 'foo.js' /*error Members of an import declaration should be sorted alphabetically.*/
```

The following patterns are not considered problems:

```js
/*eslint sort-imports: 2*/
import a from 'foo.js';
import b from 'bar.js';
import c from 'baz.js';

/*eslint sort-imports: 2*/
import 'foo.js'
import * from 'bar.js';
import {a, b} from 'baz.js';
import c from 'qux.js';

/*eslint sort-imports: 2*/
import {a, b, c} from 'foo.js'
```


### Options

This rule accepts an object with its properties as

- `ignoreCase` (default: `false`)
- `ignoreMemberSort` (default: `false`)
- `memberSyntaxSortOrder` (default: `["none", "all", "multiple", "single"]`)

Default option settings are

```json
{
    "sort-imports": [2, {
        "ignoreCase": false,
        "ignoreMemberSort": false,
        "memberSyntaxSortOrder": ["none", "all", "multiple", "single"]
    }]
}
```

#### ignoreCase

When `true` the rule ignores the case-sensitivity of the imports local name.

The following patterns are considered problems:

```js
/*eslint sort-imports: [2, { "ignoreCase": true }]*/

import B from 'foo.js';
import a from 'bar.js';
```

The following patterns are not considered problems:

```js
/*eslint sort-imports: [2, { "ignoreCase": true }]*/

import a from 'foo.js';
import B from 'bar.js';
import c from 'baz.js';
```

Default is `false`.

#### ignoreMemberSort

Ignores the member sorting within a `multiple` member import declaration.

The following patterns are considered problems:

```js
/*eslint sort-imports: 2*/
import {b, a, c} from 'foo.js' /*error Members of an import declaration should be sorted alphabetically.*/
```

The following patterns are not considered problems:

```js
/*eslint sort-imports: [2, { "ignoreMemberSort": true }]*/
import {b, a, c} from 'foo.js'
```

Default is `false`.

#### memberSyntaxSortOrder

The member syntax sort order can be configured with this option. There are four different styles and the default member syntax sort order is:

- `none` - import module without exported bindings.
- `all` - import all members provided by exported bindings.
- `multiple` - import multiple members.
- `single` - import single member.

Use this option if you want a different sort order. Every style must be defined in the sort order (There shall be four items in the array).

The following patterns are considered problems:

```js
/*eslint sort-imports: 2*/
import a from 'foo.js';
import * as b from 'bar.js'; /*error Imports should be sorted by their member syntax. Use 'all' before 'single' member syntax. */
```

The following patterns are not considered problems:

```js
/*eslint sort-imports: [2, { "memberSyntaxSortOrder": ['single', 'all', 'multiple', 'none'] }]*/

import a from 'foo.js';
import * as b from 'bar.js';

/*eslint sort-imports: [2, { "memberSyntaxSortOrder": ['all', 'single', 'multiple', 'none'] }]*/

import * as foo from 'foo.js';
import z from 'zoo.js';
import {a, b} from 'foo.js';

```

Default is `["none", "all", "multiple", "single"]`.

## When not to use

This rule is a formatting preference and not following it won't negatively affect the quality of your code. If you alphabetizing imports isn't a part of your coding standards, then you can leave this rule disabled.
