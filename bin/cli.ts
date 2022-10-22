#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');
const { green, red, cyan } = require('chalk');
const cimi = require('../index.ts');

program
  .name('cimi')
  .description(
    'A fully automatic NPM package tool, one line command to help you "git add/commit/push, create git tag, release NPM package"'
  )
  .version(pkg.version, '-v, --version')
  .option('manual', 'manual select your new package version')
  .option('patch', 'patch your new npm package')
  .option('minor', 'minor your new npm package')
  .option('major', 'major your new npm package')
  .option('beta', 'beta your new npm package')
  .option('upgradeBeta', 'upgrade your new npm package')
  // .option("patchBeta", "patch your new beta npm package")
  // .option("minorBeta", "minor your new beta npm package")
  // .option("majorBeta", "major your new beta npm package")
  .on('--help', () => {
    console.log('\n  Tip:\n');
    console.log(
      '    You should run this script in the root directory of you project or run by npm scripts.'
    );
    console.log('\n  Examples:\n');
    console.log(`    ${green('$')} cimi manual [branch] (default: master)`);
    console.log(`    ${green('$')} cimi patch [branch] (default: master)`);
    console.log(`    ${green('$')} cimi minor [branch] (default: master)`);
    console.log(`    ${green('$')} cimi major [branch] (default: master)`);
    console.log(`    ${green('$')} cimi beta [branch] (default: master)`);
    console.log(`    ${green('$')} cimi upgradeBeta [branch] (default: master)`);
    // console.log(`    ${green('$')} cimi patchBeta [branch] (default: master)`)
    // console.log(`    ${green('$')} cimi minorBeta [branch] (default: master)`)
    // console.log(`    ${green('$')} cimi majorBeta [branch] (default: master)`)
    console.log('');
  })
  .parse(process.argv);

cimi(program).catch(err => {
  console.error(`${red(err)}`);
  process.exit(1);
});
