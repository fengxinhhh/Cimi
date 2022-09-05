#!/usr/bin/env node

const program = require('commander')
const { version } = require('../package.json')
const cimi = require('../index')

program
  .version(version)
  .option('patch', 'patch your new npm package')
  .option('minor', 'minor your new npm package')
  .option('major', 'major your new npm package')
  .parse(process.argv)
console.log('这是我创建的一个文件，目录：/bin/www')

cimi(program)
