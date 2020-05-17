# Import Sorting (advanced-sort-imports)

### Type of imports declarations:

```js
// global
import Global from 'global.js';

// absolute
import Absolute from '@/absolute.js';

// local
import Local from './local.js';
```

### Type of imports syntax:

```js
// default
import Default from 'default.js';

// single
import { attribute } from 'single.js';

// multiple
import { attribute1, attribute2 } from 'multiple.js';

// mix
import Default1, { attribute } from 'mix1.js';
import Default2, { attribute1, attribute2 } from 'mix2.js';

//none
import 'none.js';
```

## Options

This rule can be customized:

* declarationSortOrder: (default: ["global", "absolute", "local"])
* declarationSyntaxSortOrder: (default: ["default", "mix", "single", "multiple", "none"])
* absoluteImportPrefix: (default: "@")
* ignoreDeclarationSort: (default: false)
* ignoreDeclarationSyntaxSort: (default: false)
* ignoreMemberSort: (default: false)
* ignoreCase: (default: false)
* ignoreSourceValueSort: (default: false)
* ignoreMissingBlankLineBetweenDeclarations: (default: false)

### Example for rule settings in .eslintrc

```js
  "sort-imports": ["error", {
    ignoreDeclarationSort: true,
    ignoreSourceValueSort: true,
    declarationSortOrder: ["local", "absolute", "global"]
  }]
```

## How imports looks with default settings

```js
import DefaultGlobal from 'global';
import DefaultGlobal, { SingleGlobal } from 'global';
import { SingleGlobal } from 'global';
import { MultipleGlobal, MultipleGlobal1 } from 'global';

import DefaultAbsolute from '@/absolute';
import DefaultAbsolute, { SingleAbsulute } from '@/absolute';
import { SingleAbsulute } from '@/absolute';
import { MultipleAbsolute, MultipleAbsolute1 } from '@/absolute';

import DefaultLocal from './local';
import DefaultLocal, { SingleLocal } from './local';
import { SingleLocal } from './local';
import { MultipleLocal, MultipleLocal1 } from './local';
```
