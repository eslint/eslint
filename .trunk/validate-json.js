#!/usr/bin/env node

const fs = require('fs');

// Get the command line arguments
const args = process.argv.slice(2);

// Find the index of the --files argument
const filesArgIndex = args.indexOf('--files');

// If --files is not found or there's no argument after it, print an error and exit
if (filesArgIndex === -1 || filesArgIndex === args.length - 1) {
    console.error('Error: Expected --files argument followed by a comma-separated list of filenames');
    process.exit(1);
}

// Get the filenames from the argument after --files, splitting on commas
const filenames = args[filesArgIndex + 1].split(',');

filenames.forEach(filename => {
    fs.readFile(filename, 'utf8', (err, fileContents) => {
        if (err) {
            console.error(`Failed to read file ${filename}: ${err}`);
            return;
        }

        try {
            // Try to parse the file contents as JSON
            JSON.parse(fileContents);
        } catch (parseErr) {
            const match = parseErr.message.match(/at position (\d+)/);
            if (match) {
                const position = parseInt(match[1], 10);
                const lines = fileContents.slice(0, position).split('\n');
                const line = lines.length;
                const column = lines[lines.length - 1].length + 1;
                console.error(`Failed to parse file ${filename} as JSON at line ${line}, column ${column}: ${parseErr}`);
            } else {
                console.error(`Failed to parse file ${filename} as JSON: ${parseErr}`);
            }
        }
    });
});