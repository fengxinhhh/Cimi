const fs = require('fs')
const path = require('path')

module.exports = async function() {
  const packageJson = fs.readFileSync(
    path.join(__dirname, './package.json'),
    'utf8'
  )
  return {
    projectVersion: JSON.parse(packageJson).version,
    projectName: JSON.parse(packageJson).name,
  }
}
