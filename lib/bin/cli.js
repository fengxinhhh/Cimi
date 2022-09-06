#!/usr/bin/env node
"use strict";
var program = require('commander');
var version = require('../package.json').version;
var _a = require('chalk'), green = _a.green, red = _a.red;
var cimi = require('../lib/index');
program
    .version(version, '-v, --version')
    .option('patch', 'patch your new npm package')
    .option('minor', 'minor your new npm package')
    .option('major', 'major your new npm package')
    .on('--help', function () {
    console.log('\n  Tip:\n');
    console.log('    You should run this script in the root directory of you project or run by npm scripts.');
    console.log('\n  Examples:\n');
    console.log("    ".concat(green('$'), " cimi patch [branch] (default: master)"));
    console.log("    ".concat(green('$'), " cimi minor [branch] (default: master)"));
    console.log("    ".concat(green('$'), " cimi major [branch] (default: master)"));
    console.log('');
})
    .parse(process.argv);
cimi(program).catch(function (err) {
    console.error("".concat(red(err)));
    process.exit(1);
});
