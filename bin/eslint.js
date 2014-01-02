#!/usr/bin/env node

var cli = require("../lib/cli");
var useStdin = !process.stdin.isTTY;

function main(source) {
    var args = Array.prototype.slice.call(process.argv, 2)

    // If using stdin, add a fake filename
    if (useStdin) {
        args.push("<stdin>");
    }

    var exitCode = cli.execute(args, source);
    process.exit(exitCode);
}

if (useStdin) {
    source = "";
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    process.stdin.on("data", function(chunk) {
        source += chunk;
    });

    process.stdin.on("end", function() {
        main(source);
    });
} else {
    main(null);
}
