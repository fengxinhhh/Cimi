#!/usr/bin/env node

const program = require('commander')
const { green, red } = require('chalk')
const { version } = require('../package.json')
const cimi = require('../index')

program
  .version(version)
  .option('patch', 'patch your new npm package')
  .option('minor', 'minor your new npm package')
  .option('major', 'major your new npm package')
  .on('--help', () => {
    console.log('\n  Tips:\n')
    console.log(
      '    You should run this script in the root directory of you project or run by npm scripts.'
    )
    console.log('\n  Examples:\n')
    console.log(`    ${green('$')} cimi patch [branch]`)
    console.log(`    ${green('$')} cimi minor [branch]`)
    console.log(`    ${green('$')} cimi major [branch]`)
  })
  .parse(process.argv)

cimi(program).catch((err) => {
  console.error(`${red(err)}`)
  process.exit(1)
})
