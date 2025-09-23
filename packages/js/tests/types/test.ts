/*eslint no-restricted-imports: ["error", { patterns: [{
    group: ["import/private/*"],
	allowImportNamePattern: ["Bar", "Foo"],
	allowTypeImports: true,
}]}]*/

import type { Bar } from "import/private/bar";
import { Fooz, type Foo  } from "import/private/bar";
