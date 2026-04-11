const fs = require("node:fs");
const path = require("node:path");

function absolute(input, root) {
	return path.isAbsolute(input) ? input : path.resolve(root, input);
}

function walk(cwd) {
	let tmp = absolute(cwd, cwd);
	const root = absolute("/", cwd);
	const arr = [];
	let prev;
	while (prev !== root) {
		arr.push(tmp);
		prev = tmp;
		tmp = path.dirname(tmp);
		if (tmp === prev) break;
	}
	return arr;
}

function findFiles(names, cwd) {
	for (const dir of walk(cwd)) {
		for (const name of names) {
			const file = path.join(dir, name);
			if (fs.existsSync(file)) return file;
		}
	}
}

module.exports = findFiles;
