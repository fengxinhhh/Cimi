const { exec } = require('child_process')
const { cyan, green, red } = require('chalk')
const getVersion = require('./getVersion')
const fs = require('fs')
const path = require('path')

module.exports = async function(options) {
  //获取新的版本号
  function getNewVersion(oldVersion) {
    let [major, minor, patch] = oldVersion.split('.')
    if(patch.length > 2 && patch.includes('-beta')) {
      patch = Number(patch.split('-')[0]);
    }
    switch (type) {
      case 'patch':
        return `${major}.${minor}.${+patch + 1}`
      case 'minor':
        return `${major}.${+minor + 1}.${patch}`
      case 'major':
        return `${+major + 1}.${minor}.${patch}`
      case 'patchBeta':
        return `${major}.${minor}.${+patch + 1}-beta`
      case 'minorBeta':
        return `${major}.${+minor + 1}.${patch}-beta`
      case 'majorBeta':
        return `${+major + 1}.${minor}.${patch}-beta`
      default:
        console.error(
          red('\nPlease write correctly update type: patch、minor、major、patchBeta、minorBeta、majorBeta\n')
        )
        process.exit(1)
    }
  }
  //写入新版本号，更新项目文件
  function writeNewVersion() {
    const packageJson = fs.readFileSync(
      path.resolve(process.cwd(), 'package.json'),
      'utf8'
    )
    const newPackageJson = packageJson.replace(
      `"version": "${projectVersion}"`,
      `"version": "${newVersion}"`
    )
    fs.writeFileSync(
      path.resolve(process.cwd(), 'package.json'),
      newPackageJson
    )
    console.log(green('\nUpdate package.json success!'))
  }
  //执行整个流程的命令
  function execShell() {
    const shellList = [
      `echo "\n${green('[ 1 / 3 ]')} ${cyan(
        `Commit and push to ${branch} branch`
      )}\n"`,
      'git add .',
      `git commit -m "${type} version to ${newVersion}"`,
      `git push origin ${branch}`,
      `echo "\n${green('[ 2 / 3 ]')} ${cyan(
        `Tag and push tag to ${branch}`
      )}\n"`,
      `git tag ${newVersion}`,
      `git push origin ${newVersion}`,
      `echo "\n${green('[ 3 / 3 ]')} ${cyan('Publish to NPM')}\n"`,
      `npm publish ${options.accessPublic ? '--access=public' : ''}`,
    ].join(' && ')
    return new Promise((resolve) => {
      const childExec = exec(
        shellList,
        { maxBuffer: 10000 * 10240 },
        (err, stdout) => {
          if (err) {
            console.log(err)
            throw err
          } else {
            resolve('')
          }
        }
      )
      childExec.stdout.pipe(process.stdout)
      childExec.stderr.pipe(process.stderr)
    })
  }

  const [type, branch = 'master'] = options.args
  console.log(type, branch, options.args)
  const { projectVersion, projectName } = await getVersion()
  console.log(green(`Start to ${type} version to ${projectName}...`))
  const newVersion = getNewVersion(projectVersion)
  writeNewVersion()
  console.log(green(`\nVersion: ${cyan(`${projectVersion} -> ${newVersion}`)}`))
  console.log(green(`${type} ${projectName} version to ${newVersion}`))
  await execShell()
  console.log(`\n${green('[ Cimi ]')} Release ${projectName} Success!\n`)
}

