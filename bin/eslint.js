#!/usr/bin/env node

var cli = require("../lib/cli"),
    concat = require("concat-stream");

var args = Array.prototype.slice.call(process.argv, 2),
    useStdin = args[args.length - 1] === "-";

function main(source) {

    // If using stdin, add a fake filename
    if (useStdin) {
        args[args.length - 1] = "<stdin>";
    }

    var exitCode = cli.execute(args, source);
    process.exit(exitCode);
}

if (useStdin) {
    process.stdin.pipe(concat({encoding: "string"}, function(data) {
        main(data);
    }));
} else {
    main(null);
}
